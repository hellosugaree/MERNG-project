const mongoose = require('mongoose');

// note: required fields handled by graphQL layer rather than mongoose layer


const cloudinaryImageSchema = new mongoose.Schema({
  asset_id: String,
  public_id: String, 
  width: Number, 
  height: Number, 
  format: String, 
  resource_type: String, 
  created_at: String, 
  bytes: Number, 
  url: String, 
  secure_url: String
});


const userPreferencesSchema = new mongoose.Schema({
  profilePicture: cloudinaryImageSchema
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  catches: Array,
  preferences: {
    type: userPreferencesSchema,
    required: true,
    default: { 
      profilePicture: { asset_id: null } 
    }
  },
  createdAt: String
});

module.exports = mongoose.model('User', userSchema);

