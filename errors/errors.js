const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVERE_ERROR = 500;
const CREATED = 201;
const OK = 200;
const UNAUTHORIZED = 401;
const CONFLICT = 409;
const FORBIDDEN = 403;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVERE_ERROR,
  CREATED,
  UNAUTHORIZED,
  CONFLICT,
  OK,
  FORBIDDEN,
  NotFoundError,
};
