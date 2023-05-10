const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { CustomError, NOT_FOUND, INTERNAL_SERVERE_ERROR } = require('./errors/errors');
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
  const { statusCode = INTERNAL_SERVERE_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVERE_ERROR
        ? 'Произошла ошибка на сервере'
        : message,
    });
  next();
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('start server');
});
