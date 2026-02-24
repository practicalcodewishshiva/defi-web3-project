const jwt = require('jsonwebtoken');
const config = require('../config');
const { AuthenticationError } = require('../utils/errors');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid authorization header');
    }

    const token = authHeader.slice(7);
    req.token = token;

    const decoded = jwt.verify(token, config.jwt.secret);
    req.userId = decoded.userId;
    req.walletAddress = decoded.walletAddress;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid token:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }

    if (error instanceof AuthenticationError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    }

    logger.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const decoded = jwt.verify(token, config.jwt.secret);
      req.userId = decoded.userId;
      req.walletAddress = decoded.walletAddress;
    }

    next();
  } catch (error) {
    logger.warn('Optional auth failed:', error);
    next();
  }
};

const generateToken = (userId, walletAddress) => {
  const payload = { userId, walletAddress };
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiry,
  });
};

module.exports = {
  authMiddleware,
  optionalAuth,
  generateToken
};
