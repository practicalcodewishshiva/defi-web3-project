const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection');

class Achievement extends Model {}

Achievement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    badge: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requirement: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'achievements',
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = Achievement;
