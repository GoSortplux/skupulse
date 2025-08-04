// controllers/usersController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  const { username, password, role, schoolId, email, phoneNumber } = req.body;
  try {
    if (role !== 'admin' && role !== 'superadmin') {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (role === 'admin' && !schoolId) {
      return res.status(400).json({ message: 'School ID is required for admin role' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      role,
      schoolId: role === 'admin' ? schoolId : undefined,
      email,
      phoneNumber,
    });
    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: { username, role, schoolId, email, phoneNumber },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUsersBySchool = async (req, res) => {
  const { schoolId } = req.params;
  try {
    const users = await User.find({ schoolId, role: 'admin' }); // Only return admins for the school
    const total = await User.countDocuments({ schoolId, role: 'admin' });
    res.json({
      total,
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        role: user.role,
        schoolId: user.schoolId,
        email: user.email,
        phoneNumber: user.phoneNumber,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role, schoolId, email, phoneNumber } = req.body;
  try {
    const updateData = { username, role, schoolId, email, phoneNumber };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10); // Hash new password if provided
    }
    const user = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        schoolId: user.schoolId,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  try {
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};