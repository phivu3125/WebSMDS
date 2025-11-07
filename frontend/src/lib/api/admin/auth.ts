import { apiFetch } from "../base"
import { adminApiFetch, handleAdminResponse } from "./base"
import { setAuthToken, removeAuthToken } from "@/lib/auth-cookies"

interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  token: string
}

export interface CurrentUserResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiFetch("auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.error || "Login failed")
  }

  const data: LoginResponse = await response.json()
  
  // Save token to cookies
  setAuthToken(data.token)
  
  return data
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("auth/logout", {
      method: "POST"
    })
  } catch (error) {
    console.error("Logout API error:", error)
  } finally {
    // Always remove token from cookies
    removeAuthToken()
  }
}

export async function getCurrentUser() {
  const response = await adminApiFetch("auth/me")
  const data = await handleAdminResponse<CurrentUserResponse>(response)
  return data.user
}
