"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { adminApi } from "@/lib/api"
import { isAuthenticated as hasAuthToken, removeAuthToken } from "@/lib/auth-cookies"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isLoginRoute = pathname?.startsWith("/admin/login")

  useEffect(() => {
    if (isLoginRoute) {
      setIsLoading(false)
      setIsAuthenticated(false)
      return
    }

    const verifyAuthentication = async () => {
      try {
        const tokenExists = hasAuthToken()

        if (!tokenExists) {
          removeAuthToken()
          router.replace("/admin/login")
          return
        }

        await adminApi.getCurrentUser()
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth verification failed:", error)
        removeAuthToken()
        router.replace("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuthentication()
  }, [router, isLoginRoute])

  if (isLoginRoute) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
