// models/school.js
const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true, // Ensures uniqueness, implying an index
  },
  logoUrl: { type: String }, // Optional
  address: { type: String }, // Optional
  adminName: { type: String }, // Optional
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Define a unique index with case-insensitive collation
schoolSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

module.exports = mongoose.model('School', schoolSchema);