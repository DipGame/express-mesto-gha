const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVERE_ERROR,
  CREATED,
  UNAUTHORIZED,
  CONFLICT,
  OK,
} = require('../errors/errors');

const createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error('Пользователь уже существует');
        error.statusCode = CONFLICT;
        throw error;
      }

      const hash = bcrypt.hash(password, 10);
      User.create({
        email, password: hash, name, about, avatar,
      });

      res.status(CREATED).send({
        email, name, about, avatar,
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const error = new Error('Пользователь не найден');
        error.statusCode = UNAUTHORIZED;
        throw error;
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const error = new Error('Email или пароль не верны');
            error.statusCode = BAD_REQUEST;
            throw error;
          }
          const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
          res.status(OK).send({ token });
        })
        .catch(next);
    })
    .catch(next);
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

const getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Что-то пошло не так...' });
      }
    });
};

const getMe = (req, res) => {
  const id = req.user._id;

  User.findById(id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'Пользоватdель не найден' });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Что-то пошло не так...' });
      }
    });
};

const patchUser = (req, res) => {
  const id = req.user._id;
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
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Что-то пошло не так...' });
      }
    });
};

const patchAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((updateUser) => {
      res.send(updateUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
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
  getMe,
};
