const router = require('express').Router()
const productController = require('../controller/productController')

router.get('/', productController.getMyProducts)
router.post('/', productController.createProduct)
router.put('/:id', productController.updateProduct)
router.get('/:id', productController.productDetail)
router.get('/search', productController.getProductsViaSearch)

module.exports = router
