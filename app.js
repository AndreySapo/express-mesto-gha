const { PORT = 3000, SERVER = 'mongodb://0.0.0.0:27017/mestodb' } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { ERROR_NOT_FOUND } = require('./errors/errors');

const { createUser, login, userInfo } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

mongoose.set('strictQuery', false);
// подключаемся к серверу mongo
mongoose.connect(SERVER, { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
app.get('/users/me', auth, userInfo);
app.use((req, res, next) => {
  req.user = {
    _id: '63fadda2d6c0fd5e151a2963',
  };
  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res, next) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Этот путь не реализован' });

  next();
});

app.listen(PORT);
