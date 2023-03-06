const usersRouter = require('express').Router();
const {
  getUsers,
  getUserByID,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/:userId', getUserByID);

usersRouter.patch('/me', updateUser);

usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
