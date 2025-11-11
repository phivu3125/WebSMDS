"use client"

import dynamic from "next/dynamic"
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, X } from "lucide-react"
import { getEventBySlug, submitEventRegistration } from "@/lib/api/events"
import { resolveMediaUrl } from "@/lib/media"

const LotusPattern = dynamic(
    () => import("@/components/ui/lotus-pattern").then(mod => mod.LotusPattern),
    {
        ssr: false,
        loading: () => null,
    }
)

const Footer = dynamic(
    () => import("@/components/layout/Footer").then(mod => mod.Footer),
    {
        loading: () => null,
    }
)

interface EventSection {
    id: string
    title: string
    items: string[]
    position: number
}

interface Event {
    id: string
    slug: string
    title: string
    description: string
    fullDescription?: string
    image?: string
    location?: string
    openingHours?: string
    dateDisplay?: string
    venueMap?: string
    pricingImage?: string
    sections?: EventSection[]
}

export default function EventDetailPage() {
    const params = useParams<{ slug: string }>()
    const slug = params?.slug
    const router = useRouter()
    const [event, setEvent] = useState<Event | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        note: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
    const [phoneError, setPhoneError] = useState<string | null>(null)
    const sortedSections = useMemo(() => {
        if (!event?.sections?.length) return []
        return [...event.sections].sort((a, b) => a.position - b.position)
    }, [event?.sections])

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual'
        }
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        let isMounted = true

        const fetchEvent = async () => {
            if (!slug) {
                if (isMounted) {
                    setEvent(null)
                    setError("Không tìm thấy sự kiện")
                    setIsLoading(false)
                }
                return
            }

            try {
                if (isMounted) {
                    setIsLoading(true)
                    setError(null)
                }

                const data = await getEventBySlug(slug)

                if (isMounted) {
                    setEvent(data)
                }
            } catch (err) {
                console.error("Failed to fetch event:", err)
                if (isMounted) {
                    setError("Không thể tải thông tin sự kiện. Vui lòng thử lại sau.")
                    setEvent(null)
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        fetchEvent()

        return () => {
            isMounted = false
        }
    }, [slug])

    const handleOpenRegisterModal = () => {
        setSubmitError(null)
        setPhoneError(null)
        setIsRegisterModalOpen(true)
    }
    const handleCloseRegisterModal = () => {
        setIsRegisterModalOpen(false)
        setSubmitError(null)
        setPhoneError(null)
    }

    const handleRegisterInputChange = (field: keyof typeof formData) => (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }))

        if (field === "phone") {
            const value = event.target.value
            if (!value.trim()) {
                setPhoneError(null)
                return
            }

            if (isValidPhoneNumber(value)) {
                setPhoneError(null)
            }
        }
    }

    const isValidPhoneNumber = (value: string) => {
        const trimmed = value.trim()
        if (!trimmed) return false

        const normalized = trimmed.replace(/[\s.-]/g, '')
        const vnPhonePattern = /^(?:\+84|84|0)(?:[35789]\d{8})$/

        return vnPhonePattern.test(normalized)
    }

    const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!slug || typeof slug !== "string") return

        setSubmitError(null)
        setSubmitSuccess(null)
        setPhoneError(null)

        if (!isValidPhoneNumber(formData.phone)) {
            setPhoneError("Số điện thoại không hợp lệ.")
            return
        }

        const normalizedPhone = formData.phone.trim().replace(/[\s.-]/g, '')
        setIsSubmitting(true)

        try {
            await submitEventRegistration(slug, {
                fullName: formData.fullName.trim(),
                email: formData.email.trim() || undefined,
                phone: normalizedPhone,
                note: formData.note.trim() || undefined,
            })

            setSubmitSuccess("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.")
            setFormData({ fullName: "", email: "", phone: "", note: "" })
            handleCloseRegisterModal()
        } catch (error: any) {
            const message = error?.message || "Không thể gửi đăng ký. Vui lòng thử lại."
            setSubmitError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-gray-600">Đang tải thông tin sự kiện...</p>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: "#5b21b6" }}>
                        {error}
                    </h2>
                    <button
                        onClick={() => router.push("")}
                        className="px-6 py-3 rounded-full text-white font-semibold"
                        style={{ backgroundColor: "#fcd34d" }}
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            </main>
        )
    }

    if (!event) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: "#5b21b6" }}>
                        Không tìm thấy sự kiện
                    </h2>
                    <button
                        onClick={() => router.push("/#events")}
                        className="px-6 py-3 rounded-full text-white font-semibold"
                        style={{ backgroundColor: "#fcd34d" }}
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen overflow-x-hidden bg-gray-50">
            {/* Hero Section */}
            <section
                id="event_hero"
                className="relative w-full pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgb(115, 66, 186) 0%, #B668A1 100%)",
                }}
            >
                <div style={{ pointerEvents: 'none' }}>
                    <LotusPattern
                        patternId="event-detail-lotus"
                        patternSize={300}
                        opacity={0.05}
                        rotation={15}
                        petalFill="#f7f5f5"
                        pistilFill="#fae757"
                    />
                </div>

                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ position: 'relative', zIndex: 1 }}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                if (typeof window !== "undefined" && window.history.length > 1) {
                                    router.back()
                                } else {
                                    router.push("/")
                                }
                            }}
                            className="flex items-center gap-2 text-white mb-8 hover:gap-3 transition-all duration-300 cursor-pointer group"
                            style={{ position: 'relative', zIndex: 2 }}
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold">Quay lại</span>
                        </button>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-white" 
                        style={{ position: 'relative', zIndex: 1 }}
                    >
                        <div className="mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="text-sm font-medium">Sự kiện đang diễn ra</span>
                            </div>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                            <span className="block bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                                {event.title}
                            </span>
                        </h1>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8">
                            {event.dateDisplay && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70">Thời gian</p>
                                        <p className="font-semibold">{event.dateDisplay}</p>
                                    </div>
                                </div>
                            )}
                            
                            {event.location && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70">Địa điểm</p>
                                        <p className="font-semibold">{event.location}</p>
                                    </div>
                                </div>
                            )}
                            
                            {event.openingHours && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70">Giờ mở cửa</p>
                                        <p className="font-semibold">{event.openingHours}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <button
                                onClick={handleOpenRegisterModal}
                                className="px-8 py-4 rounded-full text-purple-900 font-semibold bg-yellow-300 hover:bg-yellow-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
                            >
                                Đăng ký tham gia
                            </button>
                            <button
                                onClick={() => {
                                    const element = document.getElementById('event_content')
                                    element?.scrollIntoView({ behavior: 'smooth' })
                                }}
                                className="px-8 py-4 rounded-full text-white font-semibold border-2 border-white/30 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer"
                            >
                                Xem chi tiết
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8" id="event_content">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8 flex items-center justify-center">
                                    <img
                                        src={resolveMediaUrl(event.image) || "/placeholder.svg"}
                                        alt={event.title}
                                        className="w-full max-h-[28rem] object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                                    <h2
                                        className="text-3xl font-serif font-bold mb-4"
                                        style={{ color: "#5b21b6" }}
                                    >
                                        Về sự kiện
                                    </h2>
                                    {event.fullDescription && (
                                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                            {event.fullDescription}
                                        </p>
                                    )}
                                </div>

                                {sortedSections.map((section, idx) => (
                                    <div
                                        key={section.id ?? `${section.title}-${idx}`}
                                        className="bg-white rounded-lg shadow-md p-8 mb-8"
                                    >
                                        <h2
                                            className="text-3xl font-serif font-bold mb-6"
                                            style={{ color: "#5b21b6" }}
                                        >
                                            {section.title}
                                        </h2>
                                        <div className="space-y-4">
                                            {section.items.map((item, itemIdx) => (
                                                <div key={itemIdx} className="flex items-start gap-3">
                                                    <span
                                                        className="mt-2 w-2 h-2 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: "#fcd34d" }}
                                                    />
                                                    <p className="text-gray-700 text-lg leading-relaxed">
                                                        {item}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {event.venueMap && (
                                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                                        <h2
                                            className="text-3xl font-serif font-bold mb-6"
                                            style={{ color: "#5b21b6" }}
                                        >
                                            Sơ đồ địa điểm
                                        </h2>
                                        <div className="w-full aspect-video relative overflow-hidden rounded-lg">
                                            <img
                                                src={resolveMediaUrl(event.venueMap)}
                                                alt="Sơ đồ địa điểm sự kiện"
                                                className="w-full h-full object-cover bg-gray-100"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                        <p className="text-gray-600 text-sm mt-4 italic">
                                            Sơ đồ chi tiết các khu vực hoạt động và gian hàng tại sự kiện
                                        </p>
                                    </div>
                                )}

                                {event.pricingImage && (
                                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                                        <h2
                                            className="text-3xl font-serif font-bold mb-6"
                                            style={{ color: "#5b21b6" }}
                                        >
                                            Bảng giá vé
                                        </h2>
                                        <div className="w-full overflow-hidden rounded-lg border border-gray-100">
                                            <img
                                                src={resolveMediaUrl(event.pricingImage)}
                                                alt="Bảng giá vé sự kiện"
                                                className="w-full h-[28rem] object-cover bg-gray-50"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="sticky top-24"
                            >
                                {/* Event Info Card */}
                                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                    <h3
                                        className="text-xl font-serif font-bold mb-4"
                                        style={{ color: "#5b21b6" }}
                                    >
                                        Thông tin sự kiện
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-gray-600 mb-1">Thời gian</p>
                                            <p className="font-semibold text-gray-800">
                                                {event.dateDisplay || "Đang cập nhật"}
                                            </p>
                                        </div>
                                        {event.openingHours && (
                                            <div>
                                                <p className="text-gray-600 mb-1">Giờ mở cửa</p>
                                                <p className="font-semibold text-gray-800">{event.openingHours}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-gray-600 mb-1">Địa điểm</p>
                                            <p className="font-semibold text-gray-800">{event.location}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Registration Card */}
                                <div
                                    className="bg-white rounded-lg shadow-md p-6 mb-6"
                                    style={{ borderTop: "4px solid #7342ba" }}
                                >
                                    <h3
                                        className="text-2xl font-serif font-bold mb-3"
                                        style={{ color: "#5b21b6" }}
                                    >
                                        Đăng ký tham gia
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Để lại thông tin liên hệ, chúng tôi sẽ gửi lịch chi tiết và các quyền lợi tham dự.
                                    </p>
                                    <button
                                        onClick={handleOpenRegisterModal}
                                        className="w-full px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:shadow-lg cursor-pointer"
                                        style={{ backgroundColor: "#fcd34d" }}
                                    >
                                        Đăng ký ngay
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Registration Modal */}
            {isRegisterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={handleCloseRegisterModal}
                        aria-hidden="true"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
                    >
                        <button
                            type="button"
                            onClick={handleCloseRegisterModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                            aria-label="Đóng form đăng ký"
                        >
                            <X size={20} />
                        </button>
                        <h3
                            className="text-2xl font-serif font-bold mb-2"
                            style={{ color: "#5b21b6" }}
                        >
                            Đăng ký tham gia {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Điền thông tin bên dưới để chúng tôi liên hệ và gửi đến bạn các cập nhật mới nhất về sự kiện.
                        </p>
                        <form className="space-y-5" onSubmit={handleRegisterSubmit}>
                            {submitError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {submitError}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700" htmlFor="fullName">
                                    Họ và tên*
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleRegisterInputChange("fullName")}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700" htmlFor="email">
                                    Email liên hệ
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleRegisterInputChange("email")}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700" htmlFor="phone">
                                    Số điện thoại*
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={handleRegisterInputChange("phone")}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                                    placeholder="0987 654 321"
                                />
                                {phoneError && (
                                    <p className="text-xs text-red-600">{phoneError}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700" htmlFor="note">
                                    Lời nhắn (tuỳ chọn)
                                </label>
                                <textarea
                                    id="note"
                                    rows={3}
                                    value={formData.note}
                                    onChange={handleRegisterInputChange("note")}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                                    placeholder="Bạn mong muốn tham gia hoạt động nào?"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseRegisterModal}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full sm:w-auto px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:shadow-lg cursor-pointer ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                                    style={{ backgroundColor: "#7342ba" }}
                                >
                                    {isSubmitting ? "Đang gửi..." : "Gửi thông tin"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {submitSuccess && (
                <div className="fixed bottom-6 right-6 z-40 max-w-sm rounded-xl border border-green-200 bg-white p-4 shadow-lg">
                    <div className="text-sm font-semibold text-green-700">
                        {submitSuccess}
                    </div>
                    <button
                        onClick={() => setSubmitSuccess(null)}
                        className="mt-3 text-xs font-medium text-green-600 hover:text-green-800"
                    >
                        Đóng
                    </button>
                </div>
            )}

            <Footer />
        </main>
    )
}