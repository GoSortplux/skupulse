// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const User = require('../models/user');
const School = require('../models/school');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const school = await School.findById(user.schoolId);
    if (school?.disabled) {
      return res.status(403).json({ message: 'Account deactivated' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role, schoolId: user.schoolId },
      config.jwtSecret,
      { expiresIn: '365d' }
    );

    const userResponse = {
      userId: user._id,
      username: user.username,
      role: user.role,
      school: null, // Initialize school as null
    };

    if (user.role === 'admin' && user.schoolId) {
      const school = await School.findById(user.schoolId);
      if (school) {
        userResponse.school = {
          id: school._id,
          name: school.name,
          logoUrl: school.logoUrl,
          address: school.address,
        };
      } else {
        console.log(
          `Warning: Admin user ${user.username} has a schoolId ${user.schoolId} that was not found in the database.`
        );
      }
    }

    // Return token along with user details
    res.json({
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};