import express from 'express'
import helmet from 'helmet'
import cors from 'cors'

const app = express()

//--- Security Middleware

app.use(helmet())
app.use (cors({
    origin: process.env.ALLOWED_ORIGINS ?. SPLIT(',') || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))

//----Body parsing middleware--- 

app.use(express.json({ limit: '10kb'}))
app.use (express.urlencoded({ extended: true, limit: '10kb'}))

//----Health check----

app.get ('/health', (req, res) => {
    res.json ({
        status: 'ok',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    })
})

export default app