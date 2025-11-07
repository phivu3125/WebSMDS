import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const toTitleCase = (value: string) => value.replace(/\s+/g, ' ').trim();

export const ideaController = {
    // GET /api/ideas - Lấy danh sách idea submissions
    async getAll(req: Request, res: Response) {
        try {
            const { status } = req.query;

            const where: Record<string, unknown> = {};
            if (status && typeof status === 'string') {
                where.status = status;
            }

            const ideas = await prisma.idea.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            });

            res.json({ success: true, data: ideas });
        } catch (error) {
            console.error('Get ideas error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch ideas' });
        }
    },

    // POST /api/ideas - Tạo mới một idea
    async create(req: Request, res: Response) {
        try {
            const { title, description, email, submitter, phone } = req.body ?? {};

            if (!title || typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({ success: false, error: 'Title is required' });
            }

            if (!description || typeof description !== 'string' || !description.trim()) {
                return res.status(400).json({ success: false, error: 'Description is required' });
            }

            if (!email || typeof email !== 'string' || !email.trim()) {
                return res.status(400).json({ success: false, error: 'Email is required' });
            }

            const idea = await prisma.idea.create({
                data: {
                    title: toTitleCase(title),
                    description: description.trim(),
                    email: email.trim(),
                    submitter: submitter && typeof submitter === 'string' && submitter.trim()
                        ? submitter.trim()
                        : 'Ẩn danh',
                    status: 'pending',
                    ...(phone && typeof phone === 'string' && phone.trim() ? { phone: phone.trim() } : {}),
                },
            });

            res.status(201).json({ success: true, data: idea });
        } catch (error) {
            console.error('Create idea error:', error);
            res.status(500).json({ success: false, error: 'Failed to create idea' });
        }
    },

    // PUT /api/ideas/:id - Cập nhật một idea theo id
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, description, email, submitter, phone, status, notes } = req.body ?? {};

            const data: Record<string, unknown> = {};

            if (typeof title === 'string') data.title = toTitleCase(title);
            if (typeof description === 'string') data.description = description.trim();
            if (typeof email === 'string') data.email = email.trim();
            if (typeof submitter === 'string') data.submitter = submitter.trim();
            if (typeof phone === 'string') data.phone = phone.trim();
            if (typeof status === 'string') data.status = status;
            if (typeof notes === 'string') data.notes = notes.trim();

            const idea = await prisma.idea.update({
                where: { id },
                data,
            });

            res.json({ success: true, data: idea });
        } catch (error) {
            console.error('Update idea error:', error);
            res.status(500).json({ success: false, error: 'Failed to update idea' });
        }
    },

    // DELETE /api/ideas/:id - Xóa một idea theo id
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.idea.delete({
                where: { id },
            });

            res.json({ success: true, message: 'Idea deleted successfully' });
        } catch (error) {
            console.error('Delete idea error:', error);
            res.status(500).json({ success: false, error: 'Failed to delete idea' });
        }
    },
};
