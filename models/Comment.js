const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: String,
  body: String,
  createdAt: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model('Comment', commentSchema);