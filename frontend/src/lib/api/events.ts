import { apiFetch, safeApiFetch } from "./base"

export async function getEvents(filters?: { status?: string; featured?: boolean }) {
  const params = new URLSearchParams()
  if (filters?.status) params.append("status", filters.status)
  if (filters?.featured !== undefined) params.append("featured", String(filters.featured))

  const query = params.toString()
  const response = await safeApiFetch(`events${query ? `?${query}` : ""}`)
  if (!response) {
    console.warn("Events API not available, returning empty array")
    return []
  }
  return response.json()
}

export async function getEventBySlug(slug: string) {
  const response = await apiFetch(`events/${slug}`)
  if (!response.ok) throw new Error("Failed to fetch event")
  return response.json()
}

export async function submitEventRegistration(
  slug: string,
  payload: {
    fullName: string
    email?: string
    phone: string
    note?: string
  }
) {
  const response = await apiFetch(`events/${slug}/registrations`, {
    method: "POST",
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    const message = error?.error || error?.message || "Không thể gửi đăng ký"
    throw new Error(message)
  }

  return response.json()
}
