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
  }
}, { timestamps: true });

module.exports = mongoose.model('CreatorProfile', creatorProfileSchema);
