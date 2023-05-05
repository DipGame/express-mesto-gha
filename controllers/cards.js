const Card = require('../models/card');

const {
  BAD_REQUEST, NOT_FOUND, INTERNAL_SERVERE_ERROR, CREATED,
} = require('../errors/errors');

const createCard = (req, res) => {
  const id = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: id })
    .then((newCard) => {
      res.status(CREATED).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Проверьте правильность введенных данных' });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Что-то пошло не так...' });
      }
    });
};

const getAllCards = (req, res) => {
  Card.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Что-то пошло не так...' });
    });
};

const putLikesCard = (req, res) => {
  const id = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate({ _id: cardId }, { $addToSet: { likes: id } }, { new: true })
    .orFail()
    .then((like) => {
      res.send(like);
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

const deleteLikesCard = (req, res) => {
  const id = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate({ _id: cardId }, { $pull: { likes: id } }, { new: true })
    .orFail()
    .then((like) => {
      res.send(like);
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

const deleteCard = (req, res) => {
  const id = req.user._id;
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      const isEqual = card.owner.equals(id);
      if (isEqual) {
        Card.findByIdAndDelete(cardId)
          .orFail()
          .then((cards) => {
            res.send(cards);
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              res.status(BAD_REQUEST).send({ message: 'Проверьте правильность введенных данных' });
            } else if (err.name === 'DocumentNotFoundError') {
              res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
            } else {
              res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Что-то пошло не так...' });
            }
          });
      } else {
        res.status(403).send({ message: 'Эта не ваша карточка' });
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
