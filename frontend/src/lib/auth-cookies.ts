// Helper functions for managing auth token in cookies

const TOKEN_KEY = "auth_token"
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

export function setAuthToken(token: string): void {
  if (typeof document === "undefined") return
  
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${TOKEN_MAX_AGE}; SameSite=Strict`
}

export function getAuthToken(): string | null {
  if (typeof document === "undefined") return null
  
  const cookies = document.cookie.split("; ")
  const tokenCookie = cookies.find(cookie => cookie.startsWith(`${TOKEN_KEY}=`))
  
  if (!tokenCookie) return null
  
  return tokenCookie.split("=")[1] || null
}

export function removeAuthToken(): void {
  if (typeof document === "undefined") return
  
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}
