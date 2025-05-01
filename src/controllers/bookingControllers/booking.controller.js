const Booking = require('../../models/bookingModels/booking.model')
const Property = require('../../models/propertyModels/property.model')
const { paymentInstance } = require('../../services/payment.services')
const CustomError = require('../../utils/customError')
const sendEmail = require('../../utils/email')
const { bookingConfirmationTemplate } = require('../../utils/emailTemplate')


const createBookingController = async (req, res, next) => {
    
    const { propertyId, checkInDate, checkOutDate, totalPrice } = req.body;
    if (!propertyId || !checkInDate || !checkOutDate || !totalPrice) {
      return next(new CustomError('All fields are required', 400));
    }
  
    // 1. Check property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return next(new CustomError('Property not found', 404));
    }
  
    const userId = req.user._id;
    try {
      // 2. Create booking placeholder
      const booking = await Booking.create({
        propertyId,
        userId,
        checkInDate,
        checkOutDate,
        totalPrice,
        status: 'pending'
      });
  
      // 3. Create Razorpay order
      const razorpayOrder = await paymentInstance.orders.create({
        amount: totalPrice * 100,
        currency: 'INR',
        receipt: `receipt_${booking._id}`,
        notes: { propertyId, userId, bookingId: booking._id },
        payment_capture: 1
      });
  
      // 4. Atomically update booking with razorpay info
      await Booking.findByIdAndUpdate(
        booking._id,
        {
          razorpayOrderId: razorpayOrder.id,
          paymentDetails: {
            order_id: razorpayOrder.id,
            payment_id: null,
            signature: null
          }
        },
        { new: true }
      );
  
      // 5. Send response immediately
      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        amount: totalPrice,
        data: booking
      });
  
      // 6. Fire-and-forget the email (don’t await)
      const html = bookingConfirmationTemplate(
        req.user.username,
        property.location,
        checkInDate,
        checkOutDate,
        razorpayOrder
      );
      
      sendEmail(
        "yashtomar.yt8@gmail.com",  // req.user.email, // Uncomment this line to send email to the user
        'Booking Confirmation',
        'Your booking is confirmed!',
        html
      ).catch(err => console.error('📧 Email failed:', err.message));
  
    } catch (err) {
      next(new CustomError(err.message, 500));
    }
}
  

const viewBookingController = async (req, res, next) => {
    const { userId } = req.params

    try{
        if (!userId) {
            return next(new CustomError('User ID is required', 400))
        }

        const bookings = await Booking.findOne({ userId }).populate('userId', 'username email').populate('propertyId', 'title location price')
        if (!bookings) {
            return next(new CustomError('No bookings found for this user', 404))
        }

        res.status(200).json({
            success: true,
            message: 'Bookings retrieved successfully',
            data: bookings
        })
    } catch (error) {
        next(new CustomError(error.message, 500))
    }
}

const cancelBookingController = async (req, res, next) => {
    try{
        const { userId } = req.params
        
        if (!userId) {
            return next(new CustomError('Booking ID is required', 400))
        }
        const booking = await Booking.findById(id)
        if(!booking) {
            return next(new CustomError('Booking not found', 404))
        }

        if(booking.userId.toString() !== req.user._id.toString()) {
            return next(new CustomError('You are not authorized to cancel this booking', 403))
        }

        booking.status = 'cancelled'
        await booking.save()

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        })
    }
    catch (error) {
        next(new CustomError(error.message, 500))
    }
}


module.exports = {
    createBookingController,
    viewBookingController,
    cancelBookingController
}