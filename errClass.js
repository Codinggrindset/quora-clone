class customError extends Error {
  constructor(message, code) {
    super(message);
    this.message = message;
    this.code = code;
    // comment
  }
}

// eslint-disable-next-line new-cap
const createCustomError = (msg, code) => { throw new customError(msg, code); };

// eslint-disable-next-line import/prefer-default-export
module.exports = { customError, createCustomError };
