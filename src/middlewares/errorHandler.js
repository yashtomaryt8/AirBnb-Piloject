const logger = require('../utils/logger')

const errorHandler = async (err, req, res, next) => {
    logger.error(`${err.status || 500} ~ ${err.message} - ${req.method} - ${req.url} - ${req.ip}`)  
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    })
}

module.exports = errorHandler