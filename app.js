const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    id: '643aeae7efe2e22414bfa1ff',
  };
  next();
});

app.use(router);

app.get('*', function(req, res){
  res.json("ОШИБКА", 404);
});

app.listen(3000, () => {
  console.log('start server');
});
