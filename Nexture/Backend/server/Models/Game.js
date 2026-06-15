const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: String,
  genre: String,
  platform: String,
  rating: Number,
  description: String,
  releaseDate: Date
});

module.exports = mongoose.model('Game', gameSchema);
