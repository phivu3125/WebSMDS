import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const pressController = {
    // GET /api/press - danh sách press coverage
    async getAll(req: Request, res: Response) {
        try {
            const { type, featured } = req.query

            const press = await prisma.press.findMany({
                where: {
                    ...(type && { type: type as string }),
                    ...(featured && { featured: featured === 'true' }),
                },
                orderBy: { date: 'desc' },
            })

            res.json({ success: true, data: press })
        } catch (error) {
            console.error('Failed to fetch press:', error)
            res.status(500).json({ success: false, error: 'Failed to fetch press' })
        }
    },

    // GET /api/press/:id - chi tiết press coverage
    async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            if (Number.isNaN(id)) {
                return res.status(400).json({ success: false, error: 'Invalid press id' })
            }

            const press = await prisma.press.findUnique({ where: { id } })

            if (!press) {
                return res.status(404).json({ success: false, error: 'Press item not found' })
            }

            res.json({ success: true, data: press })
        } catch (error) {
            console.error('Failed to fetch press item:', error)
            res.status(500).json({ success: false, error: 'Failed to fetch press item' })
        }
    },

    // POST /api/press - tạo mới (yêu cầu auth)
    async create(req: Request, res: Response) {
        try {
            const press = await prisma.press.create({
                data: req.body,
            })

            res.status(201).json({ success: true, data: press })
        } catch (error) {
            console.error('Failed to create press item:', error)
            res.status(500).json({ success: false, error: 'Failed to create press item' })
        }
    },

    // PUT /api/press/:id - cập nhật (yêu cầu auth)
    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            if (Number.isNaN(id)) {
                return res.status(400).json({ success: false, error: 'Invalid press id' })
            }

            const press = await prisma.press.update({
                where: { id },
                data: req.body,
            })

            res.json({ success: true, data: press })
        } catch (error) {
            console.error('Failed to update press item:', error)
            res.status(500).json({ success: false, error: 'Failed to update press item' })
        }
    },

    // DELETE /api/press/:id - xoá (yêu cầu auth)
    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            if (Number.isNaN(id)) {
                return res.status(400).json({ success: false, error: 'Invalid press id' })
            }

            await prisma.press.delete({ where: { id } })

            res.json({ success: true, message: 'Press item deleted successfully' })
        } catch (error) {
            console.error('Failed to delete press item:', error)
            res.status(500).json({ success: false, error: 'Failed to delete press item' })
        }
    },
}
