const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const userRoutes = require('./routes/userRoutes/user.routes')
const errorHandler = require('./middlewares/errorHandler')  

// middleware to parse json data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny')) // logging middleware
app.use(cookieParser());

app.get('/', (req,res) => {
    res.send('Hello World!')
})

app.use('/api/auth', userRoutes)

app.use(errorHandler) // error handling middleware

module.exports = app