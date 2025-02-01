const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const HelperInfo = sequelize.define('HelperInfo', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        helperID:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        helperNID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return HelperInfo;
}