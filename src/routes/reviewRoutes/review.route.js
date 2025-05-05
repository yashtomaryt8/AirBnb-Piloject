const express = require('express')
const authMiddleware = require('../../middlewares/authMiddleware')
const reviewController = require('../../controllers/reviewControllers/review.controller')

const router = express.Router()

router.post('/create', authMiddleware, reviewController.createReviewController)

router.delete('/delete/:id', authMiddleware, reviewController.deleteReviewController)

router.put('/update/:id', authMiddleware, reviewController.updateReviewController)

router.get('/view/:id', authMiddleware, reviewController.viewReviewController)

module.exports = router