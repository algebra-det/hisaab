const indexController = async (req, res, next) => {
  return res.status(200).json({ message: 'Login to continue...' })
}

module.exports = {
  indexController,
}
