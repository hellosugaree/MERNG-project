const mongoose = require('mongoose');

// note: required fields handled by graphQL layer rather than mongoose layer
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  catches: Array,
  createdAt: String
});

module.exports = mongoose.model('User', userSchema);

