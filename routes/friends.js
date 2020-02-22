const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const tokenCookie = req.headers.cookie;
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    const user = await User.findById(decoded.id).select('-password');
    res.render('friends', { user });
  } catch (error) {
    res.json(error);
  }
});

router.post('/:uid/remove', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);
    const userFriends = user.friends;
    const tokenCookie = req.headers.cookie;
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    const currentUser = await User.findById(decoded.id).select('-password');
    const currentUserFriends = currentUser.friends;

    const newUserFriends = userFriends.filter(x => x._id != currentUser.id);
    const newCurrentUserFriends = currentUserFriends.filter(
      x => x._id != user.id
    );

    user.friends = newUserFriends;
    currentUser.friends = newCurrentUserFriends;

    await user.save();
    await currentUser.save();

    res.redirect('back');
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
