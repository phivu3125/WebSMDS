import { Router } from 'express';
import { emailSubscriptionController } from '../controllers/email-subscription.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/email-subscriptions - Get all subscriptions (admin only)
router.get('/', requireAuth, emailSubscriptionController.getAll);

// GET /api/email-subscriptions/:id - Get subscription by id (admin only)
router.get('/:id', requireAuth, emailSubscriptionController.getById);

// PUT /api/email-subscriptions/:id - Update subscription status (admin only)
router.put('/:id', requireAuth, emailSubscriptionController.update);

// DELETE /api/email-subscriptions/:id - Delete subscription (admin only)
router.delete('/:id', requireAuth, emailSubscriptionController.delete);

// POST /api/email-subscriptions - Create new subscription (public)
router.post('/', emailSubscriptionController.create);

export default router;
