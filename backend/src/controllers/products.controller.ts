import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const productsController = {
    // GET /api/products
    async getAll(req: Request, res: Response) {
        try {
            const { category, featured, status } = req.query;

            const where: any = {};
            if (category) where.category = category;
            if (featured) where.featured = featured === 'true';
            if (status) where.status = status;

            const products = await prisma.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            });

            res.json({ success: true, data: products });
        } catch (error) {
            console.error('Get products error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch products' });
        }
    },

    // GET /api/products/:slug
    async getBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const product = await prisma.product.findUnique({
                where: { slug },
            });

            if (!product) {
                return res.status(404).json({ success: false, error: 'Product not found' });
            }

            res.json({ success: true, data: product });
        } catch (error) {
            console.error('Get product error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch product' });
        }
    },

    // POST /api/products
    async create(req: Request, res: Response) {
        try {
            const product = await prisma.product.create({
                data: req.body,
            });

            res.status(201).json({ success: true, data: product });
        } catch (error) {
            console.error('Create product error:', error);
            res.status(500).json({ success: false, error: 'Failed to create product' });
        }
    },

    // PUT /api/products/:id
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await prisma.product.update({
                where: { id },
                data: req.body,
            });

            res.json({ success: true, data: product });
        } catch (error) {
            console.error('Update product error:', error);
            res.status(500).json({ success: false, error: 'Failed to update product' });
        }
    },

    // DELETE /api/products/:id
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.product.delete({
                where: { id },
            });

            res.json({ success: true, message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Delete product error:', error);
            res.status(500).json({ success: false, error: 'Failed to delete product' });
        }
    },
};