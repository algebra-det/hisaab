class ErrorHandler extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const ErrorMiddleware = (error, req, res, next) => {
  console.log("Error Middleware: ", error);
  return res.status(error.status || 500).json({
    message: error.message || "Internal Server Error",
  });
};

export const asyncError = (passedFunc) => (req, res) => {
  return Promise.resolve(passedFunc(req, res)).catch((err) => {
    return errorHandler(res, 500, err.message);
  });
};

module.exports = {
  ErrorMiddleware,
  ErrorHandler,
  asyncError,
};
