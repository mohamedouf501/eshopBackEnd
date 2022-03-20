const { Category } = require("../Models/categories.model");
const { Product } = require("../Models/product.model");
const AppError = require("../utility/appError");
const catchAsync = require('../utility/catchAsync.js');
const APIFeatures = require("../utility/APIfeatures");

exports.GetAllProducts = catchAsync(async (req, res, next) => {
    const Features = new APIFeatures( Product.find({}), req.query).filter()
    const Products = await Features.query

    if (!Products) next(new AppError(' not found Products ', 404))
    res.status(200).json({ message: 'sucssec', Products: Products })
})
exports.GetProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) return next(new AppError(`Not Found Product have ID ${req.params.id} `, 404))
    res.status(200).json({ message: 'sucssec', product: product })
})

exports.AddProduct = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.body.category)
    if (!category) return next(new AppError('Invalid category ', 400))
    const product = await Product.create({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    await product.save();
    if (!product) {
        return next(new AppError('the product cannot be created !', 500))
    }
    res.status(200).json({ message: 'sucsses', product: product })
})
exports.updateproduct = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.body.category)
    if (!category) return next(new AppError('Invalid category ', 400))
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {
            new: true
        })
    if (product == null) {
        return next(new AppError(`Not found product have this is id ${req.params.id} `, 404))
    }
    res.status(200).json({ message: 'updeted', product: product })
})
exports.Deleteproduct = catchAsync(async (req, res, next) => {

    const product = await Product.findByIdAndDelete(req.params.id)
    if (product == null) {
        return next(new AppError(`not found product have this is id ${req.params.id} `, 404))
    }
    res.status(200).json({ message: 'Deleted ', product: null })
})

catchAsync(async (req, res, next) => { })

exports.GetCount = catchAsync(async (req, res, next) => {
    const productCount = await Product.countDocuments()
    if (!productCount) {
        return next(new AppError(`Not found product`, 404))
    }
    res.status(200).json({ message: 'sucsses ', productCount: productCount })
})


exports.GetFeatured = catchAsync(async (req, res, next) => {
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({ isFeatured: true }).limit(+count);
    if (!products) {
        return next(new AppError(`Not found product`, 404))
    }
    res.status(200).json({ message: 'sucsses ', products: products })
})


