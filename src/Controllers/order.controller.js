const AppError = require("../utility/appError");
const catchAsync = require('../utility/catchAsync.js');
const APIFeatures = require("../utility/APIfeatures");
const { Order } = require("../Models/order.mode");
const { OrderItem } = require("../Models/orderitem.model");
const { path } = require("express/lib/application");

exports.GetAllOrders = catchAsync(async (req, res, next) => {
    const Features = new APIFeatures(Order.find({}).populate('user', 'name'), req.query).filter().sort().paginate()
    const Orders = await Features.query

    if (!Orders) next(new AppError(' not found Products ', 404))
    res.status(200).json({ message: 'sucssec', Orders: Orders })
})


exports.GetOrder = catchAsync(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate('user', 'name').populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      })
    if (!order) next(new AppError(' Not Found order ', 404))
    res.status(200).json({ message: 'sucssec', order: order })
})

exports.AddOrders = catchAsync(async (req, res, next) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();
    if (!order)
        return res.status(400).send('the order cannot be created!')
    res.send(order);
})
exports.updateOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status,
        }, {
        new: true
    })
    if (order == null) {
        return next(new AppError(`not found order have this is id ${req.params.id} `, 404))
    }
    res.status(200).json({ message: 'updeted', order: order })
})
exports.DeleteOrder = catchAsync(async (req, res, next) => {
    Order.findByIdAndDelete(req.params.id).then(async order => {
        console.log(order)
        if (order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndDelete(orderItem)
            })
            return res.status(200).json({ message: 'sucsses', order: null })
        }
        else {
            return next(new AppError(`not found order have this is id ${req.params.id} `, 404))
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})


exports.GetTotalSales = catchAsync(async (req, res, next) => {

    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
    ])

    if (!totalSales) return next(new AppError('the order sales cannot be generated'))
    res.status(200).json({ totalSales: totalSales.pop().totalSales })
})

exports.GetOrderCount = catchAsync(async (req, res, next) => {
    const OrderCount = await Order.countDocuments()
    if (!OrderCount) {
        return next(new AppError(`Not found product`, 404))
    }
    res.status(200).json({ message: 'sucsses ', OrderCount: OrderCount })
})

exports.GetUserOrder = catchAsync(async (req, res, next) => {

    const userOrderList = await Order.find({ user: req.params.userId }).populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }
    })
    if (!userOrderList) return next(new AppError(false, 500))
    res.send(userOrderList)

})