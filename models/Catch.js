const mongoose = require('mongoose');

const catchSchema = new mongoose.Schema({
  username: String,
  species: String,
  catchLength: Number,
  fishingType: String,
  catchDate: String,
  catchLocation: String,
  createdAt: String,
  sessionId: String,
  notes: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Catch', catchSchema);