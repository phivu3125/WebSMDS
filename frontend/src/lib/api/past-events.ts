import { PastEvent, PastEventListItem, PastEventIntro, PastEventFeatureList, PastEventGallery, PastEventConclusion } from '@/types/PastEvent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface PastEventApiResponse {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    description?: string;
    year: number;
    thumbnailImage?: string;
    hero?: Record<string, unknown>;
    intro?: { content: string; align: string };
    featureList?: { items: unknown[] };
    gallery?: { images: unknown[] };
    conclusion?: { content: string };
    createdAt: string;
    updatedAt: string;
}

interface PastEventListItemApiResponse {
    id: string;
    slug: string;
    title: string;
    description?: string;
    year: number;
    thumbnailImage?: string;
    createdAt: string;
    updatedAt: string;
}

const mapEvent = (event: PastEventApiResponse): PastEvent => ({
    id: event.id,
    slug: event.slug,
    title: event.title,
    subtitle: event.subtitle ?? undefined,
    description: event.description ?? undefined,
    year: event.year,
    thumbnailImage: event.thumbnailImage ?? undefined,
    hero: {
        ...(event.hero ?? {}),
    },
    intro: (event.intro ?? { content: '', align: 'start' }) as PastEventIntro,
    featureList: (event.featureList ?? { items: [] }) as PastEventFeatureList,
    gallery: (event.gallery ?? { images: [] }) as PastEventGallery,
    conclusion: (event.conclusion ?? { content: '' }) as PastEventConclusion,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
});

export async function getPastEvents(year?: number): Promise<PastEventListItem[]> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());

    const res = await fetch(`${API_URL}/past-events?${params.toString()}`, {
    });

    if (!res.ok) {
        throw new Error('Failed to fetch past events');
    }

    const data = await res.json();
    return data.map((event: PastEventListItemApiResponse) => ({
        id: event.id,
        slug: event.slug,
        title: event.title,
        description: event.description ?? undefined,
        year: event.year,
        thumbnailImage: event.thumbnailImage ?? undefined,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
    } satisfies PastEventListItem));
}

export async function getPastEventBySlug(slug: string): Promise<PastEvent> {
    const res = await fetch(`${API_URL}/past-events/${slug}`, {
    });

    if (!res.ok) {
        throw new Error('Failed to fetch past event');
    }

    const data = await res.json();
    return mapEvent(data);
}

export async function getYearGroups(): Promise<{ year: number; _count: { id: number } }[]> {
    const res = await fetch(`${API_URL}/past-events/years`, {
    });

    if (!res.ok) {
        throw new Error('Failed to fetch years');
    }

    return res.json();
}
