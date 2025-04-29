const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: String,
  logoUrl: String
});

module.exports = mongoose.model('Client', ClientSchema);
