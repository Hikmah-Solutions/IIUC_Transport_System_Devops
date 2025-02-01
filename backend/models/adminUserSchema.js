const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    role: { type: DataTypes.ENUM('Super User','Admin', 'Manager', 'User'), allowNull: false }, // Different roles
    password: { type: DataTypes.STRING, allowNull: false }, // Hashed password
  }, { timestamps: true });

  return User;
};
