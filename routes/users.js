const userRouter = require('express').Router();
const {
  createUser, getUser, getAllUser, patchUser, patchAvatar, login,
} = require('../controllers/users');
const Auth = require('../middlewares/auth');

userRouter.post('/signup', createUser);
userRouter.post('/signin', login);
userRouter.use('/', Auth);
userRouter.get('/:id', getUser);
userRouter.patch('/me/avatar', patchAvatar);
userRouter.patch('/me', patchUser);
userRouter.get('/', getAllUser);

module.exports = userRouter;
