import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const heroSchema = z.object({
    backgroundImage: z.string().regex(/^\/uploads\/|^https?:\/\//).optional().or(z.literal('')).transform((val) => (val ? val : undefined)),
});

const introSchema = z.object({
    content: z.string().min(1, 'Intro content is required'),
    align: z.enum(['start', 'center']).default('start'),
});

const featureItemSchema = z.object({
    title: z.string().min(1, 'Feature item title is required'),
    subtitle: z.string().optional(),
    content: z.string().min(1, 'Feature item content is required'),
    images: z.array(z.string().regex(/^\/uploads\/|^https?:\/\//)).max(4).optional(),
});

const featureListSchema = z.object({
    items: z.array(featureItemSchema).min(1, 'Feature list requires at least one item'),
});

const galleryImageSchema = z.object({
    url: z.string().regex(/^\/uploads\/|^https?:\/\//),
    alt: z.string().optional(),
});

const gallerySchema = z.object({
    images: z.array(galleryImageSchema).max(9),
});

const conclusionSchema = z.object({
    content: z.string().min(1, 'Conclusion content is required'),
});

const pastEventBodySchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    thumbnailImage: z.string().regex(/^\/uploads\/|^https?:\/\//).optional(),
    year: z.number().int(),
    hero: heroSchema.default({}),
    intro: introSchema,
    featureList: featureListSchema,
    gallery: gallerySchema,
    conclusion: conclusionSchema,
});

const sanitizeHero = (hero: unknown) => {
    const parsed = heroSchema.safeParse(hero);
    return parsed.success ? parsed.data : {};
};

const sanitizeIntro = (intro: unknown) => {
    const parsed = introSchema.safeParse(intro);
    if (!parsed.success) {
        throw parsed.error;
    }
    return parsed.data;
};

const sanitizeFeatureList = (featureList: unknown) => {
    const parsed = featureListSchema.safeParse(featureList);
    if (!parsed.success) {
        throw parsed.error;
    }
    return parsed.data;
};

const sanitizeGallery = (gallery: unknown) => {
    const parsed = gallerySchema.safeParse(gallery);
    if (!parsed.success) {
        throw parsed.error;
    }
    return parsed.data;
};

const sanitizeConclusion = (conclusion: unknown) => {
    const parsed = conclusionSchema.safeParse(conclusion);
    if (!parsed.success) {
        throw parsed.error;
    }
    return parsed.data;
};

const preparePastEventData = (body: unknown) => {
    const parsed = pastEventBodySchema.parse(body);
    return {
        title: parsed.title,
        slug: parsed.slug,
        subtitle: parsed.subtitle,
        description: parsed.description,
        thumbnailImage: parsed.thumbnailImage,
        year: parsed.year,
        hero: sanitizeHero(parsed.hero),
        intro: sanitizeIntro(parsed.intro),
        featureList: sanitizeFeatureList(parsed.featureList),
        gallery: sanitizeGallery(parsed.gallery),
        conclusion: sanitizeConclusion(parsed.conclusion),
    };
};

export const checkPastEventSlug = async (req: Request, res: Response) => {
    try {
        const { slug, excludeId } = req.query;

        if (!slug || typeof slug !== 'string') {
            return res.status(400).json({ error: 'Slug is required' });
        }

        const sanitizedSlug = slug.trim().toLowerCase();

        const existing = await prisma.pastEvent.findFirst({
            where: {
                slug: sanitizedSlug,
                ...(excludeId && typeof excludeId === 'string'
                    ? { NOT: { id: excludeId } }
                    : {}),
            },
            select: { id: true },
        });

        res.json({ exists: Boolean(existing) });
    } catch (error) {
        console.error('Error checking past event slug:', error);
        res.status(500).json({ error: 'Failed to check slug' });
    }
};

export const getAllPastEvents = async (req: Request, res: Response) => {
    try {
        const { year } = req.query;

        const where: Record<string, unknown> = {};
        if (year) {
            where.year = parseInt(year as string);
        }

        const events = await prisma.pastEvent.findMany({
            where,
            orderBy: [
                { year: 'desc' },
                { createdAt: 'desc' }
            ],
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                thumbnailImage: true,
                year: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        res.json(events);
    } catch (error) {
        console.error('Error fetching past events:', error);
        res.status(500).json({ error: 'Failed to fetch past events' });
    }
};

export const getPastEventBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        let event = await prisma.pastEvent.findUnique({
            where: { slug }
        });

        if (!event) {
            event = await prisma.pastEvent.findUnique({
                where: { id: slug }
            });
        }

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error('Error fetching past event:', error);
        res.status(500).json({ error: 'Failed to fetch past event' });
    }
};

export const createPastEvent = async (req: Request, res: Response) => {
    try {
        const data = preparePastEventData(req.body);

        const event = await prisma.pastEvent.create({
            data,
        });

        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating past event:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.flatten() });
        }
        res.status(500).json({ error: 'Failed to create past event' });
    }
};

export const updatePastEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const data = preparePastEventData(req.body);

        const event = await prisma.pastEvent.update({
            where: { id },
            data,
        });

        res.json(event);
    } catch (error) {
        console.error('Error updating past event:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.flatten() });
        }
        res.status(500).json({ error: 'Failed to update past event' });
    }
};

export const deletePastEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.pastEvent.delete({
            where: { id }
        });

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting past event:', error);
        res.status(500).json({ error: 'Failed to delete past event' });
    }
};

export const getYearGroups = async (req: Request, res: Response) => {
    try {
        const years = await prisma.pastEvent.groupBy({
            by: ['year'],
            _count: { id: true },
            orderBy: { year: 'desc' }
        });

        res.json(years);
    } catch (error) {
        console.error('Error fetching year groups:', error);
        res.status(500).json({ error: 'Failed to fetch year groups' });
    }
};
