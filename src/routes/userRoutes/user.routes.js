const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userControllers/user.controller')
const authMiddleware = require('../../middlewares/authMiddleware')

router.post('/register', userController.registerController)
router.post('/login', userController.loginController)
router.get('/logout', userController.logoutController)
router.get('/currentUser', authMiddleware, userController.currentUserController)

module.exports = router