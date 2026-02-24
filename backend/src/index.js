const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('express-async-errors');

const config = require('./config');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { initializeBlockchain } = require('./lib/blockchain');
const sequelize = require('./database/connection');
const { initializeAssociations } = require('./database/models');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const heroRoutes = require('./routes/hero.routes');
const battleRoutes = require('./routes/battle.routes');

const app = express();

app.use(cors({
  origin: config.frontend.url,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const morganFormat = config.isDevelopment ? 'dev' : 'tiny';
app.use(morgan(morganFormat, { 
  stream: { 
    write: (msg) => {
      if (config.isDevelopment) {
        logger.http(msg.trim());
      }
    }
  },
  skip: (req, res) => !config.isDevelopment
}));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/heroes', heroRoutes);
app.use('/api/battles', battleRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    initializeAssociations();

    await sequelize.authenticate();
    if (config.isDevelopment) {
      logger.info('Database connected successfully');
    }

    await sequelize.sync({ alter: true });
    if (config.isDevelopment) {
      logger.info('Database models synced');
    }

    if (!config.isDevelopment) {
      await initializeBlockchain();
    } else if (config.isDevelopment) {
      logger.warn('Blockchain not initialized (development mode)');
    }

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      if (config.isDevelopment) {
        logger.info(`Environment: ${config.env}`);
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
