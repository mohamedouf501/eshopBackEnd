const { Category } = require("../Models/categories.model");
const { Product } = require("../Models/product.model");
const AppError = require("../utility/appError");
const catchAsync = require('../utility/catchAsync.js');
const APIFeatures = require("../utility/APIfeatures");


exports.GetAllProducts = catchAsync(async (req, res, next) => {
    const Features = new APIFeatures(Product.find({}), req.query).filter()
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
    const file = req.file
    if (!file) return next(new AppError('No Image in the Request  ', 400))
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
    console.log(fileName)
    const product = await Product.create({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
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

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid Product!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }

    const Updateproduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagepath,
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
    if (!Updateproduct) {
        return next(new AppError(`Not found product have this is id ${req.params.id} `, 404))
    }
    res.status(200).json({ message: 'updeted', Updateproduct: product })
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

exports.GalleryImages = catchAsync(async (req, res, next) => {
    const files = req.files
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

    let imagesPaths = []
    if (files) {
        files.map(file => {
            imagesPaths.push(`${basePath}${file.filename}`);        })
    }
    else{
        return  next( new AppError('No Image in the Request',500))
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        {
            new: true
        })
    if (!product) {
        return next(new AppError(`Not found product have this is id ${req.params.id} `, 404))
    }
    res.status(200).json({ message: 'updeted', product: product })
})
