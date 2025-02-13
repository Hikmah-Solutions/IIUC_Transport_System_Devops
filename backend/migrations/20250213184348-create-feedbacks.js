'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Feedbacks', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      universityId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      department: {
        type: Sequelize.ENUM(
          'CSE',
          'EEE',
          'CE',
          'CCE',
          'ETE',
          'BBA',
          'QSIS',
          'DHIS',
          'DIS',
          'EB',
          'ALL',
          'LAW',
          'Other'
        ),
        allowNull: false,
      },
      userType: {
        type: Sequelize.ENUM('Student', 'Teacher', 'Staff', 'Other'),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Resolved'),
        defaultValue: 'Pending',
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Feedbacks');
  },
};