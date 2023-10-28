const Product = require("../models/Product");
const { Op } = require("sequelize");

const getMyProducts = async (req, res, next) => {
  let { limit, offset } = req.query;
  if (!offset) offset = 0;
  if (!limit) limit = 10;
  const { count, rows } = await Product.findAndCountAll({
    offset,
    limit,
    where: {
      createdBy: req.user.id,
    },
    order: [["updatedAt", "DESC"]],
  });
  res.json({
    message: "Results fetched successfully",
    data: rows,
    count,
  });
};

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
  getMyProducts,
  getProductsViaSearch,
};
