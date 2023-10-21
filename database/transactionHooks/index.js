const Product = require("../../models/Product");

const createProduct = async (transaction) => {
  await Product.create({
    productName: transaction.productName,
    purchasePrice: transaction.purchasePrice,
    createdBy: transaction.createdBy,
  });
};

const createOrUpdateProducts = async (transaction) => {
  try {
    const product = await Product.findOne({
      where: { productName: transaction.productName },
    });
    if (!product) createProduct(transaction);
    else if (product.purchasePrice !== transaction.purchasePrice)
      product.update({ purchasePrice: transaction.purchasePrice });
  } catch (error) {
    console.log("Transaction Hook Error: ", error);
  }
};

module.exports = createOrUpdateProducts;
