class errorHandler extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

const errorMiddleware = (error, _req, res, _next) => {
  console.log('Error Middleware: ', error)
  return res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error'
  })
}

const asyncError = passedFunc => async (req, res) => {
  return Promise.resolve(passedFunc(req, res)).catch(err => {
    return ErrorHandler(res, 500, err.message)
  })
}

module.exports = {
  errorMiddleware,
  errorHandler,
  asyncError
}
