const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

let sequelize;

// Initialize Sequelize based on environment variables
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Import all models in the models directory
const modelFiles = [
  'busScheduleSchema.js', // Add other model files here
  'AssignBusSchema.js', 
  'BusInfoSchema.js', 
  'TripInfoSchema.js', 
  'DriverInfoSchema.js', 
  'HelperInfoSchema.js', 
  'adminUserSchema.js',
  'notificationSchema.js',
  'FeedbackSchema.js',
  
];

modelFiles.forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

// Set up associations if any
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;