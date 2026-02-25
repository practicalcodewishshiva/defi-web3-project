const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection');

class Guild extends Model {}

Guild.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    leaderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    treasury: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    memberCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'guilds',
    timestamps: true,
    indexes: [
      { fields: ['level'] },
    ],
  }
);

module.exports = Guild;
