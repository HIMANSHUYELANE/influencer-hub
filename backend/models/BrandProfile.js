const mongoose = require('mongoose');

const brandProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String // URL or path
  }
}, { timestamps: true });

module.exports = mongoose.model('BrandProfile', brandProfileSchema);
