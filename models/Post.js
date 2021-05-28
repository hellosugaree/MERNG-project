const mongoose = require('mongoose');

// required fields handled at graphql layer
const postSchema = new mongoose.Schema({
  username: String,
  title: String,
  body: String,
  createdAt: String,
  numLikes: Number,
  comments: [
    {
      username: String,
      body: String,
      createdAt: String
    }
  ],

  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  
  // store the userId so we can query posts by userId
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

});

module.exports = mongoose.model('Post', postSchema);