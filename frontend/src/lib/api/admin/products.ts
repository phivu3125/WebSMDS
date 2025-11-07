import { adminApiFetch, handleAdminResponse } from "./base"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  inStock: boolean
  status: string
  category?: {
    name: string
  }
  createdAt: string
}

export async function getAllProducts(): Promise<Product[]> {
  const response = await adminApiFetch("products")
  const data = await handleAdminResponse<{ success: boolean; data: Product[] }>(response)
  return data.data || []
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
  const response = await adminApiFetch(`products/${id}`, {
    method: "DELETE"
  })
  return handleAdminResponse<{ success: boolean; message: string }>(response)
}
