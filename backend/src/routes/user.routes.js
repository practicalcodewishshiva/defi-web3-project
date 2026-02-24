const { Router } = require('express');
const { getProfile, updateProfile, getStats, getLeaderboard, getUserPublic } = require('../controllers/UserController');
const { authMiddleware } = require('../middleware/auth');

const router = Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/stats', authMiddleware, getStats);
router.get('/leaderboard', getLeaderboard);
router.get('/:userId', getUserPublic);

module.exports = router;
