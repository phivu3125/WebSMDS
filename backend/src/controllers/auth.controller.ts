import { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { hashPassword, comparePassword, generateToken } from '../lib/auth.js'
import { AuthRequest } from '../middleware/auth.js'

export class AuthController {
    // Register new user (only admin can create users)
    async register(req: Request, res: Response) {
        try {
            const { email, password, name, role = 'editor' } = req.body

            // Validation
            if (!email || !password || !name) {
                return res.status(400).json({ error: 'Email, password, and name are required' })
            }

            // Check if user exists
            const existingUser = await prisma.user.findUnique({ where: { email } })
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' })
            }

            // Hash password
            const hashedPassword = await hashPassword(password)

            // Create user
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                },
            })

            // Generate token
            const token = generateToken(user.id, user.email)

            res.status(201).json({ user, token })
        } catch (error) {
            console.error('Register error:', error)
            res.status(500).json({ error: 'Failed to register user' })
        }
    }

    // Login
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' })
            }

            // Find user
            const user = await prisma.user.findUnique({ where: { email } })
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' })
            }

            // Verify password
            const isValidPassword = await comparePassword(password, user.password)
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' })
            }

            // Generate token
            const token = generateToken(user.id, user.email)

            res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                token,
            })
        } catch (error) {
            console.error('Login error:', error)
            res.status(500).json({ error: 'Failed to login' })
        }
    }

    // Get current user
    async getMe(req: AuthRequest, res: Response) {
        try {
            res.json({ user: req.user })
        } catch (error) {
            console.error('Get me error:', error)
            res.status(500).json({ error: 'Failed to get user info' })
        }
    }

    // Logout (optional - mainly handled on client side)
    async logout(req: Request, res: Response) {
        try {
            // In a stateless JWT setup, logout is handled client-side
            // But we can add token blacklisting here if needed
            res.json({ message: 'Logged out successfully' })
        } catch (error) {
            console.error('Logout error:', error)
            res.status(500).json({ error: 'Failed to logout' })
        }
    }
}

export const authController = new AuthController()
