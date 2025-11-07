import { Router } from 'express'
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '../controllers/orders.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

// Public order creation
router.post('/', createOrder)

// Protected routes
router.get('/', requireAuth, getAllOrders)
router.get('/:id', requireAuth, getOrderById)
router.put('/:id', requireAuth, updateOrder)
router.delete('/:id', requireAuth, deleteOrder)

export default router