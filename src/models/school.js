// models/school.js
const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  schoolId: {
    type: String,
  },
  name: {
    type: String,
    required: true,
    // unique: true, // Ensures uniqueness, implying an index
  },
  logoUrl: { type: String }, // Optional
  address: { type: String }, // Optional
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  disabled: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Define a unique index with case-insensitive collation
schoolSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

module.exports = mongoose.model('School', schoolSchema);