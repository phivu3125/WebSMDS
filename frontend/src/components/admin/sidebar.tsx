"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  FileText,
  Calendar,
  Mail,
  Lightbulb,
  BookOpen,
  Package,
  LogOut,
  Menu,
  X as CloseIcon,
  ChevronDown,
  ChevronRight,
  Users,
  Video,
  ShoppingCart,
  HandHeart,
} from "lucide-react"

interface NavItem {
  name: string
  href?: string
  icon: any
  children?: NavItem[]
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Tin Tức", href: "/admin/press", icon: FileText },
  {
    name: "Quản lý Sự kiện",
    icon: Calendar,
    children: [
      { name: "Danh sách Sự kiện", href: "/admin/events", icon: Calendar },
      { name: "Đăng ký tham gia", href: "/admin/event-registrations", icon: Users },
    ],
  },
  {
    name: "Cộng đồng",
    icon: HandHeart,
    children: [
      { name: "Câu chuyện", href: "/admin/stories", icon: BookOpen },
      { name: "Ý tưởng", href: "/admin/ideas", icon: Lightbulb },
      { name: "Đăng ký nhận tin", href: "/admin/email-subscriptions", icon: Mail },
    ],
  },
  { name: "Tọa đàm", href: "/admin/talk-section", icon: Video },
  {
    name: "Sản phẩm",
    icon: Package,
    children: [
      { name: "Danh sách Sản phẩm", href: "/admin/products", icon: Package },
      { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((name) => name !== groupName)
        : [...prev, groupName]
    )
  }

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/admin/login")
  }

  return (
    <>
      <button
        type="button"
        className="fixed top-4 left-4 z-40 flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium shadow-md ring-1 ring-gray-200 transition md:hidden"
        onClick={() => setIsMobileOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <CloseIcon className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        <span>Menu</span>
      </button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-200 md:static md:inset-auto md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center px-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="space-y-1 px-4">
              {navigation.map((item) => {
                if (item.children) {
                  const isExpanded = expandedGroups.includes(item.name)
                  const hasActiveChild = item.children.some((child) => pathname === child.href)
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => toggleGroup(item.name)}
                        className={cn(
                          "flex w-full items-center justify-between px-4 py-3 text-sm font-medium rounded-md transition-colors",
                          hasActiveChild
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.children.map((child) => {
                            const isActive = pathname === child.href
                            return (
                              <Link
                                key={child.name}
                                href={child.href!}
                                className={cn(
                                  "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                                  isActive
                                    ? "bg-blue-100 text-blue-700 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                              >
                                <child.icon className="mr-3 h-4 w-4" />
                                {child.name}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                }
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href!}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>
          <div className="border-t p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-md px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
