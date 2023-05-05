const userRouter = require('express').Router();
const {
  createUser, getUser, getAllUser, patchUser, patchAvatar, login,
} = require('../controllers/users');
const Auth = require('../middlewares/auth');

userRouter.post('/signup', createUser);
userRouter.post('/signin', login);
userRouter.use('/users', Auth);
userRouter.get('/users/:id', getUser);
userRouter.patch('/users/me/avatar', patchAvatar);
userRouter.patch('/users/me', patchUser);
userRouter.get('/users', getAllUser);

module.exports = userRouter;
