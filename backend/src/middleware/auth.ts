import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/auth.js'
import { prisma } from '../lib/prisma.js'

export interface AuthRequest extends Request {
    user?: {
        id: string
        email: string
        name: string
        role: string
    }
}

export async function requireAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' })
        }

        const token = authHeader.substring(7)
        const decoded = verifyToken(token)

        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' })
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true, role: true },
        })

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - User not found' })
        }

        req.user = user
        next()
    } catch (error) {
        console.error('Auth middleware error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export function requireAdmin(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden - Admin access required' })
    }
    next()
}

