"use client"

import { useState, useEffect, useMemo } from "react"
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
  products: "linear-gradient(135deg, rgba(115, 66, 186, 0.9) 0%, rgba(182, 104, 161, 0.9) 100%)",
  partners: "transparent",
  news: "linear-gradient(135deg, rgba(115, 66, 186, 0.9) 0%, rgba(182, 104, 161, 0.9) 100%)",
  contact: "transparent",
  talk: "linear-gradient(135deg, rgba(115, 66, 186, 0.9) 0%, rgba(182, 104, 161, 0.9) 100%)",
}

export default function Navigation({ isScrolled, mode = "home" }: NavigationProps) {
  const [activeSection, setActiveSection] = useState("hero")
  const [isOpen, setIsOpen] = useState(false)

  const sections = [
    { id: "hero", label: "Trang chủ" },
    { id: "events", label: "Sự kiện" },
    { id: "about", label: "Về chúng tôi" },
    { id: "past_events", label: "Hành trình" },
    { id: "products", label: "Sản phẩm" },
    { id: "partners", label: "Đối tác" },
    { id: "news", label: "Tin tức" },
    { id: "talk", label: "Toạ đàm" },
    { id: "contact", label: "Liên hệ" },
  ]

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
    if (!observer) return

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => {
      sections.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) observer.unobserve(element)
      })
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, observer])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(id)
      setIsOpen(false)
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

          <div className="hidden md:flex items-center space-x-1">
            {mode === "home" ? (
              sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                  style={{
                    color: activeSection === section.id ? "#fcd34d" : "white",
                    backgroundColor: activeSection === section.id ? "rgba(167, 139, 250, 0.2)" : "transparent",
                  }}
                >
                  {section.label}
                </button>
              ))
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