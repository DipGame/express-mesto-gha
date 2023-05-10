const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  NOT_FOUND, CREATED, UNAUTHORIZED, CONFLICT, OK, CustomError,
} = require('../errors/errors');

const createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      next(new CustomError(CONFLICT, 'Пользователь уже существует'));
    }

    const hash = await bcrypt.hash(password, 10);
    User.create({
      email, password: hash, name, about, avatar,
    });

    res.status(CREATED).send({
      email, name, about, avatar,
    });
  } catch (err) {
    next(err);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new CustomError(UNAUTHORIZED, 'Пароль или Email неверные'));
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
        const error = new Error('Пользователь не найден');
        error.statusCode = NOT_FOUND;
        throw error;
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
