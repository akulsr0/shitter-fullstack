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

module.exports = router;
