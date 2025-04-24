const jwt = require('jsonwebtoken')
const User = require('../models/userModels/user.model')
const cacheClient = require('../services/cache.services')

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token
    
    try {
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        // Check if the token is blacklisted
        const isBlacklistedToken = await cacheClient.get(token)
        if (isBlacklistedToken) {
            return res.status(401).json({ message: 'Unauthorized Token Blacklisted' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
    
        if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
        // return next(new CustomError('Unauthorized', 401))
        }
    
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' })
        // next(new CustomError('Unauthorized', 401))
    }
}

module.exports = authMiddleware