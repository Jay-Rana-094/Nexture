const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userEmail: {
    type: String,
    required: true, // ✅ make sure it’s required
  },
  items: [
    {
      productId: String,
      quantity: Number,
    },
  ],
  totalPrice: Number,
  shippingAddress: String,
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
