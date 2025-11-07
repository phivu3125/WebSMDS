import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { authController } from '../controllers/auth.controller.js'

const router = Router()

// Auth routes
router.post('/register', authController.register.bind(authController))
router.post('/login', authController.login.bind(authController))
router.get('/me', requireAuth, authController.getMe.bind(authController))
router.post('/logout', authController.logout.bind(authController))

export default router

