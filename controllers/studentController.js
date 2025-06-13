// controllers/studentController.js
const Student = require('../models/student');
const multer = require('multer');
const Papa = require('papaparse');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

exports.createStudent = async (req, res) => {
  const { schoolId, rfid, name, admissionNumber, parentPhone, parentPhone2 } = req.body;
  try {
    const student = new Student({ schoolId, rfid, name, admissionNumber, parentPhone, parentPhone2 });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getStudents = async (req, res) => {
  const { schoolId } = req.params;
  try {
    const students = await Student.find({ schoolId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  const { schoolId, rfid } = req.params;
  
  try {
    const student = await Student.findOneAndUpdate(
      { schoolId, rfid },
      { $set: req.body }, // Use $set to explicitly update fields
      { new: true, runValidators: true } // Ensure validation is applied
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  const { schoolId, rfid } = req.params;
  try {
    const student = await Student.findOneAndDelete({ schoolId, rfid });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteAllStudents = async (req, res) => {
  const { schoolId } = req.params;
  try {
    const result = await Student.deleteMany({ schoolId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No students found for this school' });
    }
    res.json({ message: `${result.deletedCount} students deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.importStudents = [
  upload.single('file'),
  async (req, res) => {
    const { schoolId } = req.body;
    console.log('Received schoolId:', schoolId); // Debug log
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ message: 'No file uploaded' });

      if (!schoolId) {
        fs.unlinkSync(file.path); // Clean up file
        return res.status(400).json({ message: 'schoolId is required for importing students' });
      }

      const csvData = fs.readFileSync(file.path, 'utf8');
      Papa.parse(csvData, {
        header: true,
        complete: async (result) => {
          const students = result.data.map((row) => ({
            schoolId, // Use the provided schoolId
            rfid: row.rfid,
            name: row.name,
            admissionNumber: row.admissionNumber,
            parentPhone: row.parentPhone,
            parentPhone2: row.parentPhone2 || undefined,
          })).filter(student => 
            student.rfid && student.name && student.admissionNumber && student.parentPhone // Ensure required fields
          );
          if (students.length === 0) {
            fs.unlinkSync(file.path);
            return res.status(400).json({ message: 'No valid student data found in CSV' });
          }
          await Student.insertMany(students);
          fs.unlinkSync(file.path); // Clean up file
          res.status(201).json({ message: 'Students imported successfully' });
        },
        error: (error) => {
          fs.unlinkSync(file.path);
          res.status(500).json({ message: 'Error parsing CSV: ' + error.message });
        },
      });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path); // Clean up file on error
      res.status(500).json({ message: error.message });
    }
  },
];