const { Router } = require('express');
const { signin, verify } = require('../controllers/AuthController');
const { authMiddleware } = require('../middleware/auth');

const router = Router();

router.post('/signin', signin);
router.post('/verify', authMiddleware, verify);

module.exports = router;
