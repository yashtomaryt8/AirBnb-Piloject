const Review = require('../../models/reviewModels/review.model')
const Property = require('../../models/propertyModels/property.model')
const Booking = require('../../models/bookingModels/booking.model')
const customError = require('../../utils/customError')

const createReviewController = async (req, res, next) => {
    try {
        const { rating, comment, PropertyId } = req.body
        // console.log(rating, comment, PropertyId)
        if (!rating || !comment || !PropertyId) {
            return next(new customError('All fields are required', 400))
        }
        
        const booking = await Booking.findOne({ userId: req.user._id, propertyId: PropertyId })
        // console.log(req.user._id, PropertyId)
        if (!booking) {
            return next(new customError('You can only review properties you have booked', 400))
        }
        const review = await Review.create({
            userId: req.user._id,
            PropertyId: PropertyId,
            rating: rating,
            comment: comment
        })
        if(!review) {
            return next(new customError('Review creation failed', 500))
        }

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            review: review
        })
    }
    catch (error) {
        console.error('Error creating review:', error)
        return next(new customError('Review creation failed', 500))
    }
}

const deleteReviewController = async (req, res, next) => {
    try{
        const { id } = req.params
        console.log(id)
        if (!id) {
            return next(new customError('Review ID is required', 400))
        }

        const delReview = await Review.findByIdAndDelete(id)

        if (!delReview) {
            return next(new customError('Review not found', 404))
        }

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
            review: delReview
        })
    }
    catch (error) {
        console.error('Error deleting review:', error)
        return next(new customError('Review deletion failed', 500))
    }
}

const updateReviewController = async (req, res, next) => {
    try {
        const { id } = req.params

        if (!id) {
            return next(new customError('Review ID is required', 400))
        }
        
        const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })

        if (!updatedReview) {
            return next(new customError('Review not found', 404))
        }

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            review: updatedReview
        })
    }
    catch (error) {
        console.error('Error updating review:', error)
        return next(new customError('Review update failed', 500))
    }
}

const viewReviewController = async (req, res, next) => {
    try {
        const { id } = req.params

        if (!id) {
            return next(new customError('Review ID is required', 400))
        }

        const viewReview = await Review.findById(id)

        if (!viewReview) {
            return next(new customError('Review not found', 404))
        }

        res.status(200).json({
            success: true,
            message: 'Review retrieved successfully',
            viewReview: viewReview
        })
    }
    catch (error) {
        console.error('Error viewing review:', error)
        return next(new customError('Review view failed', 500))
    }
}


module.exports = {
    createReviewController,
    deleteReviewController,
    updateReviewController,
    viewReviewController
}
    

