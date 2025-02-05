'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BusSchedules', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      scheduleName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      route: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startPoint: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      endPoint: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      scheduleType: {
        type: Sequelize.ENUM(
          'Regular Schedule',
          'Friday Schedule',
          'Residential Schedule',
          'Library Schedule',
          'Exam Schedule',
          'Admission Schedule',
          'Special Schedule'
        ),
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BusSchedules');
  },
};
