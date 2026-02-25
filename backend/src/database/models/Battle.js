const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection');
const User = require('./User');
const Hero = require('./Hero');

class Battle extends Model {}

Battle.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    playerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    opponentId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id',
      },
    },
    playerHeroId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Hero,
        key: 'id',
      },
    },
    winner: DataTypes.STRING,
    battleType: {
      type: DataTypes.STRING,
      defaultValue: 'PvE',
    },
    durationSeconds: DataTypes.INTEGER,
    playerStartHp: DataTypes.INTEGER,
    playerEndHp: DataTypes.INTEGER,
    opponentStartHp: DataTypes.INTEGER,
    opponentEndHp: DataTypes.INTEGER,
    playerEloDelta: DataTypes.INTEGER,
    opponentEloDelta: DataTypes.INTEGER,
    rewardsEarned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    shardsEarned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    battleLog: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    tableName: 'battles',
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ['playerId'] },
      { fields: ['opponentId'] },
      { fields: ['battleType'] },
    ],
  }
);

module.exports = Battle;
