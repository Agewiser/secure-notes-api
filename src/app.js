import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import notesRouter from './routes/notes.js'
import { notFound, errorHandler } from './middlewares/errorHandler.js'

const app = express()

//--- Security Middleware

app.use(helmet())
app.use (cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))

//----Body parsing middleware--- 

app.use(express.json({ limit: '10kb'}))
app.use (express.urlencoded({ extended: true, limit: '10kb'}))

//----Routes----
app.use('/api/notes', notesRouter)

//----Health check----

app.get ('/health', (req, res) => {
    res.json ({
        status: 'ok',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    })
})

app.use(notFound)
app.use(errorHandler)

export default app