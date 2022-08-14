const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  createUser, getCurrentUser,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);

router.post('/users', celebrate({
  body: Joi.object().keys({
    username: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

module.exports = router;
