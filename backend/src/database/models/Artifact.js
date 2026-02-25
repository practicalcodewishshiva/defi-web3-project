const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection');
const User = require('./User');
const Hero = require('./Hero');

class Artifact extends Model {}

Artifact.init(
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
    artifactType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rarity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    description: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    bonusAttack: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bonusDefense: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bonusSpeed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    equippedToId: {
      type: DataTypes.UUID,
      references: {
        model: Hero,
        key: 'id',
      },
    },
    tokenId: {
      type: DataTypes.STRING,
      unique: true,
    },
    contractAddress: DataTypes.STRING,
    cooldownUntil: DataTypes.DATE,
    tradeable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'artifacts',
    timestamps: true,
    indexes: [
      { fields: ['ownerId'] },
      { fields: ['rarity'] },
      { fields: ['artifactType'] },
    ],
  }
);

module.exports = Artifact;
