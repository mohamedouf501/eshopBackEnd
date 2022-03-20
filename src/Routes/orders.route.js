const router = require ('express').Router()
const orderController = require('../Controllers/order.controller')

router.get('/', orderController.GetAllOrders)
router.get('/:id', orderController.GetOrder)
router.get('/get/totalSales', orderController.GetTotalSales)
router.get('/get/OrderCount', orderController.GetOrderCount)
router.get('/get/UserOrder/:userId', orderController.GetUserOrder)

router.post('/', orderController.AddOrders)
router.put('/:id', orderController.updateOrder)
router.delete('/:id', orderController.DeleteOrder)



module.exports = router