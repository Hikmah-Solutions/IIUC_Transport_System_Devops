const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BusSchedule = sequelize.define('BusSchedule', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    scheduleName: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    route: { type: DataTypes.STRING, allowNull: false },
    startPoint: { type: DataTypes.STRING, allowNull: false },
    endPoint: { type: DataTypes.STRING, allowNull: false },
    time: { 
      type: DataTypes.TIME, // Use TIME instead of STRING for proper time formatting
      allowNull: false 
    },
    scheduleType: { 
      type: DataTypes.ENUM('Regular Schedule', 'Friday Schedule', 'Residential Schedule', 
        'Library Schedule', 'Exam Schedule', 'Admission Schedule', 'Special Schedule'), 
      allowNull: false 
    },
    isActive: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    }
  }, { 
    timestamps: true 
  });

  // Corrected Association
  BusSchedule.associate = (models) => {
    BusSchedule.hasMany(models.AssignBus, { 
      foreignKey: 'scheduleId',  // Foreign key should reference 'id', not 'scheduleName'
      onDelete: 'CASCADE'
    });
  };

  return BusSchedule;
};
