const User = require('../../models/userModels/user.model')
const Property = require('../../models/propertyModels/property.model')
const Booking = require('../../models/bookingModels/booking.model')
const customError = require('../../utils/customError')  


const getAllUsersController = async (req, res, next) => {
    try{
        const allUser = await User.find()
        res.status(200).json({
            success: true,
            message: 'All users fetched successfully',
            data : allUser
        })
    }catch(err) {
        next(new customError(err.message, 500))
    }
}

const deleteUserController = async (req, res, next) => {
    try{
        const { id } = req.params
        const allUser = await User.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data : allUser
        })
    }
    catch(err) {
        next(new customError(err.message, 500))
    }
}

const getAllBookingsController = async (req, res, next) => {
    try{
        const allBookings = await Booking.find()
        res.status(200).json({
            success: true,
            message: 'All bookings fetched successfully',
            data : allBookings
        })
    }
    catch(err) {
        next(new customError(err.message, 500))
    }
}

const deleteBookingController = async (req, res, next) => {
    try{
        const { id } = req.params
        const delBook = await Booking.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully',
            data : delBook
        })
    }
    catch(err) {
        next(new customError(err.message, 500))
    }
}

const getAllPropertyController = async (req, res, next) => {
    try{
        const allProperties = await Property.find()
        res.status(200).json({
            success: true,
            message: 'All properties fetched successfully',
            data : allProperties
        })
    }
    catch(err) {
        next(new customError(err.message, 500))
    }
}

const deletePropertyController = async (req, res, next) => {
    try{
        const { id } = req.params
        const delProperty = await Property.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'Property deleted successfully',
            data : delProperty
        })
    }
    catch(err) {
        next(new customError(err.message, 500))
    }
}

module.exports = {
    getAllUsersController,
    deleteUserController,
    getAllBookingsController,
    deleteBookingController,
    getAllPropertyController,
    deletePropertyController
}





