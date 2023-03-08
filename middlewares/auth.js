// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../errors/ErrorUnauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = () => {
  throw new ErrorUnauthorized('Необходима авторизация');
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

const generatePayload = (token) => {
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return handleAuthError();
  }

  return payload;
};

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    if (authorization.startsWith('Bearer ')) {
      req.user = generatePayload(extractBearerToken(authorization));
    } else {
      return handleAuthError();
    }
  } else if (req.cookies.jwt) {
    req.user = generatePayload(req.cookies.jwt);
  } else {
    return handleAuthError();
  }

  next();
};
