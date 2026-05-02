const mongoose = require('mongoose');

const creatorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    required: true
  },
  niche: {
    type: String, // e.g., 'Tech', 'Lifestyle', 'Fashion'
    required: true
  },
  socialLinks: [{
    platform: String,
    url: String,
    handle: String
  }],
  followerCount: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: String,
    default: '< 24h'
  },
  expertise: {
    type: [String],
    default: []
  },
  portfolioLink: {
    type: String,
    default: ''
  },
  pricing: {
    basic: {
      price: { type: Number, default: 0 },
      description: { type: String, default: '' },
      deliveryDays: { type: Number, default: 3 },
      revisions: { type: Number, default: 1 }
    },
    standard: {
      price: { type: Number, default: 0 },
      description: { type: String, default: '' },
      deliveryDays: { type: Number, default: 5 },
      revisions: { type: Number, default: 2 }
    },
    premium: {
      price: { type: Number, default: 0 },
      description: { type: String, default: '' },
      deliveryDays: { type: Number, default: 7 },
      revisions: { type: Number, default: 3 }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('CreatorProfile', creatorProfileSchema);
