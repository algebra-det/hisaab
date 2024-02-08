const errorHandler = (error, _req, res, _next) => {
  return res.status(error.status || 500).json({
    statusCode: error.status || 500,
    data: error.data || {},
    message: error.message || 'Internal Server Error',
    success: false,
    errors: error.errors,
    stack: error.stack
  })
}

module.exports = { errorHandler }
