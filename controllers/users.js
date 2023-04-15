const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка или пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так...' });
      }
    });
};

const patchUser = (req, res) => {
  const { id } = req.user;
  const { name, about } = req.body;

  User.updateOne({ _id: id }, { $set: { name, about } })
    .orFail()
    .then((updateUser) => {
      res.send(updateUser);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка или пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так...' });
      }
    });
};

const patchAvatar = (req, res) => {
  const { id } = req.user;
  const { avatar } = req.body;

  User.updateOne({ _id: id }, { $set: { avatar } })
    .orFail()
    .then((updateUser) => {
      res.send(updateUser);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка или пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так...' });
      }
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
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка или пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так...' });
      }
    });
};

const getAllUser = (req, res) => {
  User.find()
    .orFail()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка или пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так...' });
      }
    });
};

module.exports = {
  createUser,
  getUser,
  getAllUser,
  patchUser,
  patchAvatar,
};
