const Card = require('../models/card');
const ErrorInternalServer = require('../errors/ErrorInternalServer');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorForbidden = require('../errors/ErrorForbidden');
const ErrorBadRequest = require('../errors/ErrorBadRequest');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        throw new ErrorInternalServer('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        throw new ErrorInternalServer('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка с указанным _id не найдена.');
      }

      const userID = req.user._id;
      const cardOwner = card.owner.toString();

      if (userID !== cardOwner) {
        throw new ErrorForbidden('Попытка удалить чужую карточку');
      }

      return card.remove()
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ErrorBadRequest('Удаление карточки с несуществующим в БД id');
      }
      if (err.name === 'InternalServerError') {
        throw new ErrorInternalServer('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Переданы некорректные данные для постановки лайка');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ErrorBadRequest('Передан несуществующий _id карточки');
      }
      if (err.name === 'InternalServerError') {
        throw new ErrorInternalServer('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Переданы некорректные данные для снятия лайка');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ErrorBadRequest('Передан несуществующий _id карточки');
      }
      if (err.name === 'InternalServerError') {
        throw new ErrorInternalServer('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};
