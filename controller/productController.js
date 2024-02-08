const sequelize = require('../database')
const Product = require('../models/Product')
const Transaction = require('../models/Transaction')
const { Op } = require('sequelize')
const { getFilterDataFromRequest } = require('../helpers')
const { asyncHandler, ErrorResponse, ApiResponse } = require('../utils')

const getMyProducts = asyncHandler(async (req, res, _next) => {
  const { startTime, endTime, offset, limit } = getFilterDataFromRequest(
    req,
    res,
    'month'
  )
  const { count, rows } = await Product.findAndCountAll({
    offset,
    limit,
    where: {
      updatedAt: {
        [Op.gte]: startTime,
        [Op.lte]: endTime
      },
      createdBy: req.user.id
    },
    order: [['updatedAt', 'DESC']]
  })
  const data = { rows, count, startTime, endTime }
  res.json(new ApiResponse(data, 'Results fetched successfully'))
})

const getProductsViaSearch = asyncHandler(async (req, res, _next) => {
  const { startTime, endTime, offset, limit } = getFilterDataFromRequest(
    req,
    res,
    'year'
  )
  let { searchText, dateRange } = req.query
  if (!searchText || typeof searchText !== 'string' || searchText.length <= 2)
    throw new ErrorResponse(
      400,
      "Please pass a text string and it's length should be atleast 3 characters"
    )
  console.log('To LowerCase: ', searchText, searchText.toLowerCase())
  const whereClauseOptions = {
    createdBy: req.user.id,
    productName: {
      [Op.iLike]: '%' + searchText + '%'
    }
  }
  if (dateRange)
    whereClauseOptions.updatedAt = {
      [Op.gte]: startTime,
      [Op.lte]: endTime
    }
  const data = await Product.findAll({
    offset,
    limit,
    where: {
      ...whereClauseOptions
    },
    order: [['updatedAt', 'DESC']]
  })
  res.json(new ApiResponse(data, 'Results fetched successfully'))
})

const createProduct = asyncHandler(async (req, res, _next) => {
  const { productName, purchasePrice } = req.body
  if (!productName || !purchasePrice)
    throw new ErrorResponse(400, 'productName and purchasePrice are required')
  const prevProduct = await Product.findOne({
    where: { productName }
  })
  if (prevProduct)
    throw new ErrorResponse(
      400,
      `Already a product logged with this name having purchasePrice of ${prevProduct.purchasePrice}`,
      { fieldName: 'productName' }
    )
  const data = await Product.create({
    productName,
    purchasePrice,
    createdBy: req.user.id
  })
  res.json(new ApiResponse(data, 'created Successfuly'))
})

const updateProduct = asyncHandler(async (req, res) => {
  const { purchasePrice } = req.body
  const productID = req.params.id
  const data = await Product.findByPk(productID)
  await data.update({ purchasePrice })
  res.json(new ApiResponse(data, 'Updated successfully'))
})

const productDetail = asyncHandler(async (req, res) => {
  const productID = req.params.id

  const product = await Product.findByPk(productID)
  let [totalProfit, count] = await Promise.all([
    Transaction.findAll({
      where: {
        productName: product.productName,
        createdBy: req.user.id
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('profit')), 'totalProfit']
      ]
    }),
    Transaction.count({
      where: {
        productName: product.productName,
        createdBy: req.user.id
      },
      order: ['createdAt', 'DESC']
    })
  ])
  const data = {
    ...product.dataValues,
    totalProfit: totalProfit[0].dataValues.totalProfit,
    count
  }
  res.json(new ApiResponse(data, 'fetched successfully'))
})

module.exports = {
  getMyProducts,
  getProductsViaSearch,
  createProduct,
  updateProduct,
  productDetail
}
