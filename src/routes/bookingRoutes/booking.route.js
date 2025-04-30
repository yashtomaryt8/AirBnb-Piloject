const express = require('express')
const authMiddleware = require('../../middlewares/authMiddleware')
const bookingController = require('../../controllers/bookingControllers/booking.controller')
const passport = require('../../config/passport/passport')

const router = express.Router()

router.post('/create', authMiddleware, bookingController.createBookingController)   

router.get('/user-bookings/:userId', authMiddleware, bookingController.viewBookingController)

module.exports = router