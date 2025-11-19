export interface Product {
    id: number
    name: string
    description: string
    priceNum: number
    categoryId: number
    image: string
    featured: boolean
    inStock: boolean
    stock: number
    details?: string
    specifications?: Array<{
        label: string
        value: string
    }>
    images?: string[]
    brandId?: number
}

export interface Order {
    id: string
    orderNumber: string
    productId: number
    quantity: number
    fullName: string
    email: string
    phone: string
    address: string
    notes?: string
    // Status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled'
    status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled'
    createdAt: string
}

export interface OrderFormData {
    productId: number
    productName: string
    quantity: number
    fullName: string
    email: string
    phone: string
    address: string
    notes: string
}
