const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createUser, getUser, getAllUser, patchUser, patchAvatar, login, getMe,
} = require('../controllers/users');
const Auth = require('../middlewares/auth');

userRouter.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      // eslint-disable-next-line no-useless-escape
      avatar: Joi.string().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);
userRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
userRouter.use('/users', Auth);
userRouter.get('/users/me', getMe);
userRouter.get(
  '/users/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().hex().length(24),
    }),
  }),
  getUser,
);
userRouter.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      // eslint-disable-next-line no-useless-escape
      avatar: Joi.string().required().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),
    }),
  }),
  patchAvatar,
);
userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  patchUser,
);
userRouter.get('/users', getAllUser);

module.exports = userRouter;
