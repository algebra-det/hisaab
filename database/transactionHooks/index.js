const Product = require('../../models/Product')

const createProduct = async transaction => {
  await Product.create({
    productName: transaction.productName,
    purchasePrice: transaction.purchasePrice,
    lastSellingPrice: transaction.sellingPrice,
    totalSale: 1,
    createdBy: transaction.createdBy,
  })
}

const createOrUpdateProducts = async transaction => {
  try {
    const product = await Product.findOne({
      where: { productName: transaction.productName },
    })
    if (!product) createProduct(transaction)
    else {
      product.update({
        purchasePrice: transaction.purchasePrice,
        lastSellingPrice: transaction.sellingPrice,
        totalSale: product.totalSale ? product.totalSale + 1 : 1,
      })
      await product.save()
    }
  } catch (error) {
    console.log('Transaction Hook Error: ', error)
  }
}

module.exports = createOrUpdateProducts
