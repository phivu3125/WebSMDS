import { apiFetch } from "./base"

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
}

export async function getPress(filters?: { type?: string; featured?: boolean }) {
  const params = new URLSearchParams()
  if (filters?.type) params.append("type", filters.type)
  if (filters?.featured !== undefined) params.append("featured", String(filters.featured))

  const query = params.toString()
  const response = await apiFetch(`press${query ? `?${query}` : ""}`)
  if (!response.ok) throw new Error("Failed to fetch press coverage")
  return (await response.json()) as { success: boolean; data: PressItem[] }
}

export async function getPressById(id: number) {
  const response = await apiFetch(`press/${id}`)
  if (!response.ok) throw new Error("Failed to fetch press item")
  return (await response.json()) as { success: boolean; data: PressItem }
}
