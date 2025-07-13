// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  schoolId: { type: String, required: true, ref: 'School' },
  rfid: { type: String, required: true },
  studentName: { type: String },
  phoneNumber: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['sent', 'failed'], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);