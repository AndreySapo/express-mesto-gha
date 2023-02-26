/* eslint-disable no-unused-vars */
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

mongoose.set('strictQuery', false);
// подключаемся к серверу mongo
mongoose.connect('mongodb://0.0.0.0:27017/mestodb', { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '63fadda2d6c0fd5e151a2963',
  };

  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(3000);
