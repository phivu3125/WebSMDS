import { apiFetch } from "./base"

export async function getStories(status?: string) {
  const params = status ? `?status=${status}` : ""
  const response = await apiFetch(`stories${params}`)
  if (!response.ok) throw new Error("Failed to fetch stories")
  return response.json()
}

export async function submitStory(data: unknown) {
  const response = await apiFetch("stories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error("Failed to submit story")
  return response.json()
}
