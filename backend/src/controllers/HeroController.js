const { heroService } = require('../services/HeroService');
const { artifactService } = require('../services/ArtifactService');
const logger = require('../utils/logger');

const createHero = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { heroType, name } = req.body;

    if (!heroType) {
      return res.status(400).json({ message: 'Hero type is required' });
    }

    const hero = await heroService.createHero(userId, heroType, name);
    res.status(200).json(hero);
  } catch (error) {
    logger.error('Create hero error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getHeroes = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const heroes = await heroService.getHeroesByUser(userId);
    res.status(200).json(heroes);
  } catch (error) {
    logger.error('Get heroes error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getHero = async (req, res) => {
  try {
    const { heroId } = req.params;
    const hero = await heroService.getHeroById(heroId);

    if (!hero) {
      return res.status(404).json({ message: 'Hero not found' });
    }

    const stats = await heroService.getHeroTotalStats(heroId);

    res.status(200).json({
      ...hero,
      totalStats: stats,
    });
  } catch (error) {
    logger.error('Get hero error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const equipArtifact = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { heroId, artifactId } = req.body;

    if (!heroId || !artifactId) {
      return res.status(400).json({ message: 'Hero ID and Artifact ID are required' });
    }

    const hero = await heroService.getHeroById(heroId);
    if (!hero || hero.ownerId !== userId) {
      return res.status(403).json({ message: 'You do not own this hero' });
    }

    const artifact = await artifactService.getArtifactById(artifactId);
    if (!artifact || artifact.ownerId !== userId) {
      return res.status(403).json({ message: 'You do not own this artifact' });
    }

    await artifactService.equip(artifactId, heroId);

    const updated = await heroService.getHeroById(heroId);
    res.status(200).json(updated);
  } catch (error) {
    logger.error('Equip artifact error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const unequipArtifact = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { heroId, artifactId } = req.body;

    if (!heroId || !artifactId) {
      return res.status(400).json({ message: 'Hero ID and Artifact ID are required' });
    }

    const hero = await heroService.getHeroById(heroId);
    if (!hero || hero.ownerId !== userId) {
      return res.status(403).json({ message: 'You do not own this hero' });
    }

    await artifactService.unequip(artifactId);

    const updated = await heroService.getHeroById(heroId);
    res.status(200).json(updated);
  } catch (error) {
    logger.error('Unequip artifact error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createHero,
  getHeroes,
  getHero,
  equipArtifact,
  unequipArtifact
};
