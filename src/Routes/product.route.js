const router = require ('express').Router()
const productController = require('../Controllers/product.controller')
const uploadOptions = require('../utility/upload.multer')
router.get('/', productController.GetAllProducts)
router.get('/:id', productController.GetProduct)
router.get('/get/count/', productController.GetCount)
router.get('/get/featured/:count', productController.GetFeatured)

router.post('/',uploadOptions.single('image') ,productController.AddProduct)
router.put('/:id', productController.updateproduct)
router.put('/GalleryImages/:id', uploadOptions.array('images', 10), productController.GalleryImages)

router.delete('/:id', productController.Deleteproduct)

module.exports = router