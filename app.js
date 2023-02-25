/* eslint-disable no-unused-vars */
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const app = express();

mongoose.set('strictQuery', false);
// подключаемся к серверу mongo
mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

const User = require('./models/user');
// const Card = require('./models/card');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
}

function getUserByID(req, res) {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
}

function createUser(req, res) {
  const { name, about, avatar } = req.query;

  // eslint-disable-next-line no-undef, no-restricted-globals
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
}

app.get('/users', getUsers);

app.get('/users/:userId', getUserByID);

app.post('/users', createUser);

app.listen(3000);
