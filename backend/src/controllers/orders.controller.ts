import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { status } = req.query

        const where: any = {}
        if (status) where.status = status

        const orders = await prisma.order.findMany({
            where,
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        res.json(orders)
    } catch (error) {
        console.error('Get orders error:', error)
        res.status(500).json({ error: 'Failed to fetch orders' })
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (!order) {
            return res.status(404).json({ error: 'Order not found' })
        }

        res.json(order)
    } catch (error) {
        console.error('Get order error:', error)
        res.status(500).json({ error: 'Failed to fetch order' })
    }
}

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { items, ...orderData } = req.body

        // Generate order number
        const orderNumber = `ORD-${Date.now()}`

        const order = await prisma.order.create({
            data: {
                ...orderData,
                orderNumber,
                orderItems: {
                    create: items
                }
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        })

        res.status(201).json(order)
    } catch (error) {
        console.error('Create order error:', error)
        res.status(500).json({ error: 'Failed to create order' })
    }
}

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const order = await prisma.order.update({
            where: { id },
            data: req.body,
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        })

        res.json(order)
    } catch (error) {
        console.error('Update order error:', error)
        res.status(500).json({ error: 'Failed to update order' })
    }
}

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        await prisma.order.delete({
            where: { id }
        })

        res.json({ message: 'Order deleted successfully' })
    } catch (error) {
        console.error('Delete order error:', error)
        res.status(500).json({ error: 'Failed to delete order' })
    }
}