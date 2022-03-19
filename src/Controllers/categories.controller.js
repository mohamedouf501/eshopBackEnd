const { Category } = require("../Models/categories.model");
const catchAsync = require('../utility/catchAsync.js')
const AppError = require('../utility/appError')

exports.GetAllCategories = catchAsync(async (req, res, next) => {

    const categories = await Category.find({})
    if (!categories) return next(new AppError('not Found Any categories', 404))
    res.status(200).json({ message: 'sucsses', categories: categories })
})
exports.GetCategoryByID = catchAsync(async (req, res, next) => {

    const category = await Category.findById(req.params.id)
    if (category == null) return next(new AppError(`not Found  category  ${req.params.id}`, 404))
    res.status(200).json({ message: 'sucsses', category: category })
})

exports.AddCategory = catchAsync(async (req, res, next) => {
    const NewCategory = await Category.create({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    await NewCategory.save()
    if (!NewCategory) {
        return next(new AppError('the category cannot be created !', 500))
    }
    res.status(200).json({ message: 'sucsses', Category: NewCategory })

})

exports.updateCategory = catchAsync(async (req, res, next) => {

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        })
    if (category == null) {
        return next(new AppError(`not found Category have this is id ${req.params.id} `, 404))
    }
    res.status(200).json({ message: 'deleted', category: 'updeted' })
})
exports.DeleteCategory = catchAsync(async (req, res, next) => {

    const category = await Category.findByIdAndDelete(req.params.id)
    console.log(category)
    if (category == null) {
        return next(new AppError(`not found Category have this is id ${req.params.id} `, 404))
    }
    res.status(200).json({ message: 'sucsses', category: null })
})