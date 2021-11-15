const mongoose = require('mongoose');
const Comment = require('./Comment');

const commentSchema = new mongoose.Schema({
  username: String,
  body: String,
  createdAt: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

const postSchema = new mongoose.Schema({
  username: String,
  title: String,
  body: String,
  createdAt: String,
  numLikes: Number,
  comments: [commentSchema],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

});

module.exports = mongoose.model('Post', postSchema);
