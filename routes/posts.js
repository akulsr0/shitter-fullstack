const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');

router.post('/add', async (req, res) => {
  try {
    const tokenCookie = req.headers.cookie;
    if (tokenCookie != undefined) {
      const token = tokenCookie.split('=')[1];
      const decoded = jwt.verify(token, config.get('JWT_SECRET'));
      const user = await User.findById(decoded.id).select('-password');
      const { postText } = req.body;
      const uid = user.id;
      const { name, email, gender } = user;
      const post = new Post({
        postText,
        authorId: uid,
        authorName: name,
        authorEmail: email,
        authorGender: gender
      });
      await post.save();
      return res.render('message', { message: 'Post Saved' });
    }
    res.render('index');
  } catch (err) {
    res.json({ err });
  }
});

router.post('/:pid/deleteshit/:shitid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const post = await Post.findById(pid);
    const shits = post.shits;
    const shitid = req.params.shitid;
    const newShits = [];
    for (let shit of shits) {
      if (shit._id != shitid) {
        newShits.push(shit);
      }
    }
    post.shits = newShits;
    await post.save();
    res.redirect('/' + pid);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
