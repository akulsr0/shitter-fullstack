const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postText: {
    type: String
  },
  authorId: {
    type: String
  },
  authorName: {
    type: String
  },
  authorEmail: {
    type: String
  },
  authorGender: {
    type: String
  },
  likes: [],
  shits: [],
  timestamp: {
    type: Date,
    default: new Date()
  }
});

module.exports = post = mongoose.model('post', postSchema);
