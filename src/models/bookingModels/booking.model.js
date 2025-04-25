const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Property', 
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User', 
        required: true,
    },
    checkInDate: {
        type: String,
        required: true,
    },
    checkOutDate: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
    razorpayOrderId: {
        type: String,
        required: false,
    },
    paymentDetails: {
        payment_id : {
            type: String,
            required: false,
        },
        order_id : {
            type: String,
            required: false,
        },
        signature : {
            type: String,
            required: false,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    
}, {
    timestamps: true,
})

module.exports = mongoose.model('Booking', bookingSchema)