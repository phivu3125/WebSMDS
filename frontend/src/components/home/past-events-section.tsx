"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import Image from "next/image"

// Mock data - thay bằng API call sau
const eventsByYear = {
    2024: [
        {
            id: 1,
            title: "Triển lãm Nghệ thuật Dân gian Đông Hồ",
            image: "/events/event1.jpg",
            slug: "trien-lam-dong-ho-2024"
        },
        {
            id: 2,
            title: "Workshop Thêu Truyền Thống",
            image: "/events/event2.jpg",
            slug: "workshop-theu-2024"
        },
        {
            id: 3,
            title: "Hội thảo Di sản Số",
            image: "/events/event3.jpg",
            slug: "hoi-thao-di-san-so-2024"
        },
        {
            id: 4,
            title: "Festival Áo Dài Việt Nam",
            image: "/events/event4.jpg",
            slug: "festival-ao-dai-2024"
        },
    ],
    2023: [
        {
            id: 5,
            title: "Triển lãm Tranh Lụa Hà Đông",
            image: "/events/event5.jpg",
            slug: "trien-lam-lua-ha-dong-2023"
        },
        {
            id: 6,
            title: "Chợ Tết Xưa",
            image: "/events/event6.jpg",
            slug: "cho-tet-xua-2023"
        },
        {
            id: 7,
            title: "Làng Nghề Truyền Thống",
            image: "/events/event7.jpg",
            slug: "lang-nghe-2023"
        },
    ],
    2022: [
        {
            id: 8,
            title: "Gala Nghệ Thuật Dân Gian",
            image: "/events/event8.jpg",
            slug: "gala-nghe-thuat-2022"
        },
        {
            id: 9,
            title: "Triển lãm Gốm Sứ Việt",
            image: "/events/event9.jpg",
            slug: "trien-lam-gom-su-2022"
        },
    ],
}

export default function PastEventsSection() {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
    const [showFullIntro, setShowFullIntro] = useState(false)
    const [selectedYear, setSelectedYear] = useState<number | "all">("all")

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
                    {filteredEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="break-inside-avoid"
                        >
                            <div
                                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                style={{
                                    border: "2px solid transparent",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#B668A1"
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "transparent"
                                }}
                            >
                                {/* Image */}
                                <div className="relative overflow-hidden">
                                    <div className="relative w-full" style={{ aspectRatio: index % 2 === 0 ? "4/3" : "3/4" }}>
                                        <Image
                                            src={event.image || "/placeholder.svg"}
                                            alt={event.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 400px"
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 select-none"
                                            priority={index === 0}
                                            placeholder="blur"
                                            blurDataURL="/placeholder.svg"
                                        />
                                    </div>
                                    {/* Overlay on Hover */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                                        style={{
                                            background:
                                                "linear-gradient(to top, rgba(182, 104, 161, 0.9), rgba(212, 175, 55, 0.7))",
                                        }}
                                    >
                                        <ExternalLink size={32} color="white" />
                                    </div>
                                </div>

                                {/* Title & CTA */}
                                <div className="p-4">
                                    <h3
                                        className="font-serif text-lg font-bold mb-3 line-clamp-2"
                                        style={{ color: "#1f2937" }}
                                    >
                                        {event.title}
                                    </h3>
                                    <button
                                        className="w-full py-2 rounded-full font-semibold text-sm transition-all duration-300 select-none cursor-pointer"
                                        style={{
                                            backgroundColor: "#B668A1",
                                            color: "white",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "#D4AF37"
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "#B668A1"
                                        }}
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
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