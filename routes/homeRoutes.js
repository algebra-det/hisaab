const router = require('express').Router()
const homeController = require('../controller/homeController')

router.get('/', homeController.indexController)

module.exports = router
