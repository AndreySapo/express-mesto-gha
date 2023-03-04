const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
require('mongoose-type-url');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Обязано быть больше 2 символов'],
    maxlength: [30, 'Обязано быть меньше 30 символов'],
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'Обязано быть больше 2 символов'],
    maxlength: [30, 'Обязано быть меньше 30 символов'],
  },
  avatar: {
    type: mongoose.SchemaTypes.Url,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (value) => isEmail(value),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

module.exports = mongoose.model('user', userSchema);
