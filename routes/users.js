const usersRouter = require('express').Router();
const { getUsers, getUserByID, createUser } = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/:userId', getUserByID);

usersRouter.post('/users', createUser);

module.exports = usersRouter;
