const router = require ('express').Router()
const categoriesController = require('../Controllers/categories.controller')
router.get('/', categoriesController.GetAllCategories)
router.get('/:id', categoriesController.GetCategoryByID)
router.post('/', categoriesController.AddCategory)
router.put('/:id', categoriesController.updateCategory)
router.delete('/:id', categoriesController.DeleteCategory)

module.exports = router