const indexController = async (req, res, next) => {
  return res
    .status(200)
    .json({ message: 'Page contents development in progress' })
}

module.exports = {
  indexController,
}
