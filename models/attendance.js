// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  schoolId: { type: String, required: true, ref: 'School' },
  rfid: { type: String, required: true },
  studentName: { type: String },
  event: { type: String, enum: ['in', 'out'], required: true },
  manual: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attendance', attendanceSchema);