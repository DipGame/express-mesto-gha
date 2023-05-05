const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const {
  NOT_FOUND,
} = require('./errors/errors');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.patch('*', (req, res) => {
  const error = new Error('Что то не так...');
  error.statusCode = NOT_FOUND;
  res.status(error.statusCode).send({ message: error.message });
});

app.use(errors());

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('start server');
});
