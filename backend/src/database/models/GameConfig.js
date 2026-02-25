const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection');

class GameConfig extends Model {}

GameConfig.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    description: DataTypes.TEXT,
  },
  {
    sequelize,
    tableName: 'game_configs',
    timestamps: true,
    createdAt: false,
  }
);

module.exports = GameConfig;
