module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TripTables', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      busNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'BusInfos',  // Make sure this matches your actual model name
          key: 'busNo'  // The foreign key field in BusInfos model
        },
        onDelete: 'CASCADE'
      },
      startPoint: {
        type: Sequelize.STRING,
        allowNull: false
      },
      driverName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subDriverName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      driverPhone: {
        type: Sequelize.STRING
      },
      helperName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subHelperName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      helperPhone: {
        type: Sequelize.STRING
      },
      noOfStudents: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      noOfTrips: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tripDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
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
    await queryInterface.dropTable('TripTables');
  }
};
