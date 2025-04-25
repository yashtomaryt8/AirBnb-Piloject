const Booking = require('../../models/bookingModels/booking.model')
const Property = require('../../models/propertyModels/property.model')
const { paymentInstance } = require('../../services/payment.services')
const CustomError = require('../../utils/customError')

const createBookingController = async (req, res, next) => {
    const { propertyId, checkInDate, checkOutDate, totalPrice } = req.body

    const property = await Property.findById(propertyId)
    if (!property) {
        return next(new CustomError('Property not found', 404))
    }

    if (!propertyId || !checkInDate || !checkOutDate || !totalPrice) {
        return next(new CustomError('All fields are required', 400))
    }

    const userId = req.user._id

    try {
        const booking = await Booking.create({
            propertyId,
            userId,
            checkInDate,
            checkOutDate,
            totalPrice,
            status: 'pending'
        })

        const options = {
            amount: totalPrice * 100, // amount in the smallest currency unit
            currency: 'INR',
            receipt: `receipt_${booking._id}`,
            notes: {
                propertyId,
                userId,
                bookingId: booking._id
            },
            payment_capture: 1 // auto capture
        }

        const razorpayOrder = await paymentInstance.orders.create(options)

        booking.razorpayOrderId = razorpayOrder.id
        booking.paymentDetails = {
            order_id: razorpayOrder.id,
            payment_id: null,
            signature: null
        }

        await booking.save()

        // email

        if (!booking) {
            return next(new CustomError('Booking not created', 400))
        }

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        })
    } catch (error) {
        next(new CustomError(error.message, 500))
    }
}

module.exports = {
    createBookingController
}