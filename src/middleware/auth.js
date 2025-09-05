// middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const School = require('../models/school');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    const school = await School.findById(req.user.schoolId);
    if (school?.disabled) {
      return res.status(403).json({ message: 'Account deactivated' });
    }
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Token is invalid' });
  }
};

module.exports = auth;