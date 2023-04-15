const userRouter = require('express').Router();
const { createUser, getUser, getAllUser, patchUser, patchAvatar } = require('../controllers/users');

userRouter.get('/:id', getUser);
userRouter.patch('/me/avatar', patchAvatar);
userRouter.patch('/me', patchUser);
userRouter.get('/', getAllUser);
userRouter.post('/', createUser);

module.exports = userRouter;
