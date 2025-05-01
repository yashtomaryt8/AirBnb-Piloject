const express = require('express')
const paymentController = require('../../controllers/paymentControllers/payment.controller')
const authMiddleware = require('../../middlewares/authMiddleware')

const router = express.Router()

router.post('/payment-process', authMiddleware, paymentController.processPaymentController)

router.post('/payment-verify', authMiddleware, paymentController.verifyPaymentController)

module.exports = router