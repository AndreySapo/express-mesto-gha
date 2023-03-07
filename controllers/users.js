const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZED,
  ERROR_NOT_FOUND,
  ERROR_CONFLICT,
  ERROR_INTERNAL_SERVER,
} = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

// получить всех юзеров
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: 'На сервере произошла ошибка' });
        return;
      }
      res.send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};

// получить юзера по айди
module.exports.getUserByID = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Получение пользователя с несуществующим в БД id' });
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_BAD_REQUEST)
          .send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      if (err.name === 'InternalServerError') {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: 'На сервере произошла ошибка' });
        return;
      }
      res.send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};

// создать юзера
module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!password) {
    res
      .status(ERROR_BAD_REQUEST)
      .send('Переданы некорректные данные при создании пользователя');
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        res
          .status(ERROR_CONFLICT)
          .send('Пользователь с этим email уже существует');
      }
    });

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          // MongoServerError
          if (err.name === 'MongoServerError') {
            res
              .status(ERROR_BAD_REQUEST)
              .send({ message: 'Переданы некорректные данные при создании пользователя.' });
            return;
          }
          if (err.name === 'ValidationError') {
            res
              .status(ERROR_BAD_REQUEST)
              .send({ message: 'Переданы некорректные данные при создании пользователя.' });
            return;
          }
          if (err.name === 'InternalServerError') {
            res
              .status(ERROR_INTERNAL_SERVER)
              .send({ message: 'На сервере произошла ошибка' });
            return;
          }
          res.send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
        });
    });
};

// обновить информацию по юзеру
module.exports.updateUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user,
    { name, about, avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      if (err.name === 'InternalServerError') {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: 'На сервере произошла ошибка' });
        return;
      }
      res.send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};

// обновить отдельно аватар юзера
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении аватара.' });
        return;
      }
      if (err.name === 'InternalServerError') {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: 'На сервере произошла ошибка' });
        return;
      }
      res.send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });

      res.send({ _id: user._id });
    })
    .catch((err) => {
      res
        .status(ERROR_UNAUTHORIZED)
        .send({ message: err.message });
    });
};

module.exports.userInfo = (req, res) => {
  const { _id } = req.user._id;

  User.findOne(_id)
    .then((user) => {
      res.send({
        user,
      });
    })
    .catch((err) => {
      // ? может ещё какая-то ошибка должна быть?
      if (err.name === 'InternalServerError') {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: 'На сервере произошла ошибка' });
        return;
      }
      res.send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};
