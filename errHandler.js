const { errorJson } = require('./subFunctions');
const { customError } = require('./errClass');

// eslint-disable-next-line no-unused-vars
const errorHandlerMiddleware = (error, req, res, next) => {
  if (error instanceof customError) {
    return res.status(error.code).json(errorJson(error.message));
  }
  return res.status(500).json(errorJson('Something went wrong, refresh page'));
};

module.exports = errorHandlerMiddleware;
