// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.name === 'MongoError' && err.code === 11000) {
    res.status(409).send({ message: 'Email already exists' });
  } else if (err.statusCode === undefined) {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
      message: statusCode === 500 ? 'Internal server error' : message,
    });
  } else {
    const { statusCode, message } = err;
    res.status(statusCode).send({ message });
  }
}

module.exports = { errorHandler };
