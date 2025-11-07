"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

const HERO_POSTER = "/images/hero-poster.jpg"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [playVideo, setPlayVideo] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const updatePreference = () => {
      if (typeof window === "undefined") return
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      setPlayVideo(!prefersReducedMotion)
    }

    updatePreference()
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleMotion = () => updatePreference()

    motionQuery.addEventListener?.("change", handleMotion)
    window.addEventListener("resize", updatePreference)

    return () => {
      motionQuery.removeEventListener?.("change", handleMotion)
      window.removeEventListener("resize", updatePreference)
    }
  }, [])

  const scrollToNext = () => {
    const eventsSection = document.getElementById("events")
    eventsSection?.scrollIntoView({ behavior: "smooth" })
  }

  const background = useMemo(() => {
    if (!playVideo) {
      return (
        <Image
          src={HERO_POSTER}
          alt="Sắc Màu Di Sản hero"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
      )
    }

    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={HERO_POSTER}
        onCanPlay={() => setVideoReady(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ backgroundColor: "#1f2937" }}
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    )
  }, [playVideo])

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#1f2937" }}
    >
      {background}

      {playVideo && !videoReady && (
        <Image
          src={HERO_POSTER}
          alt="Sắc Màu Di Sản hero fallback"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold mb-6 text-balance"
            style={{ color: "#fcd34d" }}
          >
            Sắc Màu Di Sản
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p
            className="text-xl sm:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-balance"
            style={{ color: "#fcd34d" }}
          >
            Khi văn hóa được chạm vào bằng cảm xúc và sáng tạo <br />
            di sản lại thức giấc trong đời sống hôm nay
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={scrollToNext}
          className="inline-flex flex-col items-center gap-2 transition-colors select-none cursor-pointer"
          style={{ color: "#fcd34d" }}
        >
          <span className="text-sm font-semibold">KÉO XUỐNG</span>
          <ChevronDown size={32} className="animate-bounce" />
        </motion.button>
      </div>
    </section>
  )
}
