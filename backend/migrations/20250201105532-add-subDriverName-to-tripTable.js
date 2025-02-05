module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding missing columns
    await queryInterface.addColumn('TripTables', 'subDriverName', {
      type: Sequelize.STRING,
      allowNull: true,  // Set to true if it can be null
    });

    // You can add more columns here as needed
    // For example, if you want to ensure 'subDriverPhone' exists:
    await queryInterface.addColumn('TripTables', 'subDriverPhone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverting the changes (removing columns)
    await queryInterface.removeColumn('TripTables', 'subDriverName');
    await queryInterface.removeColumn('TripTables', 'subDriverPhone');
  }
};
