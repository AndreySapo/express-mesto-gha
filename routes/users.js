const usersRouter = require('express').Router();
const {
  getUsers,
  getUserByID,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/:userId', getUserByID);

usersRouter.post('/', createUser);

usersRouter.patch('/me', updateUser);

usersRouter.patch('/me', updateUser);

usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
