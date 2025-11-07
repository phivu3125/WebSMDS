import { adminApiFetch, handleAdminResponse } from "./base"

interface Idea {
  id: string
  title: string
  description: string
  submitter: string
  email: string
  phone?: string | null
  status: string
  notes?: string | null
  createdAt: string
}

export async function getAllIdeas(): Promise<Idea[]> {
  const response = await adminApiFetch("ideas")
  const data = await handleAdminResponse<{ success: boolean; data: Idea[] }>(response)
  return data.data || []
}

export async function updateIdeaStatus(id: string, status: string): Promise<Idea> {
  const response = await adminApiFetch(`ideas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
  const data = await handleAdminResponse<{ success: boolean; data: Idea }>(response)
  return data.data
}

export async function updateIdeaNotes(id: string, notes: string): Promise<Idea> {
  const response = await adminApiFetch(`ideas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes })
  })
  const data = await handleAdminResponse<{ success: boolean; data: Idea }>(response)
  return data.data
}

export async function deleteIdea(id: string): Promise<{ message: string }> {
  const response = await adminApiFetch(`ideas/${id}`, {
    method: "DELETE"
  })
  return handleAdminResponse<{ success: boolean; message: string }>(response)
}
