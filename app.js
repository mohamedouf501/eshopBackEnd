require('dotenv').config;
const  express = require('express')
const app = express()
const port = 5000
const morgan = require('morgan')
const api = process.env.API
// app.use(express.urlencoded({ extended: true }));
app.use(express.json)
// app.use(morgan('tiny'))
app.get('/', (req, res) => res.send('Hello World!'))
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
