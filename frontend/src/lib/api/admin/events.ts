import { adminApiFetch, handleAdminResponse } from "./base"

interface Event {
  id: string
  title: string
  subtitle?: string
  slug: string
  description: string
  eventIntro?: string
  eventDetails?: string
  image?: string
  location?: string
  openingHours?: string
  dateDisplay?: string
  venueMap?: string
  pricingImage?: string
  status: string
  createdAt: string
}

interface EventRegistration {
  id: string
  fullName: string
  email?: string | null
  phone: string
  note?: string | null
  status: "read" | "unread"
  readAt?: string | null
  createdAt: string
  updatedAt: string
  event: {
    id: string
    title: string
    slug: string
  }
}

export async function getAllEvents(): Promise<Event[]> {
  const response = await adminApiFetch("events")
  return handleAdminResponse<Event[]>(response)
}

export async function getEventById(id: string): Promise<Event> {
  const response = await adminApiFetch(`events/admin/${id}`)
  return handleAdminResponse<Event>(response)
}

export async function createEvent(eventData: Partial<Event>): Promise<Event> {
  const response = await adminApiFetch("events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData)
  })
  return handleAdminResponse<Event>(response)
}

export async function updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
  const response = await adminApiFetch(`events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData)
  })
  return handleAdminResponse<Event>(response)
}

export async function updateEventStatus(id: string, status: string): Promise<Event> {
  const response = await adminApiFetch(`events/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
  return handleAdminResponse<Event>(response)
}

export async function deleteEvent(id: string, password: string): Promise<{ message: string }> {
  const response = await adminApiFetch(`events/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  })
  return handleAdminResponse<{ message: string }>(response)
}

export async function getEventRegistrations(eventId?: string): Promise<EventRegistration[]> {
  const params = new URLSearchParams()
  if (eventId) params.append("eventId", eventId)

  const response = await adminApiFetch(
    `events/admin/registrations${params.toString() ? `?${params}` : ""}`
  )
  return handleAdminResponse<EventRegistration[]>(response)
}

export async function updateRegistrationStatus(
  id: string,
  status: "read" | "unread"
): Promise<EventRegistration> {
  const response = await adminApiFetch(`events/admin/registrations/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
  return handleAdminResponse<EventRegistration>(response)
}

export async function checkEventSlug(slug: string, excludeId?: string): Promise<{ exists: boolean }> {
  const params = new URLSearchParams({ slug: encodeURIComponent(slug) })
  if (excludeId) {
    params.append("excludeId", excludeId)
  }
  const response = await adminApiFetch(`events/check-slug?${params.toString()}`)
  return handleAdminResponse<{ exists: boolean }>(response)
}

export async function deleteRegistration(id: string): Promise<{ message: string }> {
  const response = await adminApiFetch(`events/admin/registrations/${id}`, {
    method: "DELETE"
  })
  return handleAdminResponse<{ message: string }>(response)
}
