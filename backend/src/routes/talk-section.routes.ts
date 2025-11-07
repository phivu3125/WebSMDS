import { Router } from 'express'
import { talkSectionController } from '../controllers/talk-section.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', talkSectionController.getPublic)
router.put('/', requireAuth, talkSectionController.upsert)

export default router
