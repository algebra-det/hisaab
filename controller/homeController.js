const { asyncHandler, ApiResponse } = require('../utils')
const indexController = asyncHandler(async (_req, res, _next) => {
  return res
    .status(200)
    .json(new ApiResponse({}, 200, 'Home Route in progress'))
})

module.exports = { indexController }
