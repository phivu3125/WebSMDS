"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { LotusPattern } from "../ui/lotus-pattern"
import Link from "next/link"
import { getEvents } from "@/lib/api/events"
import Image from "next/image"
import { resolveMediaUrl } from "@/lib/media"

type EventsSectionProps = {
  initialEvents?: any[]
}

export default function EventsSection({ initialEvents = [] }: EventsSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [events, setEvents] = useState<any[]>(initialEvents)
  const [loading, setLoading] = useState(initialEvents.length === 0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialEvents.length > 0) return

    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getEvents({ status: 'published' })

        // Handle both direct array and wrapped response
        const eventsArray = Array.isArray(data) ? data : (data.data || [])
        setEvents(eventsArray)
      } catch (error) {
        console.error('Failed to fetch events:', error)
        setError('Không thể tải sự kiện. Vui lòng thử lại sau.')
        setEvents([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    // Only fetch on client side
    if (typeof window !== 'undefined') {
      fetchEvents()
    }
  }, [initialEvents.length])

  const nextEvent = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length)
  }

  const prevEvent = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length)
  }

  if (loading) {
    return (
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">Đang tải sự kiện...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-red-500">{error}</div>
      </section>
    )
  }

  if (events.length === 0) {
    return (
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">Hiện chưa có sự kiện nào</div>
      </section>
    )
  }

  const currentEvent = events[currentIndex]

  return (
    <section
      id="events"
      ref={ref}
      className="relative w-full py-20 px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(135deg, rgb(115, 66, 186) 0%, #B668A1 100%)",
      }}
    >
      {/* SVG Pattern Overlay - LOTUS */}
      <LotusPattern
        patternId="events-lotus"
        patternSize={300}
        opacity={0.05}
        rotation={15}
        petalFill="#f7f5f5"
        pistilFill="#fae757"
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance" style={{ color: "#fcd34d" }}>
            SỰ KIỆN ĐANG DIỄN RA
          </h2>
          <div className="w-24 h-1 mx-auto" style={{ backgroundColor: "#fcd34d" }} />
        </motion.div>

        <div className="relative">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.05}
            onDragEnd={(event, info) => {
              const { offset, velocity } = info
              const swipeThreshold = 30

              if (offset.x > swipeThreshold || velocity.x > 300) {
                prevEvent()
              } else if (offset.x < -swipeThreshold || velocity.x < -300) {
                nextEvent()
              }
            }}
          >
            <div
              className="bg-white border rounded-lg shadow-md overflow-hidden"
              style={{
                borderColor: "#a78bfa",
              }}
            >
              <div className="w-full h-[28rem] relative overflow-hidden">
                <Image
                  src={resolveMediaUrl(currentEvent.image) || "/placeholder.svg"}
                  alt={currentEvent.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover rounded-t-lg"
                  priority={currentIndex === 0}
                  placeholder="blur"
                  blurDataURL="/placeholder.svg"
                />
              </div>

              <div className="p-8">
                <p className="text-sm font-semibold mb-2" style={{ color: "#fcd34d" }}>
                  {currentEvent.dateDisplay}
                </p>
                <h3 className="text-3xl font-serif font-bold mb-4" style={{ color: "#5b21b6" }}>
                  {currentEvent.title}
                </h3>
                <p className="text-base mb-6 leading-relaxed" style={{ color: "#1f2937" }}>
                  {currentEvent.description}
                </p>
                <Link
                  href={`/events/${currentEvent.slug}`}
                  className="w-full px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 select-none cursor-pointer block text-center"
                  style={{ backgroundColor: "#fcd34d" }}
                >
                  Tham gia ngay
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <button
            onClick={prevEvent}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-20 p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            aria-label="Sự kiện trước"
          >
            <ChevronLeft size={24} color="white" />
          </button>

          <button
            onClick={nextEvent}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-20 p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            aria-label="Sự kiện tiếp theo"
          >
            <ChevronRight size={24} color="white" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="relative z-10 flex justify-center gap-3 mt-12">
          {events.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Đi tới sự kiện ${index + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${currentIndex === index ? "w-8" : "w-3"} h-3`}
              style={{
                backgroundColor: currentIndex === index ? "#fcd34d" : "rgba(255, 255, 255, 0.5)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
