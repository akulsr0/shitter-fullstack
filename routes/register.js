const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const tokenCookie = req.headers.cookie;
    if (tokenCookie != undefined) {
      const token = tokenCookie.split('=')[1];
      const decoded = jwt.verify(token, config.get('JWT_SECRET'));
      const user = await User.findById(decoded.id);
      return res.redirect('/');
    }
    res.render('register');
  } catch (error) {
    res.json(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, country, gender, bio, dob, password } = req.body;
    const checkExistingEmailUser = await User.find({ email });
    if (checkExistingEmailUser.length > 0) {
      return res.render('message', { message: 'User already exists' });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      country,
      gender,
      dob,
      bio,
      password: hashPassword
    });
    await user.save();
    res.render('message', { message: 'Account created successfully' });
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
});

module.exports = router;
