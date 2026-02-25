const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection');
const User = require('./User');

class Hero extends Model {}

Hero.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    heroType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: DataTypes.STRING,
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    experience: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    requiredExpForNextLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    baseAttack: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    baseDefense: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    baseSpeed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentAttack: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentDefense: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentSpeed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tokenId: {
      type: DataTypes.STRING,
      unique: true,
    },
    tokenUri: DataTypes.STRING,
    contractAddress: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: 'heroes',
    timestamps: true,
    indexes: [
      { fields: ['ownerId'] },
      { fields: ['heroType'] },
    ],
  }
);

module.exports = Hero;
