import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { upload } from '../middleware/upload'
import { uploadsController } from '../controllers/uploads.controller'

const router = Router()

router.post(
    '/images',
    requireAuth,
    requireAdmin,
    upload.single('file'),
    uploadsController.uploadImage
)

router.delete(
    '/images/:filename',
    requireAuth,
    requireAdmin,
    uploadsController.deleteImage
)

export default router
