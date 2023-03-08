const { ERROR_INTERNAL_SERVER } = require('./errors');

class ErrorInternalServer extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorInternalServer';
    this.statusCode = ERROR_INTERNAL_SERVER;
  }
}

module.exports = ErrorInternalServer;
