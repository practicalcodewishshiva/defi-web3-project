const { userService } = require('../services/UserService');
const logger = require('../utils/logger');

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      walletAddress: user.walletAddress,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { username, email, profileImage, bio } = req.body;

    const user = await userService.updateUser(userId, {
      username,
      email,
      profileImage,
      bio,
    });

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const stats = await userService.getUserStats(userId);
    res.status(200).json(stats);
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const leaderboard = await userService.getLeaderboard(limit);

    res.status(200).json(leaderboard);
  } catch (error) {
    logger.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserPublic = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      profileImage: user.profileImage,
      bio: user.bio,
      eloRating: user.eloRating,
      totalWins: user.totalWins,
      totalBattles: user.totalBattles,
    });
  } catch (error) {
    logger.error('Get user public error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getStats,
  getLeaderboard,
  getUserPublic
};
