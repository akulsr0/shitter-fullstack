const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Post = require('../models/Post');
const Shit = require('../models/Shit');

router.get('/', async (req, res) => {
  const tokenCookie = req.headers.cookie;
  if (tokenCookie != undefined) {
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    const user = await User.findById(decoded.id).select('-password');
    const posts = await Post.find({});
    return res.render('dashboard', { user, posts });
  }
  res.render('index');
});

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.find({ email: email });
    if (user.length > 0) {
      const authResult = await bcrypt.compare(password, user[0].password);
      if (authResult) {
        const token = jwt.sign({ id: user[0]._id }, config.get('JWT_SECRET'), {
          expiresIn: '24h'
        });
        res.cookie('token', token);
        res.redirect('/');
        return;
      }
      res.send('Invalid Credentials');
    } else {
      res.send('Invalid Credentials');
    }
  } catch (err) {
    res.json({ err });
  }
});

router.get('/find', async (req, res) => {
  try {
    const tokenCookie = req.headers.cookie;
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    const currentUser = await User.findById(decoded.id).select('-password');
    const users = await User.find({});
    res.render('find', { currentUser, users });
  } catch (error) {
    res.json(error);
  }
});

router.get('/profile', (req, res) => {
  res.send('Profile');
});

router.post('/like/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const post = await Post.findById(pid);

    const tokenCookie = req.headers.cookie;
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    const currentUser = await User.findById(decoded.id).select('-password');

    const likes = post.likes;
    let isAlreadyLike = false;

    for (let like of likes) {
      if (like.email == currentUser.email) {
        isAlreadyLike = true;
      }
    }

    if (!isAlreadyLike) {
      post.likes.push(currentUser);
      await post.save();
    } else {
      const unlikerId = currentUser.email;
      const newLikes = likes.filter(like => like.email !== unlikerId);
      post.likes = newLikes;
      await post.save();
    }

    res.redirect(req.get('referer'));
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post('/add/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const post = await Post.findById(pid);

    const tokenCookie = req.headers.cookie;
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    const currentUser = await User.findById(decoded.id).select('-password');

    const { shit } = req.body;

    // const newShit = { shit, author: currentUser, timestamp: new Date() };
    const newShit = new Shit({ shit, author: currentUser });

    post.shits.push(newShit);
    await post.save();

    res.redirect('/' + pid);
  } catch (error) {
    res.json(error);
  }
});

router.get('/post/:pid', async (req, res) => {
  try {
    const tokenCookie = req.headers.cookie;
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    const user = await User.findById(decoded.id).select('-password');

    const post = await Post.findById(req.params.pid);

    res.render('post', { post, user });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
