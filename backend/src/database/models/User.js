const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    walletAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEthereumAddress(value) {
          if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
            throw new Error('Invalid Ethereum address');
          }
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    profileImage: DataTypes.STRING,
    bio: DataTypes.TEXT,
    totalBattles: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalWins: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalDefeats: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    eloRating: {
      type: DataTypes.INTEGER,
      defaultValue: 1000,
    },
    totalEarnings: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    indexes: [
      { fields: ['walletAddress'] },
      { fields: ['eloRating'] },
    ],
  }
);

module.exports = User;
