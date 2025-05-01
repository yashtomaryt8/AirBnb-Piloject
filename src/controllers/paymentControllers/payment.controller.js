const Booking = require('../../models/bookingModels/booking.model')
const { paymentInstance } = require('../../services/payment.services')
const customError = require('../../utils/customError')
const crypto = require('crypto')
const { paymentConfirmationTemplate } = require('../../utils/emailTemplate')
const sendEmail = require('../../utils/email')

const processPaymentController = async (req, res, next) => {
    try{
        const { amount, currency } = req.body

        if(!amount || !currency) {
            return next(new customError('Amount and currency are required', 400))
        }
    
        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: currency,
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1 // auto capture
        }

        const razorpayOrder = await paymentInstance.orders.create(options)

        if(!razorpayOrder) {
            return next(new customError('Payment failed', 500))
        }

        res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            receipt: razorpayOrder.receipt,
            notes: razorpayOrder.notes
        })
    }
    catch (error) {
        console.error('Error processing payment:', error)
        return next(new customError('Payment failed', 500))
    }
}

const verifyPaymentController = async (req, res, next) => {
    try{
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body

        if(!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return next(new customError('All fields are required', 400))
        }

        const booking = await Booking.findOne({ razorpayOrderId : razorpayOrderId }).populate('userId', 'username email').populate('propertyId', 'location')    

        if(!booking) {
            return next(new customError('Booking not found', 404))
        }

        const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex')

            console.log('Generated Signature:', generatedSignature)

        if(generatedSignature !== razorpaySignature) {
            return next(new customError('Payment verification failed', 400))
        }

        booking.status = 'completed'
        booking.paymentDetails = {
            payment_id: razorpayPaymentId,
            order_id: razorpayOrderId,
            signature: razorpaySignature
        }

        await booking.save()


        // email

        const emailTemplate = paymentConfirmationTemplate(
            req.user.username,
            booking.propertyId.location,
            booking.status,
            booking.totalPrice,
            booking.checkInDate,
            booking.checkOutDate,
            razorpayOrderId
        )

        await sendEmail(
            "yashtomar.yt8@gmail.com",
            "Booking and Payment Confirmation",
            emailTemplate
        )

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            data: booking
        })
        }
    catch (error) {
        return next(new customError('Payment verification failed', 500))
    }
}

module.exports = {
    processPaymentController,
    verifyPaymentController
} 