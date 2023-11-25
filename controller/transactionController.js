const Transaction = require('../models/Transaction')
const { Op } = require('sequelize')
const sequelize = require('../database')
const getFilterDataFromRequest = require('../helpers/getFilterDataFromRequest')

const getInstance = async (req, res) => {
  const transactionId = req.params.id
  if (!transactionId)
    return res.status(400).json({
      message: 'Transaction ID is required'
    })
  const transaction = await Transaction.findByPk(transactionId)
  if (!transaction)
    return res.status(400).json({
      message: 'No transaction found.'
    })
  if (transaction.createdBy !== req.user.id)
    return res.status(400).json({
      message: 'Not authorized to update such transactions'
    })
  return transaction
}

const getTransactions = async (req, res, next) => {
  try {
    const { startTime, endTime, ordering, offset, limit } =
      getFilterDataFromRequest(req, res)
    let totalProfit = await Transaction.findAll({
      where: {
        createdAt: {
          [Op.gte]: startTime,
          [Op.lte]: endTime
        },
        createdBy: req.user.id
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('profit')), 'totalProfit']
      ]
    })
    const { count, rows } = await Transaction.findAndCountAll({
      limit,
      offset,
      where: {
        createdAt: {
          [Op.gte]: startTime,
          [Op.lte]: endTime
        },
        createdBy: req.user.id
      },
      order: [ordering]
    })
    return res.json({
      message: 'Fetched Successfuly',
      data: rows,
      totalProfit: totalProfit[0].dataValues.totalProfit,
      count,
      startTime,
      endTime
    })
  } catch (error) {
    console.log('Error while fetching transactions: ', error)
    return res.status(400).json({
      message: 'Something went wrong',
      error
    })
  }
}

const transactionStats = async (req, res) => {
  try {
    const { startTime, endTime, offset, limit } = getFilterDataFromRequest(
      req,
      res
    )
    let totalProfit = await Transaction.findAll({
      limit,
      offset,
      where: {
        createdAt: {
          [Op.gte]: startTime,
          [Op.lte]: endTime
        },
        createdBy: req.user.id
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('profit')), 'totalProfit']
      ]
    })
    res.json({
      message: 'Fetched Successfuly',
      totalProfit: totalProfit[0].dataValues.totalProfit,
      startTime,
      endTime
    })
  } catch (error) {
    console.log('stats error: ', error)
    res.status(400).json({
      message: 'Something went wrong',
      error
    })
  }
}

const createTransaction = async (req, res, next) => {
  try {
    const { productName, purchasePrice, sellingPrice } = req.body
    const data = await Transaction.create({
      productName,
      purchasePrice,
      sellingPrice,
      createdBy: req.user.id
    })
    res.json({ message: 'created Successfuly', data })
  } catch (error) {
    console.log('error occured: ', error)
    res.status(500).send({ message: 'Failed', error })
  }
}

const updateTransaction = async (req, res) => {
  try {
    const body = req.body
    delete body['id']
    const data = await getInstance(req, res)
    await data.update({ ...body })
    res.json({ message: 'Updated successfully', data })
  } catch (error) {
    console.log('Error occured while deleting: ', error)
    res.status(500).send({ message: 'Failed', error })
  }
}

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await getInstance(req, res)
    transaction.destroy()
    res.json({ message: 'Deleted successfully' })
  } catch (error) {
    console.log('Error occured while deleting: ', error)
    res.status(500).send({ message: 'Failed', error })
  }
}

module.exports = {
  getTransactions,
  transactionStats,
  createTransaction,
  deleteTransaction,
  updateTransaction
}
