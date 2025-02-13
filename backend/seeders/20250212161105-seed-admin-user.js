'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('securepassword123', 10);

    return queryInterface.bulkInsert('AdminUsers', [
      {
        id: require('uuid').v4(), // Generate a UUID for the ID
        name: 'Saiful',
        email: 'saiful@gmail.com',
        password: hashedPassword,
        role: 'Super Admin',
        employee_position: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('AdminUsers', { email: 'saiful@gmail.com' });
  },
};