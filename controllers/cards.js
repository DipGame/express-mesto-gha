const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVERE_ERROR, CREATED } = require('../errors/errors');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user
  })
    .then((newCard) => {
      res.status(CREATED).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Проверьте правильность введенных данных' })
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Что-то пошло не так...' })
      }
    });
};

const getAllCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.send(err);
    });
};

const putLikesCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate({ _id: cardId }, { $addToSet: { likes: req.user } }, { new: true })
    .orFail()
    .then((like) => {
      res.send(like);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Проверьте правильность введенных данных' });
      } else {
        res.status(NOT_FOUND).send({ message: 'Что-то пошло не так...' });
      }
    });
};

const deleteLikesCard = (req, res) => {
  const { id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate({ _id: cardId }, { $pull: { likes: id } }, { new: true })
    .orFail()
    .then((like) => {
      res.send(like);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Проверьте правильность введенных данных' });
      } else {
        res.status(NOT_FOUND).send({ message: 'Что-то пошло не так...' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail()
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Проверьте правильность введенных данных' });
      } else {
        res.status(NOT_FOUND).send({ message: 'Что-то пошло не так...' });
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
