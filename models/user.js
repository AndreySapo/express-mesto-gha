// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
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
});

module.exports = mongoose.model('user', userSchema);
