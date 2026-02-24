const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection');

class AuditLog extends Model {}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: DataTypes.UUID,
    details: DataTypes.JSON,
    ipAddress: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ['action'] },
      { fields: ['userId'] },
    ],
  }
);

module.exports = AuditLog;
