const Transaction = require('../models/Transaction')
const { Op } = require('sequelize')
const sequelize = require('../database')
const { getFilterDataFromRequest } = require('../helpers')
const { asyncHandler, ErrorResponse, ApiResponse } = require('../utils')

const getInstance = async (req) => {
  const { id } = req.params
  if (!id) throw new ErrorResponse(400, 'Transaction ID is required')
  const transaction = await Transaction.findByPk(id)
  if (!transaction) throw new ErrorResponse(400, 'No transaction found.')
  if (transaction.createdBy !== req.user.id)
    throw new ErrorResponse(400, 'Not authorized to update such transactions')
  return transaction
}

const getTransactions = asyncHandler(async (req, res, _next) => {
  const { startTime, endTime, ordering, offset, limit } =
    getFilterDataFromRequest(req, res)

  const [totalProfit, { rows, count }] = await Promise.all([
    Transaction.findAll({
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
    }),
    Transaction.findAndCountAll({
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
  ])
  const data = {
    rows,
    totalProfit: totalProfit[0].dataValues.totalProfit,
    count,
    startTime,
    endTime
  }
  res.json(new ApiResponse(data, 'Fetched Successfuly'))
})

const transactionStats = asyncHandler(async (req, res) => {
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
    attributes: [[sequelize.fn('SUM', sequelize.col('profit')), 'totalProfit']]
  })
  const data = {
    totalProfit: totalProfit[0].dataValues.totalProfit,
    startTime,
    endTime
  }
  res.json(new ApiResponse(data, 'Fetched Successfuly'))
})

const createTransaction = asyncHandler(async (req, res, _next) => {
  const { productName, purchasePrice, sellingPrice } = req.body
  const data = await Transaction.create({
    productName,
    purchasePrice,
    sellingPrice,
    createdBy: req.user.id
  })
  res.json(new ApiResponse(data, 'created Successfuly'))
})

const updateTransaction = asyncHandler(async (req, res) => {
  const body = req.body
  delete body['id']
  const data = await getInstance(req, res)
  await data.update({ ...body })
  res.json(new ApiResponse(data, 'updated successfully'))
})

const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await getInstance(req, res)
  await transaction.destroy()
  res.status(204).json(new ApiResponse({}, 'Deleted successfully', 204))
})

module.exports = {
  getTransactions,
  transactionStats,
  createTransaction,
  deleteTransaction,
  updateTransaction
}
