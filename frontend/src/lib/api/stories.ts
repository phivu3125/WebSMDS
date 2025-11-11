import { apiFetch } from "./base"

export async function submitStory(data: unknown) {
  const response = await apiFetch("stories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error("Failed to submit story")
  return response.json()
}
