const usersRouter = require('express').Router();
const {
  getUsers,
  getUserByID,
  createUser,
  updateUser,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/:userId', getUserByID);

usersRouter.post('/users', createUser);

usersRouter.patch('/users/me', updateUser);

usersRouter.patch('/users/me', updateUser);

module.exports = usersRouter;
