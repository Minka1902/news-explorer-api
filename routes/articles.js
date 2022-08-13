const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  createArticle, deleteArticle, getArticles,
} = require('../controllers/articles');

router.get('/articles', getArticles);

router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2),
    text: Joi.string().required().min(2),
    date: Joi.date().required(),
    source: Joi.string().required(),
    link: Joi.string().required().uri(),
    image: Joi.string().required().uri(),
    owner: Joi.string().required()
  }),
}), createArticle);

router.delete('/articles', celebrate({
  body: Joi.object().keys({
    articleId: Joi.string().required(),
  }),
}), deleteArticle);

module.exports = router;
