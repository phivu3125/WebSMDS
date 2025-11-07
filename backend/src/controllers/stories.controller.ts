import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const slugify = (value: string) =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^\w\s-]/g, '')
        .replace(/[-\s]+/g, '-')
        .replace(/^-+|-+$/g, '');

export const storyController = {
    // GET /api/stories - Lấy danh sách story submissions
    async getAll(req: Request, res: Response) {
        try {
            const { status } = req.query;

            const where: Record<string, unknown> = {};
            if (status && typeof status === 'string') {
                where.status = status;
            }

            const stories = await prisma.story.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            });

            res.json({ success: true, data: stories });
        } catch (error) {
            console.error('Get stories error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch stories' });
        }
    },

    // POST /api/stories - tạo mới story submission (public)
    async create(req: Request, res: Response) {
        try {
            const { title, content, author, authorEmail, image } = req.body ?? {};

            if (!title || typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({ success: false, error: 'Title is required' });
            }

            if (!content || typeof content !== 'string' || !content.trim()) {
                return res.status(400).json({ success: false, error: 'Content is required' });
            }

            const baseSlug = slugify(title.trim());
            const slug = baseSlug ? `${baseSlug}-${Date.now()}` : `story-${Date.now()}`;

            const story = await prisma.story.create({
                data: {
                    title: title.trim(),
                    slug,
                    content: content.trim(),
                    status: 'pending',
                    ...(author && typeof author === 'string' && author.trim() ? { author: author.trim() } : {}),
                    ...(authorEmail && typeof authorEmail === 'string' && authorEmail.trim()
                        ? { authorEmail: authorEmail.trim() }
                        : {}),
                    ...(image && typeof image === 'string' && image.trim() ? { image: image.trim() } : {}),
                },
            });

            res.status(201).json({ success: true, data: story });
        } catch (error) {
            console.error('Create story error:', error);
            res.status(500).json({ success: false, error: 'Failed to create story' });
        }
    },

    // GET /api/stories/:id - Lấy story theo id
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const story = await prisma.story.findUnique({
                where: { id },
            });

            if (!story) {
                return res.status(404).json({ success: false, error: 'Story not found' });
            }

            res.json({ success: true, data: story });
        } catch (error) {
            console.error('Get story error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch story' });
        }
    },

    // PUT /api/stories/:id - Cập nhật status story
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body ?? {};

            const story = await prisma.story.update({
                where: { id },
                data: {
                    ...(typeof status === 'string' ? { status } : {}),
                },
            });

            res.json({ success: true, data: story });
        } catch (error) {
            console.error('Update story error:', error);
            res.status(500).json({ success: false, error: 'Failed to update story' });
        }
    },

    // DELETE /api/stories/:id - Xóa story
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.story.delete({
                where: { id },
            });

            res.json({ success: true, message: 'Story deleted successfully' });
        } catch (error) {
            console.error('Delete story error:', error);
            res.status(500).json({ success: false, error: 'Failed to delete story' });
        }
    },
};
