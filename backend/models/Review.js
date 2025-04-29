const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  name: String,
  company: String,
  comment: String,
  photoUrl: String
});

module.exports = mongoose.model('Review', ReviewSchema);
