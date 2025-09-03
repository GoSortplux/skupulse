// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  schoolId: { type: String, required: true, ref: 'School' },
  rfid: { type: String, required: true },
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

// Create a compound unique index on rfid and schoolId
studentSchema.index({ rfid: 1, schoolId: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);