const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LogTable = sequelize.define('LogTable', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tableName: { type: DataTypes.STRING, allowNull: false }, // Table where change occurred
    recordId: { type: DataTypes.INTEGER, allowNull: false }, // Affected record ID
    action: { type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE'), allowNull: false }, // Type of change
    changedData: { type: DataTypes.JSON, allowNull: true }, // Stores updated or deleted record details
    userId: { 
      type: DataTypes.INTEGER, 
      allowNull: true, 
      references: { model: 'AdminUsers', key: 'id' }, // Tracks which user performed the action
      onDelete: 'SET NULL',
    },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { timestamps: false });

  return LogTable;
};
