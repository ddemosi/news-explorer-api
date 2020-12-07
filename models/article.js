const mongoose = require('mongoose');
const validation = require('validator');
const NotFoundError = require('../errors/not-found-error');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
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
      validator(v) {
        validation.isURL(v);
      },
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        validation.isURL(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

articleSchema.statics.findArticleByUser = function findArticleByUser(userID) {
  return this.find({ owner: userID })
    .then((articles) => {
      if (!articles) {
        throw new NotFoundError('No cards found');
      }
      return articles;
    });
};

module.exports = mongoose.model('article', articleSchema);
