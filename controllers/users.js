const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  NOT_FOUND, CREATED, UNAUTHORIZED, CONFLICT, OK, CustomError,
} = require('../errors/errors');

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then(() => {
          res.status(CREATED).send({
            email, name, about, avatar,
          });
        })
        .catch((err) => {
          console.log(err.errors.email);
          if (err.errors.email.kind === 'unique') {
            next(new CustomError(CONFLICT, 'Пользователь уже существует'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new CustomError(UNAUTHORIZED, 'Пароль или Email неверные'));
        return;
      }
      bcrypt.compare(password, user.password)
        .then((fff) => {
          if (!fff) {
            next(new CustomError(UNAUTHORIZED, 'Пароль или Email неверные'));
          }
          const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
          res.status(OK).send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

const getAllUser = (req, res, next) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        next(new CustomError(NOT_FOUND, 'Пользователь не найден'));
        return;
      }
      res.send(user);
    })
    .catch(next);
};

const getMe = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const patchUser = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const patchAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((updateUser) => {
      res.send(updateUser);
    })
    .catch(next);
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
