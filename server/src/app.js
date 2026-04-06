const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan'); // For development logging of requests

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const apiLogRoutes = require('./routes/apiLog.routes');
const errorLogRoutes = require('./routes/errorLog.routes');

const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

// Security Middlewares
app.use(helmet()); // Set security HTTP headers
app.use(cors());   // Enable CORS for all routes (adjust as needed for specific origins in production)

// Body parser for incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data Sanitization against NoSQL Query Injection
app.use(mongoSanitize());

// Request logging (dev mode)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic route for testing server
app.get('/', (req, res) => {
  res.send('DevTrace Backend API is running!');
});

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/logs', apiLogRoutes); // Logs from client services
app.use('/api/logs', errorLogRoutes); // Error logs from client services

// Global Error Handler (must be last middleware)
app.use(errorHandler);

module.exports = app;
