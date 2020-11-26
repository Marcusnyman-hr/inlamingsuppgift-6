const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String, 
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  income: {
    type: Array,
    default: []
  },
  expenses: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);