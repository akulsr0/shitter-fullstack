const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  dob: {
    type: Date
  },
  bio: {
    type: String
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = user = mongoose.model('user', userSchema);
