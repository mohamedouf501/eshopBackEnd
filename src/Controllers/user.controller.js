const { User } = require("../Models/user.model");
const AppError = require("../utility/appError");
const catchAsync = require('../utility/catchAsync.js');
const APIFeatures = require("../utility/APIfeatures");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.GetAllUsers = catchAsync(async (req, res, next) => {
    const Features = new APIFeatures(User.find({}).select('-passwordHash'), req.query).filter()
    const users = await Features.query

    if (!users) next(new AppError(' not found users ', 404))
    res.status(200).json({ message: 'sucssec', users: users })
})
exports.Getuser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-passwordHash')
    if (!user) return next(new AppError(`Not Found user have ID ${req.params.id} `, 404))
    res.status(200).json({ message: 'sucssec', user: user })
})
exports.Adduser = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    await user.save();
    if (!user) {
        return next(new AppError('the users cannot be created !', 500))
    }
    res.status(200).json({ message: 'sucsses', user: user })
})

exports.updateproduct = catchAsync(async (req, res, next) => {
    const userExist = await User.findById(req.params.id)
    let newPassword;
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    }
    else {
        newPassword = userExist.passwordHash
    }
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        {
            new: true
        })
    if (user == null) {
        return next(new AppError(`Not found user have this is id ${req.params.id} `, 404))
    }
    res.status(200).json({ message: 'updeted', user: user })
})

exports.LogIn = catchAsync(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(new AppError('the user is not found', 404))
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
            userID: user.id,
            isAdmin: user.isAdmin
        }, process.env.SECRET_KEY, { expiresIn: '1d' })
        res.status(200).json({ message: "sucsses", token: token })
    }
    else {
        next(new AppError('Invaled password ', 500))
    }
})
exports.GetCount = catchAsync(async (req, res, next) => {
    const UserCount = await User.countDocuments()
    if (!UserCount) {
        return next(new AppError(`Not found product`, 404))
    }
    res.status(200).json({ message: 'sucsses ', UserCount: UserCount })
})