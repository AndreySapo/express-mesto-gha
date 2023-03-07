const Card = require('../models/card');
const {
  ERROR_BAD_REQUEST,
  ERROR_FORBIDDEN,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
        return;
      }
      res.send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      if (err.name === 'InternalServerError') {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
        return;
      }
      res.send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }

      const userID = req.user._id;
      const cardOwner = card.owner.toString();

      // res.send(userID === cardOwner);
      if (userID !== cardOwner) {
        res.status(ERROR_FORBIDDEN).send('Попытка удалить чужую карточку');
      }

      card.remove()
        .then(() => {
          res.send({ data: card });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Удаление карточки с несуществующим в БД id' });
        return;
      }
      if (err.name === 'InternalServerError') {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
        return;
      }
      res.send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      if (err.name === 'InternalServerError') {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
        return;
      }
      res.send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      if (err.name === 'InternalServerError') {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
        return;
      }
      res.send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};
