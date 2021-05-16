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
  
  // explanation not super clear but something to do with linking something later in mongoose
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }

});

module.exports = mongoose.model('Post', postSchema);