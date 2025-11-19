import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

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
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3001', // Add port 3001 for development
    ],
    credentials: true
}))
app.use(express.json())

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

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

export default app