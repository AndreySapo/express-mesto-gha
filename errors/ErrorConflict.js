const { ERROR_CONFLICT } = require('./errors');

class ErrorConflict extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorConflict';
    this.statusCode = ERROR_CONFLICT;
  }
}

module.exports = ErrorConflict;
