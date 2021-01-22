const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const NotFoundError = require('../errors/not-found-error');
const { resourceNotFoundMessage } = require('../utils/constants');

const {
  login, createUser,
} = require('../controllers/users');
const articles = require('./articles');
const users = require('./users');

// ROUTES

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    }),
  }),
  createUser,
);

router.use('/', articles);

router.use('/', users);

// catch all unmatched routes

router.use('*', () => {
  throw new NotFoundError(resourceNotFoundMessage);
});

module.exports = router;
