import { Request, Response } from 'express'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const uploadsDir = path.resolve(process.cwd(), 'uploads')

export const uploadsController = {
    async uploadImage(req: Request, res: Response) {
        try {
            if (req.fileValidationError) {
                return res.status(400).json({
                    success: false,
                    error: req.fileValidationError,
                })
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'No file uploaded',
                })
            }

            const { filename } = req.file
            const url = `${req.protocol}://${req.get('host')}/uploads/${filename}`

            res.status(201).json({
                success: true,
                data: {
                    filename,
                    url,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                },
            })
        } catch (error) {
            console.error('Upload image error:', error)
            res.status(500).json({
                success: false,
                error: 'Failed to upload image',
            })
        }
    },

    async deleteImage(req: Request, res: Response) {
        try {
            const { filename } = req.params

            if (!filename) {
                return res.status(400).json({
                    success: false,
                    error: 'Filename is required',
                })
            }

            const sanitizedFilename = path.basename(filename)
            if (sanitizedFilename !== filename) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid filename',
                })
            }

            const filePath = path.join(uploadsDir, sanitizedFilename)

            try {
                await fs.stat(filePath)
            } catch {
                return res.status(404).json({
                    success: false,
                    error: 'File not found',
                })
            }

            await fs.unlink(filePath)

            return res.status(200).json({
                success: true,
                data: {
                    filename: sanitizedFilename,
                },
            })
        } catch (error) {
            console.error('Delete image error:', error)
            return res.status(500).json({
                success: false,
                error: 'Failed to delete image',
            })
        }
    }
}
