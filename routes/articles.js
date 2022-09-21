const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  createArticle, deleteArticle, getArticles,
} = require('../controllers/articles');

router.get('/articles', getArticles);

router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    author: Joi.string().max(60),
    title: Joi.string().required().min(2),
    content: Joi.string().required().min(2),
    urlToImage: Joi.date().required(),
    source: Joi.string().required(),
    link: Joi.string().required().uri(),
    urlToImage: Joi.string().required().uri(),
    ownerId: Joi.string().required().min(23).max(25),
  }),
}), createArticle);

router.delete('/articles/:id', deleteArticle);

module.exports = router;
