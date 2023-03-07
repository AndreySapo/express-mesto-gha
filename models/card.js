const mongoose = require('mongoose');
require('mongoose-type-url');
const { default: isURL } = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Обязано быть больше 2 символов'],
    maxlength: [30, 'Обязано быть меньше 30 символов'],
  },
  link: {
    type: mongoose.SchemaTypes.Url,
    required: true,
    validate: {
      validator: (value) => isURL(value),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  likes:
    [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
