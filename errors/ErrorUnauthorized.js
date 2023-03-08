const { ERROR_UNAUTHORIZED } = require('./errors');

class ErrorUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorUnauthorized';
    this.statusCode = ERROR_UNAUTHORIZED;
  }
}

module.exports = ErrorUnauthorized;
