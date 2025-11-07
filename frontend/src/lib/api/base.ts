const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "")

export function resolveApiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  const trimmedPath = path.startsWith("/") ? path.slice(1) : path
  return `${API_BASE_URL}/${trimmedPath}`
}

export async function apiFetch(input: string, init?: RequestInit) {
  const url = resolveApiUrl(input)
  const { headers: initHeaders, ...rest } = init ?? {}
  const headers = new Headers(initHeaders)
  const isFormData = typeof FormData !== "undefined" && rest.body instanceof FormData

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  try {
    const response = await fetch(url, {
      ...rest,
      headers,
    })
    return response
  } catch (error) {
    console.error('API fetch error:', error)
    throw error
  }
}

export { API_BASE_URL }
