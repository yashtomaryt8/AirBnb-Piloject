const jwt = require('jsonwebtoken')
const User = require('../models/userModels/user.model')
const customError = require('../utils/customError')
const cacheClient = require('../services/cache.services')

const adminMiddleware = async (req, res, next) => {
    const { token } = req.cookies

    try {
        if (!token) {
            return next(new customError('You are not logged in', 401))
        }
        const isBlacklisted = await cacheClient.get(token)

        if (isBlacklisted) {
            return next(new customError('You are not logged in', 401))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("decoded ->", decoded)

        const user = await User.findById(decoded.id)

        if (!user) {
            return next(new customError('User not found', 404))
        }
        req.user = user
        // console.log(token, 'token')
        // console.log(req.user.isAdmin, 'isAdmin')
        if (req.user.isAdmin !== true) {
            return next(new customError('You are not authorized to access this route', 403))
        }

        // if u want to check then make isAdmin true in the database or above

        next()
    }
    catch (error) {
        console.error('Error in admin middleware:', error)
        return next(new customError('Internal server error', 500))
    }
}

module.exports = adminMiddleware