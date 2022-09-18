const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  author:{
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: isURL,
      message: 'Invalid URL.',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: isURL,
      message: 'Invalid URL.',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    select: false,
  },
});

module.exports = mongoose.model('articles', articleSchema);
