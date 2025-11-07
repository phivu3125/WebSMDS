export interface Product {
    id: number
    name: string
    slug?: string
    description: string
    price: string
    priceNum: number
    category: string
    image: string
    featured: boolean
    inStock: boolean
    details?: string
    specifications?: {
        material?: string
        origin?: string
        size?: string
        weight?: string
        color?: string
    }
    images?: string[]
}

export interface OrderFormData {
    productId: number
    productName: string
    quantity: number
    fullName: string
    email: string
    phone: string
    address: string
    notes?: string
}

export interface NewsletterSubscription {
    email: string
}
