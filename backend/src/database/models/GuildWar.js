const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection');
const Guild = require('./Guild');

class GuildWar extends Model {}

GuildWar.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    guild1Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Guild,
        key: 'id',
      },
    },
    guild2Id: {
      type: DataTypes.UUID,
      references: {
        model: Guild,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'PENDING',
    },
    guild1Score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    guild2Score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    winner: DataTypes.STRING,
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endDate: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'guild_wars',
    timestamps: false,
    indexes: [
      { fields: ['guild1Id'] },
      { fields: ['status'] },
    ],
  }
);

module.exports = GuildWar;
