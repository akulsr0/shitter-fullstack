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

router.get('/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await User.findById(uid);
    const allPosts = await Post.find({});
    const posts = allPosts.filter(post => post.authorId === uid);
    res.render('posts', { user, posts });
  } catch (error) {
    res.json(error);
  }
});

router.post('/delete/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    await Post.findByIdAndDelete(pid);

    const tokenCookie = req.headers.cookie;
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));

    res.redirect('/posts/' + decoded.id);
  } catch (error) {
    res.error(error);
  }
});

module.exports = router;
