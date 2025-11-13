export interface PastEventHero {
    backgroundImage?: string
}

export interface PastEventIntro {
    content: string
    align: "start" | "center"
}

export interface PastEventFeatureItem {
    title: string
    subtitle?: string
    content: string
    images?: string[]
}

export interface PastEventFeatureList {
    items: PastEventFeatureItem[]
}

export interface PastEventGalleryImage {
    url: string
    alt?: string
}

export interface PastEventGallery {
    images: PastEventGalleryImage[]
}

export interface PastEventConclusion {
    content: string
}

export interface PastEvent {
    id: string
    slug: string
    title: string
    subtitle?: string
    description?: string
    year: number
    thumbnailImage?: string
    hero: PastEventHero
    intro: PastEventIntro
    featureList: PastEventFeatureList
    gallery?: PastEventGallery
    conclusion?: PastEventConclusion
    createdAt: string
    updatedAt: string
}

export interface PastEventListItem {
    id: string
    slug: string
    title: string
    description?: string
    year: number
    thumbnailImage?: string
    createdAt: string
    updatedAt: string
}
