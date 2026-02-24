const { Sequelize } = require('sequelize');
const config = require('../config');
const logger = require('../utils/logger');
const path = require('path');

let sequelize;

if (config.isDevelopment) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(process.cwd(), 'tidefall.db'),
    logging: (sql) => {
      if (config.isDevelopment) {
        logger.debug(sql);
      }
    },
  });
} else {
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    logging: (sql) => {
      if (config.isDevelopment) {
        logger.debug(sql);
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

module.exports = sequelize;
