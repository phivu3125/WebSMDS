import { Router } from 'express'
import { productsController } from '../controllers/products.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

// Public routes
router.get('/', productsController.getAll)
router.get('/:slug', productsController.getBySlug)

// Protected routes
router.post('/', requireAuth, productsController.create)
router.put('/:id', requireAuth, productsController.update)
router.delete('/:id', requireAuth, productsController.delete)

export default router