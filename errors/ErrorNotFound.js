const { ERROR_NOT_FOUND } = require('./errors');

class ErrorNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorNotFound';
    this.statusCode = ERROR_NOT_FOUND;
  }
}

module.exports = ErrorNotFound;
