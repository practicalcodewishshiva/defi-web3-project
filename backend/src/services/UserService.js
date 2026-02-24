const { User } = require('../database/models');
const { NotFoundError, ConflictError } = require('../utils/errors');
const { verifyWalletSignature } = require('../lib/blockchain');
const logger = require('../utils/logger');

class UserService {
  async getUserByWallet(walletAddress) {
    return User.findOne({
      where: { walletAddress: walletAddress.toLowerCase() },
    });
  }

  async getUserById(userId) {
    return User.findOne({
      where: { id: userId },
    });
  }

  async createUser(walletAddress, username) {
    const existingUser = await this.getUserByWallet(walletAddress);
    if (existingUser) {
      throw new ConflictError('User with this wallet address already exists');
    }

    const existingUsername = await User.findOne({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictError('Username already taken');
    }

    return User.create({
      walletAddress: walletAddress.toLowerCase(),
      username,
    });
  }

  async updateUser(userId, data) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    if (data.username && data.username !== user.username) {
      const existing = await User.findOne({
        where: { username: data.username },
      });
      if (existing) {
        throw new ConflictError('Username already taken');
      }
    }

    await user.update(data);
    return user;
  }

  async getUserStats(userId) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    return {
      totalBattles: user.totalBattles,
      totalWins: user.totalWins,
      totalDefeats: user.totalDefeats,
      winRate: user.totalBattles > 0 
        ? Math.round((user.totalWins / user.totalBattles) * 100) 
        : 0,
      eloRating: user.eloRating,
      totalEarnings: user.totalEarnings,
    };
  }

  async getLeaderboard(limit = 100) {
    return User.findAll({
      attributes: ['id', 'walletAddress', 'username', 'eloRating', 'totalWins', 'totalBattles', 'profileImage'],
      order: [['eloRating', 'DESC']],
      limit,
    });
  }

  async updateUserStats(userId, updates) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    const data = {};
    if (updates.totalBattles !== undefined) {
      data.totalBattles = user.totalBattles + updates.totalBattles;
    }
    if (updates.totalWins !== undefined) {
      data.totalWins = user.totalWins + updates.totalWins;
    }
    if (updates.totalDefeats !== undefined) {
      data.totalDefeats = user.totalDefeats + updates.totalDefeats;
    }
    if (updates.eloRating !== undefined) {
      data.eloRating = user.eloRating + updates.eloRating;
    }
    if (updates.totalEarnings !== undefined) {
      data.totalEarnings = user.totalEarnings + updates.totalEarnings;
    }

    await user.update(data);
    return user;
  }

  async verifyWalletSignature(walletAddress, message, signature) {
    try {
      return await verifyWalletSignature(walletAddress, message, signature);
    } catch (error) {
      logger.error('Error verifying wallet signature:', error);
      return false;
    }
  }
}

const userService = new UserService();

module.exports = {
  UserService,
  userService
};
