const express = require('express')
const authMiddleware = require('../../middlewares/authMiddleware')
const propertyController = require('../../controllers/propertyControllers/property.controller')

const router = express.Router()

router.post('/create', authMiddleware, propertyController.propertyCreateController)
router.get('/read/:id', authMiddleware, propertyController.propertyReadController)
router.put('/update/:id', authMiddleware, propertyController.propertyUpdateController)
router.delete('/delete/:id', authMiddleware, propertyController.propertyDeleteController)
router.get('/', authMiddleware, propertyController.propertyListController)


module.exports = router