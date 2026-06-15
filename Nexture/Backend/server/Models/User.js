const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // ✅ ensure uniqueness
  },
  email: {
    type: String,
    required: true,
    unique: true, // ✅ ensure uniqueness
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
