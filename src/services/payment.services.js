require("dotenv").config()
const Razorpay = require("razorpay")


const paymentInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

module.exports = {
    paymentInstance,
}
