const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { celebrate, Joi, errors } = require('celebrate');
const {
  NOT_FOUND,
} = require('./errors/errors');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.patch('*', (req, res) => {
  res.send({ message: 'Что то не так...' }, NOT_FOUND);
});

app.use(errors());

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('start server');
});
