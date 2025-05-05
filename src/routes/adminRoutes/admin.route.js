const express = require('express')
const adminMiddleware = require('../../middlewares/adminMiddleware')

const {
    getAllUsersController,
    deleteUserController,
    getAllBookingsController,
    deleteBookingController,
    getAllPropertyController,
    deletePropertyController,
} = require('../../controllers/adminControllers/admin.controller')

const router = express.Router()

router.get('/all-users', adminMiddleware, getAllUsersController)    // make sure isAdmin is true in the database
router.delete('/delete-user/:id', adminMiddleware, deleteUserController) 
router.get('/all-bookings', adminMiddleware, getAllBookingsController)
router.delete('/delete-booking/:id', adminMiddleware, deleteBookingController)
router.get('/all-properties', adminMiddleware, getAllPropertyController)
router.delete('/delete-property/:id', adminMiddleware, deletePropertyController)

module.exports = router