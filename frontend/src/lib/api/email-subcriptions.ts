import { apiFetch } from "./base"

export async function subscribeNewsletter(email: string) {
  const response = await apiFetch("email-subscriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const errorMessage = typeof data === "object" && data && "error" in data
      ? String((data as { error: unknown }).error)
      : "Failed to subscribe"

    const error = new Error(errorMessage)
    ;(error as Error & { status?: number }).status = response.status
    throw error
  }

  return data
}
