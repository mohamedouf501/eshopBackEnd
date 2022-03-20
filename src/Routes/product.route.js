const router = require ('express').Router()
const productController = require('../Controllers/product.controller')
router.get('/', productController.GetAllProducts)
router.get('/:id', productController.GetProduct)
router.get('/get/count/', productController.GetCount)
router.get('/get/featured/:count', productController.GetFeatured)

router.post('/', productController.AddProduct)
router.put('/:id', productController.updateproduct)
router.delete('/:id', productController.Deleteproduct)

module.exports = router