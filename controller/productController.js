const sequelize = require('../database')
const Product = require('../models/Product')
const Transaction = require('../models/Transaction')
const { Op } = require('sequelize')
const getFilterDataFromRequest = require('../helpers/getFilterDataFromRequest')

const getMyProducts = async (req, res, next) => {
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
        [Op.lte]: endTime,
      },
      createdBy: req.user.id,
    },
    order: [['updatedAt', 'DESC']],
  })
  res.json({
    message: 'Results fetched successfully',
    data: rows,
    count,
    startTime,
    endTime,
  })
}

const getProductsViaSearch = async (req, res, next) => {
  try {
    const { startTime, endTime, offset, limit } = getFilterDataFromRequest(
      req,
      res,
      'year'
    )
    let { searchText } = req.query
    if (!searchText || typeof searchText !== 'string' || searchText.length <= 2)
      return res.status(400).json({
        message:
          "Please pass a text string and it's length should be atleast 3 characters",
      })
    console.log('To LowerCase: ', searchText, searchText.toLowerCase())
    const data = await Product.findAll({
      offset,
      limit,
      where: {
        createdBy: req.user.id,
        productName: {
          [Op.iLike]: '%' + searchText + '%',
        },
        updatedAt: {
          [Op.gte]: startTime,
          [Op.lte]: endTime,
        },
      },
      order: [['updatedAt', 'DESC']],
    })
    res.json({
      message: 'Results fetched successfully',
      data,
    })
  } catch (error) {
    console.log('Error while searching: ', error)
    res.status(500).json({
      message: 'Something went wrong',
      error,
    })
  }
}

const createProduct = async (req, res, next) => {
  try {
    const { productName, purchasePrice } = req.body
    const prevProduct = await Product.findOne({
      where: { productName },
    })
    if (prevProduct)
      return res.status(400).json({
        message: `Already a product logged with this name having purchasePrice of ${prevProduct.purchasePrice}`,
        fieldName: 'productName',
      })
    const data = await Product.create({
      productName,
      purchasePrice,
      createdBy: req.user.id,
    })
    res.json({ message: 'created Successfuly', data })
  } catch (error) {
    console.log('error occured: ', error)
    res.status(500).send({ message: 'Failed', error })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { purchasePrice } = req.body
    const productID = req.params.id
    const data = await Product.findByPk(productID)
    await data.update({ purchasePrice })
    res.json({ message: 'Updated successfully', data })
  } catch (error) {
    console.log('Error occured while deleting: ', error)
    res.status(500).send({ message: 'Failed', error })
  }
}

const productDetail = async (req, res) => {
  try {
    const productID = req.params.id
    const product = await Product.findByPk(productID)
    let totalProfit = await Transaction.findAll({
      where: {
        productName: product.productName,
        createdBy: req.user.id,
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('profit')), 'totalProfit'],
      ],
    })
    const count = await Transaction.count({
      where: {
        productName: product.productName,
        createdBy: req.user.id,
      },
      order: ['createdAt', 'DESC'],
    })
    res.json({
      message: 'fetched successfully',
      data: {
        ...product.dataValues,
        totalProfit: totalProfit[0].dataValues.totalProfit,
        count,
      },
    })
  } catch (error) {
    console.log('Error occured while updating: ', error)
    res.status(500).send({ message: 'Failed', error })
  }
}

module.exports = {
  getMyProducts,
  getProductsViaSearch,
  createProduct,
  updateProduct,
  productDetail,
}
