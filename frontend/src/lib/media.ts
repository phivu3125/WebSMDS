import { API_BASE_URL } from "./api/base"

const API_ROOT = API_BASE_URL.replace(/\/$/, "")
const MEDIA_BASE_URL = API_ROOT.replace(/\/api$/, "")

export function resolveMediaUrl(input?: string | null): string {
  if (!input) return ""
  if (input.startsWith("http://") || input.startsWith("https://")) {
    return input
  }

  const normalizedPath = input.startsWith("/") ? input : `/${input}`
  return `${MEDIA_BASE_URL}${normalizedPath}`
}
