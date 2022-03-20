const router = require ('express').Router()
const userController = require('../Controllers/user.controller')

router.get('/', userController.GetAllUsers)
router.get('/:id', userController.Getuser)
router.get('/get/count', userController.GetCount)
router.post('/', userController.Adduser)
router.post('/login', userController.LogIn)
router.post('/register', userController.Adduser)
router.put('/:id', userController.updateproduct)

module.exports = router