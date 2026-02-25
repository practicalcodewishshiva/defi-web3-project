const { Router } = require('express');
const { createHero, getHeroes, getHero, equipArtifact, unequipArtifact } = require('../controllers/HeroController');
const { authMiddleware } = require('../middleware/auth');

const router = Router();

router.post('/', authMiddleware, createHero);
router.get('/', authMiddleware, getHeroes);
router.get('/:heroId', getHero);
router.post('/equip', authMiddleware, equipArtifact);
router.post('/unequip', authMiddleware, unequipArtifact);

module.exports = router;
