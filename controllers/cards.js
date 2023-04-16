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
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Проверьте правильность введенных данных' })
      } else {
        res.status(500).send({ message: 'Что-то пошло не так...' })
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
  const { id } = req.user;
  const { cardId } = req.params;

  Card.updateOne({ _id: cardId }, { $addToSet: { likes: id } })
    .orFail()
    .then((like) => {
      res.send(like);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Проверьте правильность введенных данных' });
      } else {
        res.status(404).send({ message: 'Что-то пошло не так...' });
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
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Проверьте правильность введенных данных' });
      } else {
        res.status(404).send({ message: 'Что-то пошло не так...' });
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
        res.status(400).send({ message: 'Проверьте правильность введенных данных' });
      } else {
        res.status(404).send({ message: 'Что-то пошло не так...' });
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
