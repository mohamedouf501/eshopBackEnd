const router = require ('express').Router()
const productController = require('../Controllers/product.controller')
router.get('/', productController.GetAllProducts)



module.exports = router