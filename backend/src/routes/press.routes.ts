import { Router } from 'express'
import { pressController } from '../controllers/press.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

// Public routes
router.get('/', pressController.getAll)
router.get('/:id', pressController.getById)

// Protected routes
router.post('/', requireAuth, pressController.create)
router.put('/:id', requireAuth, pressController.update)
router.patch('/:id', requireAuth, pressController.update)
router.delete('/:id', requireAuth, pressController.delete)

export default router
