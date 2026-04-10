const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BrandProfile',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  niche: {
    type: String,
    enum: ['Tech', 'Lifestyle', 'Fashion', 'Food', 'Travel', 'Gaming', 'Beauty', 'Finance', 'Health', 'Other'],
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active'
  },
  requirements: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
