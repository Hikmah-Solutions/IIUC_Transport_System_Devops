module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BusInfos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      busNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      vehicleId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      driverName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      driverPhone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      helperName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      helperPhone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BusInfos');
  }
};
