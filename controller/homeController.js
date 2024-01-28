const indexController = async (_req, res, _next) => {
  return res
    .status(200)
    .json({ message: 'Page contents development in progress' })
}

module.exports = {
  indexController
}
