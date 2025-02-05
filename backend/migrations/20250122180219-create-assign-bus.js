'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssignBuses', {
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
      scheduleName: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'BusSchedules', // Ensure this matches the table name for BusSchedule model
          key: 'scheduleName', // Ensure this matches the unique field in BusSchedule table
        },
        onDelete: 'CASCADE',
      },
      busType: {
        type: Sequelize.ENUM('Students', 'Teachers', 'Staff'),
        allowNull: false,
      },
      Gender: {
        type: Sequelize.ENUM('Both', 'Male', 'Female'),
        allowNull: true,
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
    await queryInterface.dropTable('AssignBuses');
  },
};