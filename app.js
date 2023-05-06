const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { NotFoundError } = require('./errors/errors');
const router = require('./routes');
const {
  NOT_FOUND,
} = require('./errors/errors');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use('*', (req, res, next) => {
  const error = new NotFoundError('Страница не найдена');
  res.status(NOT_FOUND).send({ message: error.message });
  next();
});

// app.use((err, req, res, next) => {
//   class NotFoundError extends Error {
//     constructor(message) {
//       super(messgae);
//       this.statusCode = 404;
//     }
//   }
//   const { statusCode = 500, message } = err;
//   res.status(statusCode).send({ message: statusCode === 500 ? 'Что-то пошло не так' : message });
// });

app.use(errors());

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('start server');
});
