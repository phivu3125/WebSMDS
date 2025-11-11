"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PastEventListItem } from "@/types/PastEvent"

interface EventsByYear {
    [year: number]: PastEventListItem[]
}

export default function PastEventsSection() {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
    const [showFullIntro, setShowFullIntro] = useState(false)
    const [selectedYear, setSelectedYear] = useState<number | "all">("all")
    const [events, setEvents] = useState<PastEventListItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/past-events`)
            const data = await res.json()
            setEvents(data)
        } catch (error) {
            console.error("Error fetching events:", error)
        } finally {
            setLoading(false)
        }
    }

    // Group events by year
    const eventsByYear: EventsByYear = events.reduce((acc, event) => {
        if (!acc[event.year]) {
            acc[event.year] = []
        }
        acc[event.year].push(event)
        return acc
    }, {} as EventsByYear)

    const years = Object.keys(eventsByYear)
        .map(Number)
        .sort((a, b) => b - a)

    const filteredEvents =
        selectedYear === "all"
            ? Object.values(eventsByYear).flat()
            : eventsByYear[selectedYear as keyof typeof eventsByYear] || []

    return (
        <section
            id="past_events"
            ref={ref}
            className="relative w-full py-20 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: "#FAF9F6" }}
        >
            {/* SVG Pattern Background */}
            <svg
                className="absolute inset-0 w-full h-full opacity-5"
                viewBox="0 0 1200 800"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <pattern
                        id="lotus-pattern-events"
                        x="0"
                        y="0"
                        width="300"
                        height="300"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="150" cy="150" r="100" fill="none" stroke="#B668A1" strokeWidth="2" />
                        <circle cx="150" cy="150" r="70" fill="none" stroke="#B668A1" strokeWidth="1.5" />
                    </pattern>
                </defs>
                <rect width="1200" height="800" fill="url(#lotus-pattern-events)" />
            </svg>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2
                        className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance"
                        style={{ color: "#D4AF37" }}
                    >
                        NHỮNG MÙA SẮC ĐÃ ĐI QUA
                    </h2>
                    <div className="w-24 h-1 mx-auto" style={{ backgroundColor: "#D4AF37" }} />
                </motion.div>

                {/* Introduction Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-3xl mx-auto mb-16"
                >
                    <p
                        className="text-center text-xl md:text-2xl italic leading-relaxed mb-4"
                        style={{ color: "#1f2937" }}
                    >
                        “Mỗi mùa là một sắc màu, mỗi sắc màu là một mảnh ghép của nét đẹp văn hóa Việt Nam.”
                    </p>

                    <AnimatePresence>
                        {showFullIntro && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 px-6 md:px-12">
                                    <p
                                        className="text-center text-base md:text-lg leading-relaxed"
                                        style={{ color: "#4b5563" }}
                                    >
                                        Có những hành trình không đo bằng thời gian, mà đo bằng những <span className="font-bold">mùa ký ức</span> — nơi
                                        mỗi lần dừng chân, ta lại tìm thấy thêm một sắc thái mới của văn hóa Việt.
                                        <br />
                                        <br />
                                        Với chúng tôi, mỗi "mùa" của Sắc Màu Di Sản chính là một <span className="font-bold">chặng khám phá</span>, một
                                        <span className="font-bold"> mảnh ghép sống động</span> trong bức tranh di sản chung.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={() => setShowFullIntro(!showFullIntro)}
                        className="flex items-center gap-2 mx-auto mt-4 px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 select-none cursor-pointer"
                        style={{
                            backgroundColor: "transparent",
                            color: "#B668A1",
                            border: "2px solid #B668A1",
                        }}
                    >
                        {showFullIntro ? "Thu gọn" : "Tìm hiểu thêm"}
                        {showFullIntro ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </motion.div>

                {/* Year Filter Pills */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    <button
                        onClick={() => setSelectedYear("all")}
                        className="px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 select-none cursor-pointer"
                        style={{
                            backgroundColor: selectedYear === "all" ? "#D4AF37" : "white",
                            color: selectedYear === "all" ? "white" : "#B668A1",
                            border: `2px solid ${selectedYear === "all" ? "#D4AF37" : "#B668A1"}`,
                        }}
                    >
                        Tất cả
                    </button>
                    {years.map((year) => (
                        <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className="px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 select-none cursor-pointer"
                            style={{
                                backgroundColor: selectedYear === year ? "#D4AF37" : "white",
                                color: selectedYear === year ? "white" : "#B668A1",
                                border: `2px solid ${selectedYear === year ? "#D4AF37" : "#B668A1"}`,
                            }}
                        >
                            {year}
                        </button>
                    ))}
                </motion.div>

                {/* Masonry Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                >
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-lg" style={{ color: "#6b7280" }}>
                                Đang tải...
                            </p>
                        </div>
                    ) : (
                        filteredEvents.map((event: PastEventListItem, index: number) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="break-inside-avoid"
                            >
                                <Link href={`/past-events/${event.slug}`} className="block">
                                    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-[#B668A1]">
                                        <div className="relative h-52 w-full overflow-hidden">
                                            <Image
                                                src={event.thumbnailImage || "/placeholder.svg"}
                                                alt={event.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 400px"
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 select-none"
                                            />
                                        </div>

                                        <div className="p-5 space-y-4">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                                    Sự kiện đã diễn ra
                                                </span>
                                                <span className="px-3 py-1 text-xs font-semibold text-white rounded-full" style={{ backgroundColor: "#D4AF37" }}>
                                                    {event.year}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-serif font-bold leading-tight" style={{ color: "#1f2937" }}>
                                                {event.title}
                                            </h3>

                                            {event.description && (
                                                <p className="text-sm text-gray-600 line-clamp-3">
                                                    {event.description}
                                                </p>
                                            )}

                                            <div className="pt-2">
                                                <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "#B668A1" }}>
                                                    Xem chi tiết
                                                    <ChevronRight size={16} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* Empty State */}
                {filteredEvents.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-lg" style={{ color: "#6b7280" }}>
                            Chưa có sự kiện nào trong năm này
                        </p>
                    </div>
                )}

                {/* Closing Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-20 max-w-4xl mx-auto text-center"
                >
                    <div className="flex justify-center mb-6">
                        <svg className="w-32 h-1" viewBox="0 0 128 4" fill="none">
                            <path d="M0 2 Q32 0 64 2 Q96 4 128 2" stroke="#D4AF37" strokeWidth="2" />
                        </svg>
                    </div>
                    <p
                        className="text-lg md:text-xl leading-relaxed px-6"
                        style={{ color: "#1f2937" }}
                    >
                        Chúng tôi tin rằng, khi những “mùa sắc” ấy tiếp nối nhau, chúng sẽ tạo nên một <span className="font-bold">hành trình không ngừng lan tỏa</span> — nơi di sản không chỉ được lưu giữ, mà còn được chạm vào
                        bằng những giác quan và cảm xúc, <span className="italic">được sống, được yêu, và được truyền tiếp.</span>
                    </p>
                </motion.div>
            </div>
        </section>
    )
}