const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection');
const User = require('./User');
const Hero = require('./Hero');
const Artifact = require('./Artifact');

class InventoryItem extends Model {}

InventoryItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    heroId: {
      type: DataTypes.UUID,
      references: {
        model: Hero,
        key: 'id',
      },
    },
    artifactId: {
      type: DataTypes.UUID,
      references: {
        model: Artifact,
        key: 'id',
      },
    },
    itemType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'inventory_items',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['itemType'] },
    ],
  }
);

module.exports = InventoryItem;
