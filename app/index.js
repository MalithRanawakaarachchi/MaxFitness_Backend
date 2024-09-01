require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const router = require('./router')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express()

const PORT = process.env.PORT || 5050

app.use(morgan('tiny'))

app.use(express.json())
app.use(cookieParser());

// Update the CORS configuration to allow requests from 'http://localhost:3000'
app.use(cors({
    // origin: 'http://localhost:3000',
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true, // Set credentials to true to allow cookies and other credentials to be sent
}));

app.use(router)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})