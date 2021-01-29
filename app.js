/* eslint-disable no-useless-escape */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
// const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const { limiter } = require('./utils/rateLimiter');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;
// an array of allowed domains
const allowedCors = [
  'https://danny-news-explorer.students.nomoreparties.site',
  'http://danny-news-explorer.students.nomoreparties.site',
  'https://www.danny-news-explorer.students.nomoreparties.site',
  'http://www.danny-news-explorer.students.nomoreparties.site',
  'http://localhost:3000',
  'https://localhost:3000',
  // 'http://localhost:3001',
];

// connect to db
mongoose.connect(`mongodb://localhost:27017/${process.env.DB}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// listen to port 3000
const app = express();

app.use(limiter);

app.use(helmet());

app.use(requestLogger);

app.use(express.json());

// app.use(cookieParser());

app.use((req, res, next) => {
  const { origin } = req.headers; // assign the corresponding header to the origin variable

  if (allowedCors.includes(origin)) { // check that the origin value is among the allowed domains
    res
      .header('Access-Control-Allow-Origin', origin)
      .header('Access-Control-Allow-Credentials', true);
  }

  next();
});

app.options('*', cors(
  {
    credentials: true,
    origin: true,
  },
));

app.use('/', routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at port ${PORT}`);
});
