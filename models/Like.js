const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  username: String,
  createdAt: String
});

module.exports = mongoose.model('Like', likeSchema);