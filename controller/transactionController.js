const transactions = require("../models/Transaction");
const dayjs = require("dayjs");
const { Op } = require("sequelize");

const getInstance = async (req, res) => {
  const transactionId = req.params.id;
  if (!transactionId)
    return res.status(400).json({
      message: "Transaction ID is required",
    });
  const transaction = await transactions.findByPk(transactionId);
  if (!transaction)
    return res.status(400).json({
      message: "No transaction found.",
    });
  if (transaction.createdBy !== req.user.id)
    return res.status(400).json({
      message: "Not authorized to update such transactions",
    });
  return transaction;
};

const getTransactions = async (req, res, next) => {
  try {
    let { dateRange, workingDate, limit, offset } = req.query;
    if (!dateRange) dateRange = "day";
    if (!workingDate) workingDate = dayjs().format("YYYY-MM-DD");
    if (!offset) offset = 0;
    if (!limit) limit = 10;
    else if (!["day", "week", "month", "year"].includes(dateRange)) {
      return res.status(400).json({
        message:
          "Date Range sent is not valid. Valid options: ['day', 'week', 'month', 'year']",
      });
    }
    let startTime = dayjs(workingDate).startOf(dateRange).format();
    let endTime = dayjs(workingDate).endOf(dateRange).format();
    const { count, rows } = await transactions.findAndCountAll({
      limit,
      offset,
      where: {
        createdAt: {
          [Op.gte]: startTime,
          [Op.lte]: endTime,
        },
        createdBy: req.user.id,
      },
    });
    res.json({
      message: "Fetched Successfuly",
      data: rows,
      count,
      startTime,
      endTime,
    });
  } catch (error) {
    console.log("Error while fetching transactions: ", error);
    res.status(400).json({
      message: "Something went wrong",
      error,
    });
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const { productName, purchasePrice, sellingPrice } = req.body;
    const data = await transactions.create({
      productName,
      purchasePrice,
      sellingPrice,
      createdBy: req.user.id,
    });
    res.json({ message: "created Successfuly", data });
  } catch (error) {
    console.log("error occured: ", error);
    res.status(500).send({ message: "Failed", error });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const body = req.body;
    delete body["id"];
    const data = await getInstance(req, res);
    await data.update({ ...body });
    res.json({ message: "Updated successfully", data });
  } catch (error) {
    console.log("Error occured while deleting: ", error);
    res.status(500).send({ message: "Failed", error });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await getInstance(req, res);
    transaction.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("Error occured while deleting: ", error);
    res.status(500).send({ message: "Failed", error });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
};
