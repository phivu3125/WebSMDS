"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NavigationProps {
  isScrolled: boolean
  mode?: "home" | "inner"
}

// Định nghĩa màu/gradient cho từng section
const sectionColors = {
  hero: "transparent",
  events: "transparent",
  about: "linear-gradient(135deg, rgba(115, 66, 186, 0.9) 0%, rgba(182, 104, 161, 0.9) 100%)",
  sac_mau_disan: "linear-gradient(135deg, rgba(115, 66, 186, 0.9) 0%, rgba(182, 104, 161, 0.9) 100%)",
  past_events: "linear-gradient(135deg, rgba(115, 66, 186, 0.9) 0%, rgba(182, 104, 161, 0.9) 100%)",
  hanh_trinh_danh_thuc_disan: "linear-gradient(135deg, rgba(115, 66, 186, 0.9) 0%, rgba(182, 104, 161, 0.9) 100%)",
  products: "linear-gradient(135deg, rgba(115, 66, 186, 0.9) 0%, rgba(182, 104, 161, 0.9) 100%)",
  partners: "transparent",
  news: "linear-gradient(135deg, rgba(115, 66, 186, 0.9) 0%, rgba(182, 104, 161, 0.9) 100%)",
  contact: "transparent",
  talk: "linear-gradient(135deg, rgba(115, 66, 186, 0.9) 0%, rgba(182, 104, 161, 0.9) 100%)",
}

// Định nghĩa sections bên ngoài component để tránh re-render không cần thiết
const navigationGroups = [
  {
    label: "Trang chủ",
    id: "hero",
    standalone: true
  },
  {
    label: "Giới thiệu",
    dropdown: [
      { id: "about", label: "Về chúng tôi" },
      { id: "sac_mau_disan", label: "Sắc Màu Di Sản" },
      { id: "hanh_trinh_danh_thuc_disan", label: "Đánh thức di sản" },
      { id: "past_events", label: "Hành trình" },
    ]
  },
  {
    label: "Dịch vụ",
    dropdown: [
      // { id: "events", label: "Sự kiện" },
      // { id: "products", label: "Sản phẩm" },
      { id: "partners", label: "Đối tác" }
    ]
  },
  {
    label: "Hoạt động",
    dropdown: [
      { id: "news", label: "Tin tức" },
      { id: "talk", label: "Toạ đàm" }
    ]
  },
  {
    label: "Liên hệ",
    id: "contact",
    standalone: true
  }
]

// Flatten sections for observer and scroll functionality
const sections = navigationGroups
  .filter(group => group.dropdown)
  .flatMap(group => group.dropdown!)
  .concat(
    navigationGroups
      .filter(group => group.standalone)
      .map(group => ({ id: group.id!, label: group.label }))
  )

export default function Navigation({ isScrolled, mode = "home" }: NavigationProps) {
  const [activeSection, setActiveSection] = useState("hero")
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = (groupLabel: string) => {
    setOpenDropdown(openDropdown === groupLabel ? null : groupLabel)
  }

  const handleDropdownItemClick = (sectionId: string) => {
    scrollToSection(sectionId)
    setOpenDropdown(null)
  }

  const observer = useMemo(() => {
    if (mode !== "home") return null
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return null
    }

    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    return new IntersectionObserver(observerCallback, observerOptions)
  }, [mode])

  useEffect(() => {
    if (!observer || mode !== "home") return

    // Đợi DOM ready trước khi observe
    const timeoutId = setTimeout(() => {
      sections.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) {
          observer.observe(element)
        }
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (observer) {
        sections.forEach(({ id }) => {
          const element = document.getElementById(id)
          if (element) observer.unobserve(element)
        })
        observer.disconnect()
      }
    }
  }, [mode, observer])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveSection(id)
      setIsOpen(false)
    } else {
      // Fallback: try to scroll after a short delay in case element isn't ready yet
      setTimeout(() => {
        const fallbackElement = document.getElementById(id)
        if (fallbackElement) {
          fallbackElement.scrollIntoView({ behavior: "smooth", block: "start" })
          setActiveSection(id)
        }
      }, 100)
    }
  }

  const gradient = "linear-gradient(135deg, rgba(115, 66, 186, 0.9) 0%, rgba(182, 104, 161, 0.9) 100%)"
  const navbarColor =
    mode === "inner"
      ? gradient
      : sectionColors[activeSection as keyof typeof sectionColors] || "rgba(138, 78, 177, 0.9)"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      style={{ background: isScrolled ? navbarColor : mode === "inner" ? gradient : "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Image
              src="/images/logo2.png"
              alt="Sắc Màu Di Sản"
              width={300}
              height={300}
              className="h-10 w-auto md:h-12 scale-110"
            />
          </div>

          <div className="hidden md:flex items-center space-x-1" ref={dropdownRef}>
            {mode === "home" ? (
              navigationGroups.map((group) => {
                if (group.standalone) {
                  // Standalone button
                  return (
                    <button
                      key={group.id}
                      onClick={() => scrollToSection(group.id!)}
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                      style={{
                        color: activeSection === group.id ? "#fcd34d" : "white",
                        backgroundColor: activeSection === group.id ? "rgba(167, 139, 250, 0.2)" : "transparent",
                      }}
                    >
                      {group.label}
                    </button>
                  )
                } else if (group.dropdown) {
                  // Dropdown menu
                  const isGroupActive = group.dropdown.some(item => item.id === activeSection)
                  const isDropdownOpen = openDropdown === group.label

                  return (
                    <div key={group.label} className="relative">
                      <button
                        onClick={() => toggleDropdown(group.label)}
                        className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                        style={{
                          color: isGroupActive ? "#fcd34d" : "white",
                          backgroundColor: isGroupActive ? "rgba(167, 139, 250, 0.2)" : "transparent",
                        }}
                      >
                        {group.label}
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                          {group.dropdown.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleDropdownItemClick(item.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                              style={{
                                color: activeSection === item.id ? "#7c3aed" : "#374151",
                                fontWeight: activeSection === item.id ? "600" : "normal"
                              }}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }
                return null
              })
            ) : (
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  color: "white",
                  backgroundColor: "transparent",
                }}
              >
                Trang chủ
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              style={{ color: "#fcd34d" }}
              aria-expanded={isOpen}
              aria-label="Mở menu"
              onClick={() => setIsOpen((v) => !v)}
            >
              <ChevronDown size={24} />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-3">
            <div className="mt-2 rounded-md shadow-lg ring-1 ring-white/10 bg-[rgba(138,78,177,0.95)] backdrop-blur-md">
              <div className="px-2 py-2 space-y-1">
                {mode === "home" ? (
                  sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:bg-white/10"
                    >
                      {section.label}
                    </button>
                  ))
                ) : (
                  <Link
                    href="/"
                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:bg-white/10"
                    onClick={() => setIsOpen(false)}
                  >
                    Trang chủ
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}