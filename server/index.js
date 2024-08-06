import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import videoRoutes from './routes/videos.js'
import commentsRoutes from './routes/comments.js'

const app = express()
dotenv.config()

const port = process.env.PORT || 9000

// Connect to MongoDB
const connect = async () => {

    try {

        await mongoose.connect(process.env.MONGO)
        console.log('Connected to MongoDB');

    } catch (err) {

        throw err

    }

}

// Middleware
app.use(cookieParser())
app.use(express.json())
app.use(cors())

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/comments", commentsRoutes)

app.use((err, req, res, next) => {

    const status = err.status || 500
    const message = err.message || "Đã có lỗi xảy ra"

    return res.status(status).json({

        success: false,
        status: status,
        message: message

    })

})

app.listen(port, () => {

    connect()
    console.log(`Server is running at port http://localhost:${port}`)

})