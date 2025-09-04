// controllers/schoolController.js
const School = require('../models/school');
const User = require('../models/user');

exports.createSchool = async (req, res) => {
  const { name, logoUrl, address, admin } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: 'School name is required' });
    }

    const existingSchool = await School.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingSchool) {
      return res.status(400).json({
        message: 'A school with this name already exists. Please use a different name.',
      });
    }

    if (admin) {
      const existingUser = await User.findById(admin);
      if (!existingUser) {
        return res.status(400).json({ message: 'Admin user not found' });
      }
    }
 
    const school = new School({ name, logoUrl, address, admin });
    school.schoolId = school._id;
    await school.save();

    const populatedSchool = await School.findById(school._id).populate('admin', 'username email');

    res.status(201).json({
      message: 'School created successfully',
      school: {
        id: populatedSchool._id,
        schoolId: populatedSchool.schoolId,
        name: populatedSchool.name,
        logoUrl: populatedSchool.logoUrl,
        address: populatedSchool.address,
        admin: populatedSchool.admin ? {
          id: populatedSchool.admin._id,
          username: populatedSchool.admin.username,
          email: populatedSchool.admin.email
        } : null,
        createdAt: populatedSchool.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSchool = async (req, res) => {
  const { id } = req.params;
  const { name, logoUrl, address, admin } = req.body;
  try {
    if (admin) {
      const existingUser = await User.findById(admin);
      if (!existingUser) {
        return res.status(400).json({ message: 'Admin user not found' });
      }
    }

    const school = await School.findByIdAndUpdate(
      id,
      { name, logoUrl, address, admin },
      { new: true, runValidators: true }
    ).populate('admin', 'username email');
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.json({
      message: 'School updated successfully',
      school: {
        id: school._id,
        name: school.name,
        logoUrl: school.logoUrl,
        address: school.address,
        admin: school.admin ? {
          id: school.admin._id,
          username: school.admin.username,
          email: school.admin.email
        } : null,
        updatedAt: school.updatedAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A school with this name already exists. Please use a different name.',
      });
    }
    res.status(400).json({ message: error.message });
  }
};

exports.getSchools = async (req, res) => {
  try {
    const { role, schoolId } = req.user;

    if (role === 'admin') {
      if (!schoolId) {
        return res.status(400).json({ message: 'Admin user does not have a school ID' });
      }
      const school = await School.findById(schoolId).populate('admin', 'username email');
      if (!school) {
        return res.status(404).json({ message: 'School not found' });
      }
      return res.json({
        total: 1,
        schools: [{
          id: school._id,
          name: school.name,
          logoUrl: school.logoUrl,
          address: school.address,
          admin: school.admin ? {
            id: school.admin._id,
            username: school.admin.username,
            email: school.admin.email
          } : null,
          createdAt: school.createdAt,
          updatedAt: school.updatedAt,
        }],
      });
    }

    // Superadmin gets all schools
    const schools = await School.find().populate('admin', 'username email');
    const total = await School.countDocuments();
    res.json({
      total,
      schools: schools.map(school => ({
        id: school._id,
        name: school.name,
        logoUrl: school.logoUrl,
        address: school.address,
        admin: school.admin ? {
          id: school.admin._id,
          username: school.admin.username,
          email: school.admin.email
        } : null,
        createdAt: school.createdAt,
        updatedAt: school.updatedAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};