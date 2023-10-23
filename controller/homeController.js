const indexController = async (req, res, next) => {
  return res.status(200).json({ message: "Comming Soon." });
};

module.exports = {
  indexController,
};
