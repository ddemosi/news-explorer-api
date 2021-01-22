const jwt = require('jsonwebtoken');
const AuthorizationRequiredError = require('../errors/authorization-required-error');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const authorization = req.cookies.token;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AuthorizationRequiredError('Authorization Error');
    }
    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret');
    } catch (err) {
      throw new AuthorizationRequiredError('Could not verify token');
    }

    req.user = payload;
    next();
  } catch (err) {
    const { statusCode, message } = err;
    res.status(statusCode).send({
      message,
    });
  }
};
