const mongoose = require('mongoose');

const userScema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

module.exports = new mongoose.model('User', userScema);
