const { Artifact } = require('../database/models');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { ITEM_RARITY, RARITY_STAT_BONUS, MAX_ARTIFACTS_PER_HERO } = require('../constants');
const logger = require('../utils/logger');

class ArtifactService {
  async createArtifact(userId, artifactType, name, rarity, bonusAttack = 0, bonusDefense = 0, bonusSpeed = 0) {
    if (rarity < ITEM_RARITY.COMMON || rarity > ITEM_RARITY.LEGENDARY) {
      throw new ValidationError('Invalid rarity level');
    }

    return Artifact.create({
      ownerId: userId,
      artifactType,
      name,
      rarity,
      bonusAttack,
      bonusDefense,
      bonusSpeed,
    });
  }

  async getArtifactById(artifactId) {
    return Artifact.findOne({
      where: { id: artifactId },
    });
  }

  async getArtifactsByUser(userId) {
    return Artifact.findAll({
      where: { ownerId: userId },
    });
  }

  async getEquippedArtifacts(heroId) {
    return Artifact.findAll({
      where: { equippedToId: heroId },
    });
  }

  async equip(artifactId, heroId) {
    const artifact = await this.getArtifactById(artifactId);
    if (!artifact) {
      throw new NotFoundError('Artifact');
    }

    const equipped = await this.getEquippedArtifacts(heroId);
    if (equipped.length >= MAX_ARTIFACTS_PER_HERO) {
      throw new ValidationError(
        `Maximum ${MAX_ARTIFACTS_PER_HERO} artifacts can be equipped`,
      );
    }

    await artifact.update({ equippedToId: heroId });
    return artifact;
  }

  async unequip(artifactId) {
    const artifact = await this.getArtifactById(artifactId);
    if (!artifact) {
      throw new NotFoundError('Artifact');
    }

    await artifact.update({ equippedToId: null });
    return artifact;
  }

  async listForSale(artifactId, price, expirationHours = 30 * 24) {
    const artifact = await this.getArtifactById(artifactId);
    if (!artifact) {
      throw new NotFoundError('Artifact');
    }

    if (!artifact.tradeable) {
      throw new ValidationError('This artifact cannot be traded');
    }

    await artifact.update({ equippedToId: null });
    return artifact;
  }

  async delist(artifactId) {
    const artifact = await this.getArtifactById(artifactId);
    if (!artifact) {
      throw new NotFoundError('Artifact');
    }

    await artifact.update({ equippedToId: null });
    return artifact;
  }

  async generateRandomArtifact(userId, heroType) {
    const rarityRoll = Math.random();
    let rarity = ITEM_RARITY.COMMON;

    if (rarityRoll > 0.998) {
      rarity = ITEM_RARITY.LEGENDARY;
    } else if (rarityRoll > 0.99) {
      rarity = ITEM_RARITY.EPIC;
    } else if (rarityRoll > 0.92) {
      rarity = ITEM_RARITY.RARE;
    } else if (rarityRoll > 0.72) {
      rarity = ITEM_RARITY.UNCOMMON;
    }

    const artifactTypes = [
      'sword',
      'shield',
      'helmet',
      'boots',
      'amulet',
      'ring',
    ];
    const artifactType = artifactTypes[Math.floor(Math.random() * artifactTypes.length)];

    const multiplier = RARITY_STAT_BONUS[rarity];
    const baseBonus = Math.round(10 * (rarity - 1));

    return this.createArtifact(
      userId,
      artifactType,
      `${rarity}-Star ${artifactType}`,
      rarity,
      Math.round(baseBonus * multiplier),
      Math.round(baseBonus * multiplier),
      Math.round(baseBonus * multiplier * 0.8),
    );
  }

  async transferArtifact(artifactId, fromUserId, toUserId) {
    const artifact = await this.getArtifactById(artifactId);
    if (!artifact) {
      throw new NotFoundError('Artifact');
    }

    if (artifact.ownerId !== fromUserId) {
      throw new ValidationError('You do not own this artifact');
    }

    if (!artifact.tradeable) {
      throw new ValidationError('This artifact cannot be traded');
    }

    await artifact.update({
      ownerId: toUserId,
      equippedToId: null,
    });

    return artifact;
  }
}

const artifactService = new ArtifactService();

module.exports = {
  ArtifactService,
  artifactService
};
