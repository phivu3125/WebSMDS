import { Router } from 'express';
import { storyController } from '../controllers/stories.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', storyController.getAll);
router.get('/:id', storyController.getById);
router.post('/', storyController.create);

// Protected routes
router.put('/:id', requireAuth, storyController.update);
router.delete('/:id', requireAuth, storyController.delete);

export default router;
