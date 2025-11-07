import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const DEFAULT_KEY = 'default'

export const talkSectionController = {
    async getPublic(_req: Request, res: Response) {
        try {
            const talkSection = await prisma.talkSection.findUnique({
                where: { key: DEFAULT_KEY },
            })

            res.json({ success: true, data: talkSection })
        } catch (error) {
            console.error('Failed to fetch talk section:', error)
            res.status(500).json({ success: false, error: 'Failed to fetch talk section' })
        }
    },

    async upsert(req: Request, res: Response) {
        try {
            const { title, description, liveInput, replayInput } = req.body ?? {}

            const talkSection = await prisma.talkSection.upsert({
                where: { key: DEFAULT_KEY },
                update: {
                    title,
                    description,
                    liveInput,
                    replayInput,
                },
                create: {
                    key: DEFAULT_KEY,
                    title,
                    description,
                    liveInput,
                    replayInput,
                },
            })

            res.json({ success: true, data: talkSection })
        } catch (error) {
            console.error('Failed to save talk section:', error)
            res.status(500).json({ success: false, error: 'Failed to save talk section' })
        }
    },
}
