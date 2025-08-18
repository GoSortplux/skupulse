// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'School' },
  rfid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  admissionNumber: { type: String, required: true },
  parentPhone: { type: String, required: true },
  parentPhone2: { type: String },
  lastEvent: {
    event: { type: String, enum: ['in', 'out'] },
    timestamp: { type: Date },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', studentSchema);