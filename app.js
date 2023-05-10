const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { CustomError, NOT_FOUND, INTERNAL_SERVERE_ERROR, CONFLICT } = require('./errors/errors');
const router = require('./routes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use('*', (req, res, next) => {
  next(new CustomError(NOT_FOUND, 'Страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  let { statusCode = INTERNAL_SERVERE_ERROR, message } = err;
  if (err.statusCode) {
    statusCode = CONFLICT;
    message = err.message;
  }
  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVERE_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('start server');
});
