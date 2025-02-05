module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssignBuses', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      busNo: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      scheduleName: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'BusSchedules', // Foreign key referencing scheduleName in BusSchedules
          key: 'scheduleName'    // Ensure scheduleName is unique in BusSchedules
        },
        onDelete: 'CASCADE'
      },
      busType: {
        type: Sequelize.ENUM('Students', 'Teachers', 'Staff'),
        allowNull: false
      },
      Gender: {
        type: Sequelize.ENUM('Both', 'Male', 'Female'),
        allowNull: true
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AssignBuses');
  }
};
