const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AssignBus = sequelize.define('AssignBus', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    busNo: { type: DataTypes.INTEGER, allowNull: false },
    scheduleName: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      references: { 
        model: 'BusSchedules', 
        key: 'scheduleName'  // Ensure this matches the unique scheduleName field in BusSchedules table
      },
      onDelete: 'CASCADE'
    },
    busType: { type: DataTypes.ENUM('Students', 'Teachers', 'Staff'), allowNull: false },
    Gender: { type: DataTypes.ENUM('Both', 'Male', 'Female'), allowNull: true }
  }, { timestamps: true });

  // Associations
  AssignBus.associate = (models) => {
    AssignBus.belongsTo(models.BusInfo, { foreignKey: 'busNo', onDelete: 'CASCADE' });
    AssignBus.belongsTo(models.BusSchedule, { foreignKey: 'scheduleName', onDelete: 'CASCADE' });
  };

  return AssignBus;
};
