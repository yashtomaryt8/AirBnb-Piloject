const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes/user.routes')

// middleware to parse json data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req,res) => {
    res.send('Hello World!')
})

app.use('/api/auth', userRoutes)

module.exports = app