// controllers/schoolController.js
const School = require('../models/school');

exports.createSchool = async (req, res) => {
  const { name, logoUrl, address, adminName } = req.body;
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
 
    const school = new School({ name, logoUrl, address, adminName });
    school.schoolId = school._id;
    await school.save();
    res.status(201).json({
      message: 'School created successfully',
      school: {
        id: school._id,
        schoolId: school.schoolId,
        name: school.name,
        logoUrl: school.logoUrl,
        address: school.address,
        adminName: school.adminName,
        createdAt: school.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSchool = async (req, res) => {
  const { id } = req.params;
  const { name, logoUrl, address, adminName } = req.body;
  try {
    const school = await School.findByIdAndUpdate(
      id,
      { name, logoUrl, address, adminName },
      { new: true, runValidators: true }
    );
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.json({
      message: 'School updated successfully',
      school: {
        id: school._id,
        name: school.name,
        logoUrl: school.logoUrl,
        address: school.address,
        adminName: school.adminName,
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
    const schools = await School.find();
    const total = await School.countDocuments();
    res.json({
      total,
      schools: schools.map(school => ({
        id: school._id,
        name: school.name,
        logoUrl: school.logoUrl,
        address: school.address,
        adminName: school.adminName,
        createdAt: school.createdAt,
        updatedAt: school.updatedAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};