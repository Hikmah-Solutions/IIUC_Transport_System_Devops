const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const DriverInfo = sequelize.define('DriverInfo', {
        driverName: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        driverID:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        address:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        driverNID:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        driverLicense:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    
    return DriverInfo;
}