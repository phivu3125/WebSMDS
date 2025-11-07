"use client"

import { useEffect, useState } from 'react'
import { getEvents, getProducts } from '@/lib/api'

export default function TestAPIPage() {
    const [events, setEvents] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                // Test Events API
                console.log('Fetching events...')
                const eventsData = await getEvents({ status: 'published' })
                console.log('Events response:', eventsData)
                setEvents(Array.isArray(eventsData) ? eventsData : (eventsData.data || []))

                // Test Products API
                console.log('Fetching products...')
                const productsData = await getProducts({ status: 'published' })
                console.log('Products response:', productsData)
                const productsArray = productsData.success ? productsData.data : (Array.isArray(productsData) ? productsData : [])
                setProducts(productsArray)

            } catch (err: any) {
                console.error('API Error:', err)
                setError(err.message || 'Failed to fetch data')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">API Test Page</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Events ({events.length})</h2>
                <div className="grid gap-4">
                    {events.map((event) => (
                        <div key={event.id} className="border p-4 rounded">
                            <h3 className="font-bold">{event.title}</h3>
                            <p className="text-sm text-gray-600">{event.description}</p>
                            <p className="text-xs text-gray-500">Status: {event.status}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Products ({products.length})</h2>
                <div className="grid gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="border p-4 rounded">
                            <h3 className="font-bold">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.description}</p>
                            <p className="text-xs text-gray-500">Price: {product.price} - Status: {product.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
