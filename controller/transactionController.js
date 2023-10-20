const transactions = require("../models/Transaction");
const dayjs = require("dayjs");
const { Op } = require("sequelize");

const getTransactions = async (req, res, next) => {
  try {
    let { dateRange } = req.query;
    if (!dateRange) dateRange = "day";
    else if (!["day", "week", "month", "year"].includes(dateRange)) {
      return res.status(400).json({
        message:
          "Date Range sent is not valid. Valid options: ['day', 'week', 'month', 'year']",
      });
    }
    let startTime = dayjs().startOf(dateRange).format();
    let endTime = dayjs().endOf(dateRange).format();
    const data = await transactions.findAll({
      where: {
        createdAt: {
          [Op.gte]: startTime,
          [Op.lte]: endTime,
        },
        createdBy: req.user.id,
      },
    });
    res.json({ message: "Fetched Successfuly", data, startTime, endTime });
  } catch (error) {
    console.log("Error while fetching transactions: ", error);
    res.status(400).json({
      message:
        "Date Range sent is not valid. Valid options: ['day', 'week', 'month', 'year']",
    });
  }
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
    res.json({ message: "created Successfuly", data });
  } catch (error) {
    console.log("error occured: ", error);
    res.status(500).send({ message: "Failed", error });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
};
