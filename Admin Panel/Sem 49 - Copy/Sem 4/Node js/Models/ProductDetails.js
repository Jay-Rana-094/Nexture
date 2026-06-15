const mongoose = require('mongoose');

const productDetailsSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  price: Number,
  category: String,
  brand: String,
  specifications: String,
  detailedDescription: String,
  features: String,
  warranty: String,
  stock: Number,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: String
});

module.exports = mongoose.model('ProductDetails', productDetailsSchema);