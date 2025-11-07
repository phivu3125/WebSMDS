import { apiFetch } from "../base"
import { getAuthToken } from "@/lib/auth-cookies"

export async function adminApiFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error("No authentication token found. Please log in.")
  }

  return apiFetch(path, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`
    }
  })
}

export async function handleAdminResponse<T = unknown>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.error || data?.message || response.statusText || "Request failed"
    const error = new Error(message)
    ;(error as Error & { status?: number }).status = response.status
    throw error
  }

  return data as T
}
