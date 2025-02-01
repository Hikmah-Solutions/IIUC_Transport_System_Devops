const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TripTable = sequelize.define('TripTable', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    busNo: { type: DataTypes.INTEGER, allowNull: false },
    startPoint: { type: DataTypes.STRING, allowNull: false },
    driverName: { type: DataTypes.STRING, allowNull: false },
    subDriverName: { type: DataTypes.STRING, allowNull: true},
    driverPhone: { type: DataTypes.STRING },
    helperName: { type: DataTypes.STRING, allowNull: false },
    subHelperName: { type: DataTypes.STRING ,allowNull: true},
    helperPhone: { type: DataTypes.STRING },
    noOfStudents: { type: DataTypes.INTEGER, allowNull: false },
    noOfTrips: { type: DataTypes.INTEGER, allowNull: false },
    tripDate: { type: DataTypes.DATEONLY, allowNull: false }
  }, { timestamps: true });

  // Associations
  TripTable.associate = (models) => {
    TripTable.belongsTo(models.BusInfo, { foreignKey: 'busNo', onDelete: 'CASCADE' });
  };

  return TripTable;
};
