module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column exists, then add it only if it's missing
    const columns = await queryInterface.describeTable('TripTables');

    if (!columns.subDriverName) {
      await queryInterface.addColumn('TripTables', 'subDriverName', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!columns.subHelperName) {
      await queryInterface.addColumn('TripTables', 'subHelperName', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns in case of rollback
    await queryInterface.removeColumn('TripTables', 'subDriverName');
    await queryInterface.removeColumn('TripTables', 'subHelperName');
  }
};
