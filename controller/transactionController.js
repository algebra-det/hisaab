const transactions = require("../models/Transaction");
const users = require("../models/User");

const getTransactions = async (req, res, next) => {
  const data = await transactions.findAll({
    where: { createdBy: req.user.id },
  });
  res.send({ message: "Fetched Successfuly", data });
};

const createTransaction = async (req, res, next) => {
  try {
    const { productName, sellingPrice, profit } = req.body;
    const data = await transactions.create({
      productName,
      sellingPrice,
      profit,
      createdBy: req.user.id,
    });
    res.send({ message: "created Successfuly", data });
  } catch (error) {
    console.log("error occured: ", error);
    res.status(500).send({ message: "Failed", error });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
};
