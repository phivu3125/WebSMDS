import { Router } from 'express';
import {
    getAllPastEvents,
    getPastEventBySlug,
    createPastEvent,
    updatePastEvent,
    deletePastEvent,
    getYearGroups,
    checkPastEventSlug
} from '../controllers/past-events.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllPastEvents);
router.get('/years', getYearGroups);
router.get('/check-slug', requireAuth, checkPastEventSlug);
router.get('/:slug', getPastEventBySlug);

// Admin routes (protected)
router.post('/', requireAuth, createPastEvent);
router.put('/:id', requireAuth, updatePastEvent);
router.delete('/:id', requireAuth, deletePastEvent);

export default router;
