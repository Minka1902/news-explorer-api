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
  content: {
    type: String,
    required: true,
  },
  publishedAt: {
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
  urlToImage: {
    type: String,
    required: true,
    validate: {
      validator: isURL,
      message: 'Invalid URL.',
    },
  },
  ownerId: {
    type: mongoose.Types.ObjectId,
    select: false,
  },
  source: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('articles', articleSchema);
