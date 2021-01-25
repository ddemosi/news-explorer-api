const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const isEmail = require('validator/lib/isEmail');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ValidationError = require('../errors/validation-error');
const {
  badRequestMessage, resourceNotFoundMessage, badEmailMessage, validationErrorMessage,
} = require('../utils/constants');

const User = require('../models/user');

function getCurrentUserInfo(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(resourceNotFoundMessage);
      }
      res.status(200).send(user);
    })
    .catch(next);
}

// Creates user on /register submit

function createUser(req, res, next) {
  // encrypt password before storage
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const body = {
        name: req.body.name,
        email: req.body.email,
        password: hash,
      };
      // redundant email validation
      if (!isEmail(req.body.email)) {
        throw new BadRequestError(badEmailMessage);
      }
      // mongoose call to create the record
      User.create(body)
        .then((result) => {
          // check if any storage/validation errors occurred inside Mongo.
          // Mongo errors are handled by the central error system.
          if (!result) {
            throw new BadRequestError(badRequestMessage);
          }
          // assigning a registration token
          const token = jwt.sign(
            { _id: result._id },
            process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
          );

          const newObj = { name: result.name, email: result.email, token };

          res.cookie('token', `Bearer ${token}`, { expires: new Date(Date.now() + 24 * 3600000), sameSite: 'none', secure: true });
          res.status(200).send(newObj);
        })
        .catch(next);
    })
    .catch(next);
}

//

function login(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new ValidationError(validationErrorMessage);
      }
      return user;
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
      );
      res.cookie('token', `Bearer ${token}`, { expires: new Date(Date.now() + 24 * 3600000), sameSite: 'none', secure: true });
      res.status(200).send({ token: `Bearer ${token}` });
    })
    .catch(next);
}

function logout(req, res) {
  res.clearCookie('token');
  res.status(200).send({ message: 'User logged out' });
}

module.exports = {
  getCurrentUserInfo,
  createUser,
  login,
  logout,
};
