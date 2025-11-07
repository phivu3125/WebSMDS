import { Router } from 'express';
import { ideaController } from '../controllers/idea.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public submission
router.post('/', ideaController.create);

// Protected routes
router.get('/', requireAuth, ideaController.getAll);
router.put('/:id', requireAuth, ideaController.update);
router.delete('/:id', requireAuth, ideaController.delete);

export default router;
