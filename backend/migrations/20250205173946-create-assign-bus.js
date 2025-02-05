'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AssignBuses', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      busNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      scheduleName: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'BusSchedules', // Name of the referenced table
          key: 'scheduleName',   // Name of the referenced column
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
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AssignBuses');
  },
};