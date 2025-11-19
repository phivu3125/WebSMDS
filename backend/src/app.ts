import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan';
import helmet from 'helmet';

import { prisma } from './lib/prisma'
import authRoutes from './routes/auth'
import pressRoutes from './routes/press.routes'
import eventsRoutes from './routes/events.routes'
import productsRoutes from './routes/products.routes'
import storiesRoutes from './routes/stories.routes'
import ideasRoutes from './routes/ideas.routes'
import emailSubscriptionRoutes from './routes/email-subscription.routes'
import ordersRoutes from './routes/orders.routes'
import uploadsRoutes from './routes/uploads.routes'
import talkSectionRoutes from './routes/talk-section.routes'
import pastEventsRoutes from './routes/past-events.routes'

dotenv.config()

const app = express()

// Middleware
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: '*',
        exposedHeaders: ['Content-Length', 'X-Requested-With', 'Authorization'],
    }),
);
app.use(express.json())
app.use(morgan('tiny'));
app.use(helmet());


// Routes
app.use('/api/auth', authRoutes)
app.use('/api/press', pressRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/stories', storiesRoutes)
app.use('/api/ideas', ideasRoutes)
app.use('/api/email-subscriptions', emailSubscriptionRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/uploads', uploadsRoutes)
app.use('/api/talk-section', talkSectionRoutes)
app.use('/api/past-events', pastEventsRoutes)

// Static files
app.use('/uploads', express.static('uploads'))
app.use('/hello', async (req, res) => {
    res.json({ message: 'Hello from WebSMDS Backend!' });
})

// Health check
app.get('/health', async (req, res) => {
    try {
        // Kiểm tra kết nối database
        await prisma.$queryRaw`SELECT 1`
        res.json({
            status: 'OK',
            database: 'Connected',
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        res.status(503).json({
            status: 'ERROR',
            database: 'Disconnected',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
})

// Database connection check on startup
prisma.$connect()
    .then(() => {
        console.log('✅ Database connected successfully')
    })
    .catch((error) => {
        console.error('❌ Database connection failed:', error)
    })

export default app