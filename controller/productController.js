const Product = require('../models/Product')
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
      createdAt: {
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
  })
}

const getProductsViaSearch = async (req, res, next) => {
  let { searchText, limit, offset } = req.query
  if (!offset) offset = 0
  if (!limit) limit = 10
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
    },
    order: [['updatedAt', 'DESC']],
  })
  res.json({
    message: 'Results fetched successfully',
    data,
  })
}

const createProduct = async (req, res, next) => {
  try {
    const { productName, purchasePrice } = req.body
    const prevProduct = await Product.findOne({
      where: { productName },
    })
    if (prevProduct)
      return res.status(400).json({
        message: `Already a product with this name having purchasePrice of ${prevProduct.purchasePrice}`,
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

module.exports = {
  getMyProducts,
  getProductsViaSearch,
  createProduct,
  updateProduct,
}
