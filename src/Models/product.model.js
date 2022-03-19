const mongoose = require ('mongoose')
const productSchema = mongoose.Schema({
    name:String,
    image:String,
    CountInStock:{
        type:Number,
    required:true 
   }


})

exports.Product = mongoose.model('product' , productSchema)