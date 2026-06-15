const mongoose = require('mongoose');

const failedEmailSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  payload: { type: Object },
  attempts: { type: Number, default: 0 },
  lastError: { type: String },
  status: { type: String, enum: ['failed', 'pending', 'resolved'], default: 'failed' }
}, { timestamps: true });

module.exports = mongoose.model('FailedEmail', failedEmailSchema);
