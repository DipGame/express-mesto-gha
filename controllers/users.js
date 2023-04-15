const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const patchUser = (req, res) => {
  const { id } = req.user;
  const { name, about } = req.body;

  User.updateOne({ _id: id }, { $set: { name, about } })
    .then((updateUser) => {
      res.send(updateUser);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const patchAvatar = (req, res) => {
  const { id } = req.user;
  const { avatar } = req.body;

  User.updateOne({ _id: id }, { $set: { avatar } })
    .then((updateUser) => {
      res.send(updateUser);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const getAllUser = (req, res) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = {
  createUser,
  getUser,
  getAllUser,
  patchUser,
  patchAvatar,
};
