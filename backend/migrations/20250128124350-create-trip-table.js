'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TripTables', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      busNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'BusInfos', // Ensure this matches the table name for BusInfo model
          key: 'busNo', // Ensure this matches the primary key in BusInfo table
        },
        onDelete: 'CASCADE',
      },
      startPoint: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      driverName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subDriverName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      driverPhone: {
        type: Sequelize.STRING,
        allowNull: true, // Assuming phone number can be optional
      },
      helperName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subHelperName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      helperPhone: {
        type: Sequelize.STRING,
        allowNull: true, // Assuming phone number can be optional
      },
      noOfStudents: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      noOfTrips: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tripDate: {
        type: Sequelize.DATEONLY, // DATEONLY stores only the date (no time)
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TripTables');
  },
};