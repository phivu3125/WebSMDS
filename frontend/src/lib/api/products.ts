import { apiFetch } from "./base"

export async function getProducts(filters?: { status?: string; featured?: boolean; category?: string }) {
  const params = new URLSearchParams()
  if (filters?.status) params.append("status", filters.status)
  if (filters?.featured !== undefined) params.append("featured", String(filters.featured))
  if (filters?.category) params.append("category", filters.category)

  const query = params.toString()
  const response = await apiFetch(`products${query ? `?${query}` : ""}`)
  if (!response.ok) throw new Error("Failed to fetch products")
  return response.json()
}

export async function getProductBySlug(slug: string) {
  const response = await apiFetch(`products/${slug}`)
  if (!response.ok) throw new Error("Failed to fetch product")
  return response.json()
}
