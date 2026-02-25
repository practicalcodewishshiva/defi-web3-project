const { Hero, Artifact } = require('../database/models');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { HERO_STATS, HERO_TYPES } = require('../constants');
const { mintHero } = require('../lib/blockchain');
const logger = require('../utils/logger');

class HeroService {
  async createHero(userId, heroType, name) {
    if (!Object.values(HERO_TYPES).includes(heroType)) {
      throw new ValidationError('Invalid hero type');
    }

    const stats = HERO_STATS[heroType];
    
    const hero = await Hero.create({
      ownerId: userId,
      heroType,
      name: name || heroType,
      level: 1,
      experience: 0,
      requiredExpForNextLevel: 100,
      baseAttack: stats.attack,
      baseDefense: stats.defense,
      baseSpeed: stats.speed,
      currentAttack: stats.attack,
      currentDefense: stats.defense,
      currentSpeed: stats.speed,
    });

    logger.info(`Hero created: ${hero.id} for user ${userId}`);
    return hero;
  }

  async getHeroById(heroId) {
    return Hero.findOne({
      where: { id: heroId },
      include: [{
        model: Artifact,
        as: 'equippedArtifacts',
      }],
    });
  }

  async getHeroesByUser(userId) {
    return Hero.findAll({
      where: { ownerId: userId },
      include: [{
        model: Artifact,
        as: 'equippedArtifacts',
      }],
    });
  }

  async updateHeroStats(heroId, updates) {
    const hero = await this.getHeroById(heroId);
    if (!hero) {
      throw new NotFoundError('Hero');
    }

    const data = {};
    
    if (updates.experience !== undefined) {
      data.experience = hero.experience + updates.experience;
      
      if (data.experience >= hero.requiredExpForNextLevel) {
        data.level = hero.level + 1;
        data.experience = data.experience - hero.requiredExpForNextLevel;
        data.requiredExpForNextLevel = this.calculateNextLevelExp(data.level);
        data.currentAttack = Math.round(hero.baseAttack * (1 + data.level * 0.05));
        data.currentDefense = Math.round(hero.baseDefense * (1 + data.level * 0.05));
        data.currentSpeed = Math.round(hero.baseSpeed * (1 + data.level * 0.05));
      }
    }

    if (updates.attack !== undefined) {
      data.currentAttack = hero.currentAttack + updates.attack;
    }
    if (updates.defense !== undefined) {
      data.currentDefense = hero.currentDefense + updates.defense;
    }
    if (updates.speed !== undefined) {
      data.currentSpeed = hero.currentSpeed + updates.speed;
    }

    await hero.update(data);
    
    return Hero.findOne({
      where: { id: heroId },
      include: [{
        model: Artifact,
        as: 'equippedArtifacts',
      }],
    });
  }

  async getHeroTotalStats(heroId) {
    const hero = await this.getHeroById(heroId);
    if (!hero) {
      throw new NotFoundError('Hero');
    }

    let totalAttack = hero.currentAttack;
    let totalDefense = hero.currentDefense;
    let totalSpeed = hero.currentSpeed;

    const artifacts = await Artifact.findAll({
      where: { equippedToId: heroId },
    });

    if (artifacts && artifacts.length > 0) {
      artifacts.forEach((artifact) => {
        totalAttack += artifact.bonusAttack || 0;
        totalDefense += artifact.bonusDefense || 0;
        totalSpeed += artifact.bonusSpeed || 0;
      });
    }

    return {
      attack: totalAttack,
      defense: totalDefense,
      speed: totalSpeed,
      totalStats: totalAttack + totalDefense + totalSpeed,
    };
  }

  async equipArtifact(heroId, artifactId) {
    const hero = await this.getHeroById(heroId);
    if (!hero) {
      throw new NotFoundError('Hero');
    }

    const artifact = await Artifact.findOne({
      where: { id: artifactId },
    });

    if (!artifact) {
      throw new NotFoundError('Artifact');
    }

    if (artifact.ownerId !== hero.ownerId) {
      throw new ValidationError('You do not own this artifact');
    }

    const equippedCount = await Artifact.count({
      where: { equippedToId: heroId },
    });
    
    if (equippedCount >= 3) {
      throw new ValidationError('Maximum 3 artifacts can be equipped');
    }

    await artifact.update({ equippedToId: heroId });
    
    return Hero.findOne({
      where: { id: heroId },
      include: [{
        model: Artifact,
        as: 'equippedArtifacts',
      }],
    });
  }

  async unequipArtifact(heroId, artifactId) {
    const hero = await this.getHeroById(heroId);
    if (!hero) {
      throw new NotFoundError('Hero');
    }

    await Artifact.update(
      { equippedToId: null },
      { where: { id: artifactId } }
    );
    
    return Hero.findOne({
      where: { id: heroId },
      include: [{
        model: Artifact,
        as: 'equippedArtifacts',
      }],
    });
  }

  calculateNextLevelExp(level) {
    return Math.round(100 * Math.pow(1.1, level));
  }
}

const heroService = new HeroService();

module.exports = {
  HeroService,
  heroService
};
