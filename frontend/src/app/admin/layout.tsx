"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/admin/sidebar"
import { AuthGuard } from "@/components/admin/auth-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginRoute = pathname?.startsWith("/admin/login")

  if (isLoginRoute) {
    return <>{children}</>
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
