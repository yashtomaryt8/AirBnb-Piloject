const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    mobile : {
        type: Number,
        required: true,
        maxLength: 10
    },
    address:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    return token
}

userSchema.statics.authenticateUser = async function(email, password) {
    const user = await this.findOne({ email })
    if (!user) {
        throw new Error('Invalid credentials')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid credentials')
    }
    return user
}

module.exports = mongoose.model('User', userSchema)