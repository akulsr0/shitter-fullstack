const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.get('/:uid', async (req, res) => {
  try {
    const tokenCookie = req.headers.cookie;
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    const currentUser = await User.findById(decoded.id).select('-password');

    const uid = req.params.uid;
    const user = await User.findById(uid);

    res.render('userprofile', { user, currentUser });
  } catch (error) {
    res.json(error);
  }
});

router.post('/self/edit', async (req, res) => {
  try {
    const { email, bio, country } = req.body;

    const tokenCookie = req.headers.cookie;
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    const currentUser = await User.findById(decoded.id).select('-password');

    await User.update({ _id: currentUser.id }, { email, bio, country });

    res.redirect('/user/' + currentUser.id);
  } catch (error) {}
});

router.post('/:uid/add', async (req, res) => {
  try {
    const uid = req.params.uid;

    const tokenCookie = req.headers.cookie;
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    const currentUser = await User.findById(decoded.id).select('-password');

    const freq = {
      name: currentUser.name,
      id: currentUser.id,
      email: currentUser.email,
      gender: currentUser.gender,
      bio: currentUser.bio
    };

    const user = await User.findById(uid);
    user.friendrequests.push(freq);
    await user.save();

    res.redirect('back');
  } catch (error) {
    res.json(error);
  }
});

router.post('/:uid/cancel', async (req, res) => {
  try {
    const uid = req.params.uid;

    const tokenCookie = req.headers.cookie;
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));

    const user = await User.findById(uid);
    const freqs = user.friendrequests;
    const newfreqs = freqs.filter(x => x.id != decoded.id);

    user.friendrequests = newfreqs;
    await user.save();

    res.redirect('back');
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
