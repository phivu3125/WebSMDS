import { Router } from 'express'
import {
  getAllEvents,
  getEventBySlug,
  getEventByIdAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  createEventRegistration,
  getEventRegistrationsAdmin,
  updateEventRegistrationStatus,
  deleteEventRegistration,
  checkEventSlug,
} from '../controllers/events.controller'

import { requireAuth } from '../middleware/auth'

const router = Router()

// Public routes
router.get('/', getAllEvents)

// Protected routes (admin only)
router.get('/admin/registrations', requireAuth, getEventRegistrationsAdmin)
router.patch('/admin/registrations/:id/status', requireAuth, updateEventRegistrationStatus)
router.delete('/admin/registrations/:id', requireAuth, deleteEventRegistration)
router.get('/admin/:id', requireAuth, getEventByIdAdmin)
router.get('/check-slug', requireAuth, checkEventSlug)
router.post('/', requireAuth, createEvent)
router.put('/:id', requireAuth, updateEvent)
router.patch('/:id/status', requireAuth, updateEventStatus)
router.delete('/:id', requireAuth, deleteEvent)

// Public slug route must come last to avoid catching admin paths
router.post('/:slug/registrations', createEventRegistration)
router.get('/:slug', getEventBySlug)

export default router