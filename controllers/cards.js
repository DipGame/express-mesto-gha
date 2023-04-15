const Card = require('../models/card');

const createCard = (req, res) => {
  const { id } = req.user;
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: id,
    likes: [],
  })
    .orFail()
    .then((newCard) => {
      res.send(newCard);
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

const putLikesCard = (req, res) => {
  const { id } = req.user;
  const { cardId } = req.params;

  Card.updateOne({ _id: cardId }, { $addToSet: { likes: id } })
    .orFail()
    .then((like) => {
      res.send(like);
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

const deleteLikesCard = (req, res) => {
  const { id } = req.user;
  const { cardId } = req.params;

  Card.updateOne({ _id: cardId }, { $pull: { likes: id } })
    .orFail()
    .then((like) => {
      res.send(like);
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

const getAllCards = (req, res) => {
  Card.find()
    .orFail()
    .then((cards) => {
      res.send(cards);
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

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndDelete(id)
    .orFail()
    .then((cards) => {
      res.send(cards);
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
  createCard,
  getAllCards,
  deleteCard,
  putLikesCard,
  deleteLikesCard,
};
