const cardRouter = require('express').Router();
const {
  createCard, getAllCards, deleteCard, putLikesCard, deleteLikesCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

cardRouter.put('/:cardId/likes', auth, putLikesCard);
cardRouter.delete('/:cardId/likes', auth, deleteLikesCard);
cardRouter.delete('/:cardId', auth, deleteCard);
cardRouter.post('/', auth, createCard);
cardRouter.get('/', auth, getAllCards);

module.exports = cardRouter;
