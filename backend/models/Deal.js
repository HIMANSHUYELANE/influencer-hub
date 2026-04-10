const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'paid'],
    default: 'in-progress'
  }
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);
