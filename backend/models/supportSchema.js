const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Support', {
        descrition: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }
        , {
            timestamps: true,
            tableName: 'Support',
        },
    );
    return Support;
};