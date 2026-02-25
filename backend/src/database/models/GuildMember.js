const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection');
const Guild = require('./Guild');
const User = require('./User');

class GuildMember extends Model {}

GuildMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    guildId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Guild,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'MEMBER',
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'guild_members',
    timestamps: false,
    indexes: [
      { fields: ['guildId'] },
    ],
  }
);

module.exports = GuildMember;
