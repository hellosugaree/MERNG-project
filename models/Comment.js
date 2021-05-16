const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: String,
  body: String,
  createdAt: String
});

module.exports = mongoose.model('Comment', commentSchema);