require('dotenv').config()
const app = require('./src/app')
const connectToDB = require('./src/config/db/db')

// Connect to MongoDB
connectToDB()

const PORT = process.env.PORT || 4000


app.listen(PORT, () => {   
    console.log(`Server is running on http://localhost:${PORT}`)
})

