const  {Product}  = require("../Models/product.model");
const AppError = require("../utility/appError");
const catchAsync = require ('../utility/catchAsync.js')
exports.GetAllProducts = catchAsync(  async (req , res , next)=>{

    const Products =  await Product.find({})
    if(!Products) next (new AppError (' not found Products ' , 404))
    res.status(200).json({message:'sucssec' ,Products:Products})

})