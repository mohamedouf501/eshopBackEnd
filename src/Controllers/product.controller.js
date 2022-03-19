const  {Product}  = require("../Models/product.model");
const AppError = require("../utility/appError");
exports.GetAllProducts =  async (req , res , next)=>{

    const Products =  await Product.find({})
    res.json({Products})

}