const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BusInfo = sequelize.define('BusInfo', {
    id:{ type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    busNo: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    vehicleId: { type: DataTypes.STRING, allowNull: false, unique: true },
    driverName: { type: DataTypes.STRING, allowNull: false },
    driverPhone: { type: DataTypes.STRING, allowNull: false, unique: true },
    helperName: { type: DataTypes.STRING, allowNull: false },
    helperPhone: { type: DataTypes.STRING, allowNull: false, unique: true },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { timestamps: true });

  // Associations
  BusInfo.associate = (models) => {
    BusInfo.hasMany(models.AssignBus, { foreignKey: 'busNo', onDelete: 'CASCADE' });
    BusInfo.hasMany(models.TripTable, { foreignKey: 'busNo', onDelete: 'CASCADE' });
  };

  //  // Logging Hooks
  //  BusInfo.addHook('afterCreate', async (bus, options) => {
  //   await sequelize.models.LogTable.create({
  //     tableName: 'BusInfo',
  //     recordId: bus.id,
  //     action: 'INSERT',
  //     changedData: bus.toJSON()
  //   });
  // });

  // BusInfo.addHook('beforeUpdate', async (bus, options) => {
  //   await sequelize.models.LogTable.create({
  //     tableName: 'BusInfo',
  //     recordId: bus.id,
  //     action: 'UPDATE',
  //     changedData: bus.toJSON()
  //   });
  // });

  //  // Hook function to log changes
  //  const logChange = async (bus, action, options) => {
  //   const userId = options.userId || null; // Capture userId from options (passed from API)
  //   await sequelize.models.LogTable.create({
  //     tableName: 'BusInfo',
  //     recordId: bus.id,
  //     action,
  //     changedData: bus.toJSON(),
  //     userId
  //   });
  // };

  // // Logging Hooks
  // BusInfo.addHook('afterCreate', (bus, options) => logChange(bus, 'INSERT', options));
  // BusInfo.addHook('beforeUpdate', (bus, options) => logChange(bus, 'UPDATE', options));
  // BusInfo.addHook('beforeDestroy', (bus, options) => logChange(bus, 'DELETE', options));

  return BusInfo;
};
