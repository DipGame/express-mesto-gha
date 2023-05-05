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

app.patch('*', (res) => {
  const error = new Error('Что то не так...');
  error.statusCode = NOT_FOUND;
  res.send({ message: error.message }, error.statusCode);
});

app.use(errors());

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('start server');
});
