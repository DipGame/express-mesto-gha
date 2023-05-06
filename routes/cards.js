const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getAllCards, deleteCard, putLikesCard, deleteLikesCard,
} = require('../controllers/cards');
const Auth = require('../middlewares/auth');

cardRouter.use('/', Auth);

cardRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  putLikesCard,
);
cardRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  deleteLikesCard,
);
cardRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  deleteCard,
);
cardRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      // eslint-disable-next-line no-useless-escape
      link: Joi.string().required().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),
    }),
  }),
  createCard,
);
cardRouter.get('/', getAllCards);

module.exports = cardRouter;
