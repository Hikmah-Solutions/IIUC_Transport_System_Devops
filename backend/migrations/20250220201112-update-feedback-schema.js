'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Check if feedbackType column already exists
        const tableInfo = await queryInterface.describeTable('Feedbacks');
        if (!tableInfo.feedbackType) {
            // Add the feedbackType column only if it doesn't exist
            await queryInterface.addColumn('Feedbacks', 'feedbackType', {
                type: Sequelize.ENUM('Complaint', 'Suggestion', 'Feedback', 'Others'),
                allowNull: false,
                defaultValue: 'Feedback',
            });
        }

        // Update the department ENUM type using raw SQL
        await queryInterface.sequelize.query(
            'ALTER TYPE "enum_Feedbacks_department" ADD VALUE \'ELL\''
        );
        await queryInterface.sequelize.query(
            'ALTER TYPE "enum_Feedbacks_department" ADD VALUE \'PHARMACY\''
        );
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the feedbackType column if it exists
        const tableInfo = await queryInterface.describeTable('Feedbacks');
        if (tableInfo.feedbackType) {
            await queryInterface.removeColumn('Feedbacks', 'feedbackType');
        }

        // Revert the department ENUM type changes (not straightforward)
        // Note: Dropping ENUM values is not supported in PostgreSQL.
        // You may need to create a new ENUM type and migrate data manually.
    },
};