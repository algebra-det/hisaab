const indexController = async (req, res, next) => {
  res.status(400).json({
    message:
      "Date Range sent is not valid. Valid options: ['day', 'week', 'month', 'year']",
  });
};
module.exports = {
  indexController,
};
