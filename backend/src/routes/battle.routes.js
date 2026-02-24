const { Router } = require('express');
const { startBattle, getBattleHistory, getBattleStats, getRecentBattles, getBattle } = require('../controllers/BattleController');
const { authMiddleware } = require('../middleware/auth');

const router = Router();

router.post('/start', authMiddleware, startBattle);
router.get('/history', authMiddleware, getBattleHistory);
router.get('/stats', authMiddleware, getBattleStats);
router.get('/recent', getRecentBattles);
router.get('/:battleId', getBattle);

module.exports = router;
