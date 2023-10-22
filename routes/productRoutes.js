const router = require("express").Router();
const productController = require("../controller/productController");

router.get("/", productController.getMyProducts);
router.get("/search", productController.getProductsViaSearch);

module.exports = router;
