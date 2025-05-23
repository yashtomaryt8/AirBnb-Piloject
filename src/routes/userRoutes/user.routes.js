const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userControllers/user.controller')
const authMiddleware = require('../../middlewares/authMiddleware')

router.post('/register', userController.registerController)
router.post('/login', userController.loginController)
router.get('/logout', userController.logoutController)
router.get('/currentUser', authMiddleware, userController.currentUserController)
router.put('/update-profile', authMiddleware, userController.updateUserProfile)
router.post('/forgot-password', userController.resetPasswordController)

module.exports = router