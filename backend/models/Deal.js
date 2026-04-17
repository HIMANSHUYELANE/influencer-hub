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
    enum: ['pending_payment', 'in_progress', 'in_review', 'revision_requested', 'completed', 'disputed'],
    default: 'pending_payment'
  },
  budget: {
    type: Number,
    required: true
  },
  contentUrl: {
    type: String, // Google Drive link or similar
    default: ''
  },
  paymentDetails: {
    status: {
      type: String,
      enum: ['pending', 'escrow_held', 'released', 'refunded'],
      default: 'pending'
    },
    razorpayOrderId: {
      type: String
    },
    razorpayPaymentId: {
      type: String
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);
