const Card = require('../models/card');

const {
  NOT_FOUND, CREATED, FORBIDDEN,
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
        const error = new Error('Карточка не найдена');
        error.statusCode = NOT_FOUND;
        throw error;
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
        const error = new Error('Карточка не найдена');
        error.statusCode = NOT_FOUND;
        throw error;
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
        const error = new Error('Карточка не найдена');
        error.statusCode = NOT_FOUND;
        throw error;
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
        const error = new Error('Эта не ваша карточка');
        error.statusCode = FORBIDDEN;
        throw error;
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
