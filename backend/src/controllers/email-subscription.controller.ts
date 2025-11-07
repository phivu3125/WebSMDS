import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const emailSubscriptionController = {
    // GET /api/email-subscriptions - Lấy danh sách email subscriptions
    async getAll(req: Request, res: Response) {
        try {
            const { status } = req.query;

            const subscriptions = await prisma.emailSubscription.findMany({
                where: {
                    ...(status && typeof status === 'string' ? { status } : {}),
                },
                orderBy: { subscribedAt: 'desc' },
            });

            res.json({ success: true, data: subscriptions });
        } catch (error) {
            console.error('Get email subscriptions error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch subscriptions' });
        }
    },

    // GET /api/email-subscriptions/:id - Lấy subscription theo id
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const subscription = await prisma.emailSubscription.findUnique({
                where: { id },
            });

            if (!subscription) {
                return res.status(404).json({ success: false, error: 'Subscription not found' });
            }

            res.json({ success: true, data: subscription });
        } catch (error) {
            console.error('Get email subscription error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch subscription' });
        }
    },

    // PUT /api/email-subscriptions/:id - Cập nhật status subscription
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body ?? {};

            if (!status || typeof status !== 'string') {
                return res.status(400).json({ success: false, error: 'Status is required' });
            }

            const subscription = await prisma.emailSubscription.update({
                where: { id },
                data: { status },
            });

            res.json({ success: true, data: subscription });
        } catch (error) {
            console.error('Update email subscription error:', error);
            res.status(500).json({ success: false, error: 'Failed to update subscription' });
        }
    },

    // DELETE /api/email-subscriptions/:id - Xóa subscription
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.emailSubscription.delete({
                where: { id },
            });

            res.json({ success: true, message: 'Subscription deleted successfully' });
        } catch (error) {
            console.error('Delete email subscription error:', error);
            res.status(500).json({ success: false, error: 'Failed to delete subscription' });
        }
    },

    // POST /api/email-subscriptions - Tạo subscription mới (public endpoint)
    async create(req: Request, res: Response) {
        try {
            const { email } = req.body ?? {};

            if (!email || typeof email !== 'string' || !email.trim()) {
                return res.status(400).json({ success: false, error: 'Email is required' });
            }

            const normalizedEmail = normalizeEmail(email);

            // Check if email already exists
            const existing = await prisma.emailSubscription.findUnique({
                where: { email: normalizedEmail },
            });

            if (existing) {
                return res.status(400).json({ success: false, error: 'Email already subscribed' });
            }

            const subscription = await prisma.emailSubscription.create({
                data: { email: normalizedEmail },
            });

            res.status(201).json({ success: true, data: subscription });
        } catch (error) {
            console.error('Create email subscription error:', error);
            res.status(500).json({ success: false, error: 'Failed to create subscription' });
        }
    },
};
