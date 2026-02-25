const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection');
const User = require('./User');
const Artifact = require('./Artifact');

class Marketplace extends Model {}

Marketplace.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    artifactId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Artifact,
        key: 'id',
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    buyer: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'ACTIVE',
    },
    listedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    soldAt: DataTypes.DATE,
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'marketplace_listings',
    timestamps: false,
    indexes: [
      { fields: ['sellerId'] },
      { fields: ['status'] },
      { fields: ['price'] },
    ],
  }
);

module.exports = Marketplace;
