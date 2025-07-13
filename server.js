// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const schoolRoutes = require('./src/routes/schoolRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const usersRoutes = require('./src/routes/usersRoutes');
const config = require('./src/config/config');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware 
app.use(cors());
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// Serve static files (e.g., index.html, CSS, JS) from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School RFID API',
      version: '1.0.0',
      description: 'API for managing users, schools, students, and analytics in the School RFID system.',
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api`,
        description: 'Local development server',
      },
      {
        url: `https://skupulse-8k3l.onrender.com/api/`, 
        description: 'Production server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Paths to files with JSDoc
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);         // e.g., /api/auth/login
app.use('/api/schools', schoolRoutes);    // e.g., /api/schools, /api/schools/:schoolId
app.use('/api/students', studentRoutes);  // e.g., /api/students, /api/students/:schoolId/:rfid
app.use('/api/analytics', analyticsRoutes); // e.g., /api/analytics/:schoolId
app.use('/api/users', usersRoutes);       // e.g., /api/users, /api/users/:schoolId, /api/users/:id

// Serve index.html for any other GET route (excluding OPTIONS method)
app.get('*', (req, res) => {
  if (req.method !== 'OPTIONS') {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));