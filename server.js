const express = require('express');
const db = require('./db');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT || 5100;
const User = require('./models/User');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

app.use('/', require('./routes/index'));
app.use('/posts', require('./routes/posts'));
app.use('/register', require('./routes/register'));
app.use('/logout', require('./routes/logout'));

app.listen(port, () => {
  console.log('-------------------------------------------------');
  console.log(`Server is running: http://localhost:${port}`);
});
