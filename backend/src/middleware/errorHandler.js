const { AppError } = require('../utils/errors');
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../constants');

const errorHandler = (error, req, res, next) => {
  logger.error('Error:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  if (error instanceof SyntaxError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Invalid request body',
    });
  }

  res.status(HTTP_STATUS.INTERNAL_ERROR).json({
    success: false,
    error: 'Internal server error',
  });
};

const notFoundHandler = (req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: 'Route not found',
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
