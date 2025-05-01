const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const session = require('express-session')
const passport = require('./config/passport/passport')

const userRoutes = require('./routes/userRoutes/user.routes')
const propertyRoutes = require('./routes/propertyRoutes/property.route')
const bookingRoutes = require('./routes/bookingRoutes/booking.route')
const paymentRoutes = require('./routes/paymentRoutes/payment.route')

const errorHandler = require('./middlewares/errorHandler')  

// middleware to parse json data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny')) // logging middleware
app.use(cookieParser());
// Session Setup
app.use(session({ secret: process.env.SESSION_SECRET || 'your-secret-key', resave: false, saveUninitialized: false,}));
// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req,res) => {
    res.send('Hello World!')
})

app.use('/api/auth', userRoutes)
app.use('/api/property', propertyRoutes)
app.use('/api/booking', bookingRoutes)
app.use('/api/payment', paymentRoutes)

app.use(errorHandler) // error handling middleware

module.exports = app