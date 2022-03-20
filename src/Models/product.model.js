const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image:
    {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    barnd: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviwes: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
})

productSchema.virtual('id').get(function (){
    return this._id.toHexString()
})
productSchema.set('toJSON' , {
    virtuals:true
})
exports.Product = mongoose.model('product', productSchema)