const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  saveArticle, unsaveArticle, createArticle, deleteArticle, getArticles,
} = require('../controllers/articles');

router.get('/articles', getArticles);

router.patch('/articles', celebrate({
  params: Joi.object().keys({
    name: Joi.string().required().email().min(2)
      .max(30),
    link: Joi.string().uri(),
  }).unknown(true),
}), createArticle);

router.delete('/articles', celebrate({
  params: Joi.object().keys({
    articleId: Joi.required(),
  }).unknown(true),
}), deleteArticle);

router.delete('/articles', celebrate({
  params: Joi.object().keys({
    name: Joi.string().required().email().min(2)
      .max(30),
    link: Joi.string().uri(),
  }),
}), unsaveArticle);

router.put('/articles', celebrate({
  params: Joi.object().keys({
    name: Joi.string().required().email().min(2)
      .max(30),
    link: Joi.string().uri(),
  }),
}), saveArticle);
