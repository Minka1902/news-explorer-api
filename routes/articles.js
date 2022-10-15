const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  createArticle, deleteArticle, getArticles,
} = require('../controllers/articles');
const auth = require('../middleware/auth');

router.get('/articles', getArticles);

router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    author: Joi.string().max(60),
    title: Joi.string().required().min(2),
    content: Joi.string().required().min(2),
    publishedAt: Joi.date().required(),
    url: Joi.string().required().uri(),
    urlToImage: Joi.string().required().uri(),
    ownerId: Joi.string().required().min(24).max(24),
    source: Joi.string().required(),
  }),
}), createArticle);

router.delete('/articles/:deletedArticleId', auth, deleteArticle);

module.exports = router;
