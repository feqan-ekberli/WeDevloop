// models/Translation.js
const mongoose = require('mongoose');

const TranslationSchema = new mongoose.Schema({
  lang: { type: String, required: true },
  page: { type: String, required: true },
  content: { type: Object, required: true }
});

module.exports = mongoose.model('Translation', TranslationSchema);
