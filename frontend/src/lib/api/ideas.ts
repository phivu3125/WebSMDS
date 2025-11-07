import { apiFetch } from "./base"

export async function submitIdea(data: unknown) {
  const response = await apiFetch("ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error("Failed to submit idea")
  return response.json()
}
