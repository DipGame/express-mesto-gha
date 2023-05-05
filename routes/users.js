const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createUser, getUser, getAllUser, patchUser, patchAvatar, login,
} = require('../controllers/users');
const Auth = require('../middlewares/auth');

userRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
userRouter.post('/signin', login);
userRouter.use('/users', Auth);
userRouter.get('/users/:id', getUser);
userRouter.patch('/users/me/avatar', patchAvatar);
userRouter.patch('/users/me', patchUser);
userRouter.get('/users', getAllUser);

module.exports = userRouter;
