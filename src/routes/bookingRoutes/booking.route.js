const express = require('express')
const authMiddleware = require('../../middlewares/authMiddleware')
const bookingController = require('../../controllers/bookingControllers/booking.controller')

const router = express.Router()

router.post('/create', authMiddleware, bookingController.createBookingController)   


module.exports = router