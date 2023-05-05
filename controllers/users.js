/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validator = require('validator');
const User = require('../models/user');
const {
  BAD_REQUEST, NOT_FOUND, INTERNAL_SERVERE_ERROR, CREATED, UNAUTHORIZED,
} = require('../errors/errors');

const createUser = async (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const error = new Error('Пользователь уже существует');
      error.statusCode = 403;
      throw error;
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email, password: hash, name, about, avatar,
    });

    res.status(200).send({ message: `Пользователь ${newUser.email} успешно зарегистрирован` });
  } catch (error) {
    if (error.statusCode === 401) {
      res.status(error.statusCode).send({ message: error.message });
    } else {
      res.status(400).send({ message: error.message });
    }
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(400).send({ message: 'Пароль или Email неверные' });
        // eslint-disable-next-line no-useless-return
        return;
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            res.status(400).send({ message: 'Пароль или Email неверные' });
            // eslint-disable-next-line no-useless-return
            return;
          }
          const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
          res.status(200).send({ token });
        });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

const getAllUser = (req, res) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Что-то пошло не так...' });
    });
};

const getUser = (req, res, next) => {
  res.send(req.params.userId);

  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof BAD_REQUEST) {
        next({ message: 'Переданы некорректные данные' });
      } else {
        next(err);
      }
    });
};

const patchUser = (req, res) => {
  const { id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then(() => {
      User.findById(id)
        .then((user) => {
          res.send(user);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Проверьте правильность введенных данных' });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Что-то пошло не так...' });
      }
    });
};

const patchAvatar = (req, res) => {
  const { id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((updateUser) => {
      res.send(updateUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Проверьте правильность введенных данных' });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Что-то пошло не так...' });
      }
    });
};

module.exports = {
  createUser,
  getUser,
  getAllUser,
  patchUser,
  patchAvatar,
  login,
};
