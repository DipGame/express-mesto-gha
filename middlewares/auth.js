// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../errors/errors');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new Error('Необходима авторизация');
    error.statusCode = UNAUTHORIZED;
    throw error;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    const error = new Error('Необходима авторизация');
    error.statusCode = UNAUTHORIZED;
    throw error;
  }

  req.user = payload;

  next();
};
