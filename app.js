const express = require('express')
const app = express()
const globalErrorHandler = require("./src/Controllers/errorController")
const AppError = require("./src/utility/appError");
const morgan = require('morgan')
const cors = require('cors')
const productRouter = require('./src/Routes/product.route');




app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())



app.use('/product', productRouter)
app.get('/', (req, res) => { res.json({ message: 'it is work ' }) })
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`));
});
app.use(globalErrorHandler);


module.exports = app;
