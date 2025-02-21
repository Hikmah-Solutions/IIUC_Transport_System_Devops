const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();



// Import the database connection and Sequelize instance
const { sequelize } = require('./config/database'); // Correctly import sequelize from models/index.js
const BusSchedule = require('./models/busScheduleSchema'); 
const BusInfo = require('./models/BusInfoSchema'); 
const AssignBus = require('./models/AssignBusSchema'); 

// Sync all models with the database
sequelize.sync({ force: true }) // Set force: true for resetting the database on every restart
  .then(() => {
    console.log('Database synced!');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Import your route files

const busScheduleRoutes = require('./src/routes/admin/busScheduleRoutes');
const busInfoRoutes = require('./src/routes/admin/busInfoRoutes');
const tripInfoRoutes = require('./src/routes/admin/tripInfoRoutes');
const assignBusRoutes = require('./src/routes/admin/assignBusRoutes');
const driverInfoRoutes = require('./src/routes/admin/driverInfoRoutes');
const helperInfoRoutes = require('./src/routes/admin/helperInfoRoutes');
const adminFeedbackRoutes = require('./src/routes/admin/adminFeedbackRoutes');
const notificationRoutes = require('./src/routes/admin/notificationRoutes');
const adminRoute = require('./src/routes/admin/adminAuthRoute');
const userRoutes = require('./src/routes/admin/userRoutes');
const adminDashboardRoutes = require('./src/routes/admin/adminDashboardRoutes');


// User routes Files Path
const findLiveSchedule = require('./src/routes/user/findLiveSchedule');
const liveTrackRoutes = require('./src/routes/user/liveTrackRoutes');
const scheduleRoutes = require('./src/routes/user/scheduleRoutes');
const showNearestBus = require('./src/routes/user/showNearestBus');
const userNotificationRoutes = require('./src/routes/user/userNotificationRoutes');
const userFeedback = require('./src/routes/user/userFeedback');
// const supportRoutes = require('./src/routes/user/supportRoutes');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;



// Middleware setup
app.use(cors({
  origin: '*', // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// const allowedOrigins = ['https://iiuc-transport-admin-panel.vercel.app', 'https://iiucbus.vercel.app']; // Add your frontend URL here
// app.use(cors({
//   origin: allowedOrigins,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));



// Logging middleware (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies


// app.use('/api/users', userRoutes);
app.use('/api/admin/bus-schedules', busScheduleRoutes);
app.use('/api/admin/bus-info', busInfoRoutes);
app.use('/api/admin/assign-bus', assignBusRoutes);
app.use('/api/admin/trip-info', tripInfoRoutes);
app.use('/api/admin/driver-info',driverInfoRoutes );
app.use('/api/admin/helper-info', helperInfoRoutes);
app.use('/api/admin/notification', notificationRoutes);
app.use('/api/admin/feedback', adminFeedbackRoutes);
app.use('/api/admin/auth', adminRoute);
app.use('/api/admin/users', userRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);




// User routes

app.use('/api/user/find-LiveSchedule', findLiveSchedule);
app.use('/api/user/schedule',scheduleRoutes );
app.use('/api/user/notification',userNotificationRoutes );
app.use('/api/user/feedback',userFeedback );
app.use('/api/user/live-track',liveTrackRoutes );
app.use('/api/user/nearest-bus',showNearestBus );
// app.use('/api/user/support',supportRoutes );


// Start the server after ensuring the database is connected
const startServer = async () => {
  try {
    // Ensure the database is connected and the sync is successful
    await sequelize.authenticate(); // Ensure DB connection is established
    console.log('Database connected successfully!');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Graceful shutdown handling
    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing server...');
      await sequelize.close(); // Close the Sequelize connection pool
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing server...');
      await sequelize.close(); // Close the Sequelize connection pool
      process.exit(0);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1); // Exit process if the server cannot start
  }
};

// Call the startServer function
startServer();
