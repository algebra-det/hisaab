const Product = require("../models/Product");
const { Op } = require("sequelize");

const getProductsViaSearch = async (req, res, next) => {
  let { searchText } = req.query;
  if (!searchText || searchText.length <= 2)
    return res.status(400).json({
      message:
        "Please pass a text string and it's length should be atleast 3 characters",
    });
  const data = await Product.findAll({
    where: {
      createdBy: req.user.id,
      productName: {
        [Op.substring]: searchText,
      },
    },
  });
  res.json({
    message: "Results fetched successfully",
    data,
  });
};

module.exports = {
  getProductsViaSearch,
};
