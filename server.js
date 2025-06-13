// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const studentRoutes = require('./routes/studentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const config = require('./config/config');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// Routes
app.use('/api/auth', authRoutes);       // e.g., /api/auth/login
app.use('/api/schools', schoolRoutes);  // e.g., /api/schools, /api/schools/:schoolId
app.use('/api/students', studentRoutes); // e.g., /api/students, /api/students/:schoolId/:rfid
app.use('/api/analytics', analyticsRoutes); // e.g., /api/analytics/:schoolId
app.use('/api/users', usersRoutes);     // e.g., /api/users, /api/users/:schoolId, /api/users/:id

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = config.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));