const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database'); // Adjust path as needed

module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define('Feedback', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        universityId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        department: {
            type: DataTypes.ENUM('CSE', 'EEE', 'CE', 'CCE', 'ETE', 'BBA', 'QSIS', 'DHIS', 'DIS', 'EB', 'ALL', 'LAW', 'Other'), // Add all relevant departments
            allowNull: false,
        },
        userType: {
            type: DataTypes.ENUM('Student', 'Teacher', 'Staff', 'Other'),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Resolved'),
            defaultValue: 'Pending',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });
    
 return Feedback;   
}
