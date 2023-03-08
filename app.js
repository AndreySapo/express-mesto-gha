const { PORT = 3000, SERVER = 'mongodb://0.0.0.0:27017/mestodb' } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { ERROR_INTERNAL_SERVER, ERROR_CONFLICT } = require('./errors/errors');

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
app.use(cookieParser());

mongoose.set('strictQuery', false);
// подключаемся к серверу mongo
mongoose.connect(SERVER, { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/),
    }),
  }),
  createUser,
);
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use((err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(ERROR_CONFLICT).send({ message: 'Переданы некорректные данные при создании пользователя.' });
  }
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
  }
  next();
});
app.use(errors());

app.listen(PORT);
