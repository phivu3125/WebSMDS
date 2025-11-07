import multer from 'multer'
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const uploadsDir = path.resolve(process.cwd(), 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

declare module 'express-serve-static-core' {
  interface Request {
    fileValidationError?: string
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    const name = file.originalname
      .replace(ext, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const uniqueSuffix = `${timestamp}-${randomUUID()}`
    const safeName = name ? `-${name}` : ''

    cb(null, `${uniqueSuffix}${safeName}${ext}`)
  },
})

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    req.fileValidationError = 'Only image files are allowed.'
    cb(null, false)
    return
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

export { uploadsDir }
