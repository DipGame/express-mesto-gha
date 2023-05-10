const Card = require('../models/card');

const {
  NOT_FOUND, CREATED, FORBIDDEN, CustomError,
} = require('../errors/errors');

const createCard = (req, res, next) => {
  const id = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: id })
    .then((newCard) => {
      res.status(CREATED).send(newCard);
    })
    .catch(next);
};

const getAllCards = (req, res, next) => {
  Card.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const putLikesCard = (req, res, next) => {
  const id = req.user._id;
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new CustomError(NOT_FOUND, 'Карточка не найдена'));
      }
      Card.findByIdAndUpdate({ _id: cardId }, { $addToSet: { likes: id } }, { new: true })
        .orFail()
        .then((like) => {
          res.send(like);
        })
        .catch(next);
    })
    .catch(next);
};

const deleteLikesCard = (req, res, next) => {
  const id = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new CustomError(NOT_FOUND, 'Карточка не найдена'));
      }
      Card.findByIdAndUpdate({ _id: cardId }, { $pull: { likes: id } }, { new: true })
        .orFail()
        .then((like) => {
          res.send(like);
        })
        .catch(next);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const id = req.user._id;
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new CustomError(NOT_FOUND, 'Карточка не найдена'));
      }
      const isEqual = card.owner.equals(id);
      if (isEqual) {
        Card.findByIdAndDelete(cardId)
          .orFail()
          .then((cards) => {
            res.send(cards);
          })
          .catch(next);
      } else {
        next(new CustomError(FORBIDDEN, 'Эта карточка не ваша)'));
      }
    })
    .catch(next);
};

module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  putLikesCard,
  deleteLikesCard,
};
