const mongoose = require('mongoose');

const shitSchema = new mongoose.Schema({
  shit: {
    type: String
  },
  author: {
    type: Object
  },
  timestamp: {
    type: Date,
    default: new Date()
  }
});

module.exports = shit = mongoose.model('shit', shitSchema);
