const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const app = express();

mongoose.set('strictQuery', false);
// подключаемся к серверу mongo
mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(3000);
