const mongoose = require('mongoose');

// note: required fields handled by graphQL layer rather than mongoose layer
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String
});

module.exports = mongoose.model('User', userSchema);

