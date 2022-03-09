const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article');
const User = require('./models/user');
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

mongoose.connect('mongodb://localhost:27017/blog');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const user = new User({
      email: req.body.username,
      password: hash,
    });
    user
      .save()
      .then((user) => res.redirect('/blog'))
      .catch((e) => console.log(e));
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ email: username });
  if (user == null) res.redirect('/login');
  bcrypt.compare(password, user.password, (err, result) => {
    if (result == true) {
      res.render('/blog');
    } else {
      res.send('<h1> Wrong password! </h1>');
    }
  });
});

app.get('/blog', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });
  res.render('articles/index', { articles: articles });
});

app.use('/articles', articleRouter);

app.listen(3000, () => console.log('Server started on port 3000'));
