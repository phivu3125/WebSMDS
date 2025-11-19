import { apiFetch, safeApiFetch } from "./base"

export interface PressItem {
  id: number
  source: string
  title: string
  description: string
  date: string
  type: string
  link: string
  image: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export async function getPress(filters?: { type?: string; featured?: boolean }) {
  const params = new URLSearchParams()
  if (filters?.type) params.append("type", filters.type)
  if (filters?.featured !== undefined) params.append("featured", String(filters.featured))

  const query = params.toString()
  const response = await safeApiFetch(`press${query ? `?${query}` : ""}`)
  if (!response) {
    console.warn("Press API not available, returning empty array")
    return { success: false, data: [] }
  }
  return (await response.json()) as { success: boolean; data: PressItem[] }
}

export async function deletePress(id: number) {
  const response = await apiFetch(`press/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error("Failed to delete press item")
  return { success: true }
}

export async function updatePress(id: number, data: Partial<PressItem>) {
  const response = await apiFetch(`press/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error("Failed to update press item")
  return (await response.json()) as { success: boolean; data: PressItem }
}