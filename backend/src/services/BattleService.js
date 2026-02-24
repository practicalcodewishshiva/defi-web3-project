const { Battle, InventoryItem } = require('../database/models');
const { NotFoundError, ValidationError } = require('../utils/errors');
const {
  calculateWinProbability,
  calculateEloChange,
  calculateRewards,
} = require('../utils/helpers');
const { BATTLE_TYPE, BATTLE_CONSTANTS } = require('../constants');
const { heroService } = require('./HeroService');
const { userService } = require('./UserService');
const { mintArtifact } = require('../lib/blockchain');
const logger = require('../utils/logger');

class BattleService {
  async simulatePvEBattle(playerId, playerHeroId) {
    const hero = await heroService.getHeroById(playerHeroId);
    if (!hero) {
      throw new NotFoundError('Hero');
    }

    if (hero.ownerId !== playerId) {
      throw new ValidationError('You do not own this hero');
    }

    const heroStats = await heroService.getHeroTotalStats(playerHeroId);
    const opponentStats = Math.round(
      heroStats.totalStats * (0.8 + Math.random() * 0.4),
    );

    const winChance = calculateWinProbability(
      heroStats.totalStats,
      opponentStats,
    );
    const won = Math.random() < winChance;

    const user = await userService.getUserById(playerId);
    if (!user) {
      throw new NotFoundError('User');
    }

    const { gold, shards } = calculateRewards(won, user.eloRating);
    const eloDelta = won ? Math.round(16 * (1 - winChance)) : -Math.round(16 * winChance);

    const battle = await Battle.create({
      playerId,
      playerHeroId,
      battleType: BATTLE_TYPE.PVE || 'PvE',
      winner: won ? playerId : undefined,
      playerStartHp: heroStats.totalStats,
      playerEndHp: won ? Math.round(heroStats.totalStats * 0.8) : 0,
      opponentStartHp: opponentStats,
      opponentEndHp: won ? 0 : Math.round(opponentStats * 0.8),
      playerEloDelta: eloDelta,
      rewardsEarned: gold,
      shardsEarned: shards,
      durationSeconds: Math.round(30 + Math.random() * 120),
      battleLog: {
        type: 'PvE',
        playerStats: heroStats,
        opponentStats,
        winner: won ? 'player' : 'opponent',
        timestamp: new Date().toISOString(),
      },
    });

    if (won) {
      await userService.updateUserStats(playerId, {
        totalBattles: 1,
        totalWins: 1,
        eloRating: eloDelta,
        totalEarnings: gold,
      });

      await heroService.updateHeroStats(playerHeroId, {
        experience: Math.round(gold / 2),
      });

      const existing = await InventoryItem.findOne({
        where: {
          userId: playerId,
          itemType: 'TIDE_SHARD',
        },
      });

      if (existing) {
        await existing.update({
          quantity: existing.quantity + shards,
        });
      } else {
        await InventoryItem.create({
          userId: playerId,
          itemType: 'TIDE_SHARD',
          quantity: shards,
        });
      }
    } else {
      await userService.updateUserStats(playerId, {
        totalBattles: 1,
        totalDefeats: 1,
        eloRating: eloDelta,
      });
    }

    logger.info(
      `PvE Battle completed: ${battle.id} - ${won ? 'Won' : 'Lost'}`,
    );
    return battle;
  }

  async getBattleHistory(userId, limit = 50) {
    return Battle.findAll({
      where: { playerId: userId },
      order: [['createdAt', 'DESC']],
      limit,
    });
  }

  async getBattleById(battleId) {
    return Battle.findOne({
      where: { id: battleId },
    });
  }

  async getRecentBattles(limit = 100) {
    return Battle.findAll({
      order: [['createdAt', 'DESC']],
      limit,
    });
  }

  async getBattleStats(userId) {
    const battles = await this.getBattleHistory(userId, 1000);
    
    const stats = {
      totalBattles: battles.length,
      wins: battles.filter(b => b.winner === userId).length,
      losses: battles.filter(b => b.winner !== userId).length,
      averageDuration: battles.length > 0 
        ? Math.round(
            battles.reduce((sum, b) => sum + (b.durationSeconds || 0), 0) /
            battles.length
          )
        : 0,
      totalRewardsEarned: battles.reduce((sum, b) => sum + (b.rewardsEarned || 0), 0),
      totalShardsEarned: battles.reduce((sum, b) => sum + (b.shardsEarned || 0), 0),
    };

    return {
      ...stats,
      winRate: stats.totalBattles > 0 
        ? Math.round((stats.wins / stats.totalBattles) * 100)
        : 0,
    };
  }
}

const battleService = new BattleService();

module.exports = {
  BattleService,
  battleService
};
