const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  BAD_REQUEST, NOT_FOUND, INTERNAL_SERVERE_ERROR, CREATED, UNAUTHORIZED, CONFLICT, OK,
} = require('../errors/errors');

const createUser = async (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const error = new Error('Пользователь уже существует');
      error.statusCode = CONFLICT;
      throw error;
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email, password: hash, name, about, avatar,
    });

    res.status(CREATED).send({
      email, name, about, avatar,
    });
  } catch (error) {
    if (error.statusCode === CONFLICT) {
      res.status(error.statusCode).send({ message: error.message });
    } else {
      res.status(BAD_REQUEST).send({ message: error.message });
    }
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        res.status(UNAUTHORIZED).send({ message: 'Пароль или Email неверные' });
        // eslint-disable-next-line no-useless-return
        return;
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            res.status(BAD_REQUEST).send({ message: 'Пароль или Email неверные' });
            return;
          }
          const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
          res.status(OK).send({ token });
        });
    })
    .catch((err) => {
      res.status(BAD_REQUEST).send({ message: err.message });
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
    .catch(() => {
      res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Что-то пошло не так...' });
    });
};

const patchAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((updateUser) => {
      res.send(updateUser);
    })
    .catch(() => {
      res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Что-то пошло не так...' });
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
