import { adminApiFetch, handleAdminResponse } from "./base"

interface Story {
  id: string
  title: string
  content: string
  author?: string | null
  authorEmail?: string | null
  status: string
  createdAt: string
}

export async function getAllStories(): Promise<Story[]> {
  const response = await adminApiFetch("stories")
  const data = await handleAdminResponse<{ success: boolean; data: Story[] }>(response)
  return data.data || []
}

export async function updateStoryStatus(id: string, status: string): Promise<Story> {
  const response = await adminApiFetch(`stories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
  const data = await handleAdminResponse<{ success: boolean; data: Story }>(response)
  return data.data
}

export async function deleteStory(id: string): Promise<{ message: string }> {
  const response = await adminApiFetch(`stories/${id}`, {
    method: "DELETE"
  })
  return handleAdminResponse<{ success: boolean; message: string }>(response)
}
