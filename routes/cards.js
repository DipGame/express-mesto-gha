const cardRouter = require('express').Router();
const {
  createCard, getAllCards, deleteCard, putLikesCard, deleteLikesCard,
} = require('../controllers/cards');
const Auth = require('../middlewares/auth');

cardRouter.use('/', Auth);
cardRouter.put('/:cardId/likes', putLikesCard);
cardRouter.delete('/:cardId/likes', deleteLikesCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.post('/', createCard);
cardRouter.get('/', getAllCards);

module.exports = cardRouter;
