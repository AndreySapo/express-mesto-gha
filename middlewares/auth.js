// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const { ERROR_UNAUTHORIZED } = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (res) => {
  res
    .status(ERROR_UNAUTHORIZED)
    .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

const generatePayload = (res, token) => {
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  return payload;
};

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    if (authorization.startsWith('Bearer ')) {
      req.user = generatePayload(res, extractBearerToken(authorization));
    } else {
      return handleAuthError(res);
    }
  } else if (req.cookies.jwt) {
    req.user = generatePayload(res, req.cookies.jwt);
  } else {
    return handleAuthError(res);
  }

  next();
};
