/* eslint-disable no-unused-vars */
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

mongoose.set('strictQuery', false);
// подключаемся к серверу mongo
mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/', usersRouter);
app.use((req, res, next) => {
  req.user = {
    _id: '63f9d3431b3b6a65929dc29c',
  };

  next();
});
app.use('/', cardsRouter);

app.listen(3000);
