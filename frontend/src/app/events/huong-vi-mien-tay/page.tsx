"use client"

import { useState, FormEvent, ChangeEvent } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, X } from "lucide-react"

// Dữ liệu tĩnh cho sự kiện Hương Vị Miền Tây
const huongViMiengTayData = {
    title: "Hương Vị Miền Tây - Thiên đường ẩm thực Đồng bằng sông Cửu Long",
    thumbnailImage: "/images/past-events/huong-vi-mien-tay.jpg",
    image: "/images/past-events/huong-vi-mien-tay.jpg",
    dateDisplay: "20-22 tháng 4, 2024",
    location: "Công viên văn hóa Đầm Sen, TP.HCM",
    openingHours: "9:00 - 22:00",
    year: 2024,
    intro: `
        <p>Từ những con rạch nhỏ đến những cánh đồng mênh mông, miền Tây Nam Bộ là nơi hội tụ của hàng trăm món ăn đặc sắc, mang đậm dấu ấn của đất trời và con người. Sự kiện Hương Vị Miền Tây không chỉ là một lễ hội ẩm thực, mà còn là hành trình khám phá văn hóa ẩm thực độc đáo của vùng đất phương Nam.</p>
    `,
    sections: [
        {
            title: "Đặc sắc ẩm thực miền Tây",
            content: `
                <p>Ẩm thực miền Tây Tây Nam Bộ là sự hòa quyện giữa <strong>tự nhiên</strong> và <strong>nghệ thuật ẩm thực</strong> của người dân nơi đây. Với nguồn nguyên liệu phong phú từ sông nước, những món ăn mang hương vị đặc trưng không nơi nào có được:</p>
                <br/>
                <ul>
                    <li><strong>Cá lóc nướng trui</strong> - vị ngọt tự nhiên của cá sông nước thơm lừng lá sen non</li>
                    <li><strong>Lẩu mắm</strong> - hương vị đậm đà đặc trưng của người miền Tây</li>
                    <li><strong>Bánh xèo</strong> - giòn tan, hấp dẫn với nước chấm tinh túy</li>
                    <li><strong>Cơm tấm Ba Rịa</strong> - hạt cơm dẻo thơm, sườn nướng mềm ngọt</li>
                    <li><strong>Bánh khọt</strong> - nhỏ xinh nhưng đậm vị quê hương</li>
                </ul>
            `
        },
        {
            title: "Không gian trải nghiệm",
            content: `
                <p>Sự kiện được thiết kế như một làng quê miền Tây thu nhỏ, nơi du khách không chỉ ăn ngon mà còn được <strong>trải nghiệm văn hóa</strong> chân thực:</p>
                <br/>
                <ul>
                    <li><strong>Khu ẩm thực ngoài trời</strong> với những chòi lá ven sân khấu</li>
                    <li><strong>Thuyền ba lá</strong> neo đậu bên bờ, nơi phục vụ các món ăn sông nước</li>
                    <li><strong>Cây cầu tre</strong> dẫn đến các khu vực trải nghiệm nghề truyền thống</li>
                    <li><strong>Sân khấu ca nhạc</strong> với các bài đờn ca tài tử đặc sắc</li>
                    <li><strong>Gian hàng thủ công</strong> trưng bày các sản phẩm đặc sản miền Tây</li>
                </ul>
                <br/>
                <p>Mỗi góc không gian đều được chăm chút để mang lại cảm giác như đang ở giữa một làng quê miền Tây thật sự.</p>
            `
        },
        {
            title: "Hoạt động văn hóa đặc sắc",
            content: `
                <p>Ngoài việc thưởng thức ẩm thực, sự kiện còn có nhiều hoạt động văn hóa độc đáo:</p>
                <br/>
                <ul>
                    <li><strong>Nhờ đờn ca tài tử</strong> - Di sản văn hóa phi vật thể của nhân loại</li>
                    <li><strong>Thi làm bánh</strong> - Hướng dẫn làm bánh xèo, bánh khọt từ nghệ nhân địa phương</li>
                    <li><strong>Câu cá dưới ao</strong> - Trải nghiệm làm nông dân miền Tây</li>
                    <li><strong>Múa lân sư rồng</strong> - Màn trình diễn nghệ thuật truyền thống</li>
                    <li><strong>Kể chuyện miệt vườn</strong> - Những giai thoại về văn hóa sông nước</li>
                </ul>
                <p>Các hoạt động này không chỉ giải trí mà còn giúp du khách hiểu sâu hơn về văn hóa miền Tây.</p>
            `
        },
        {
            title: "Giá trị và ý nghĩa",
            content: `
                <p>Hương Vị Miền Tây không chỉ là một sự kiện ẩm thực, mà còn là cơ hội để:</p>
                <br/>
                <ul>
                    <li><strong>Bảo tồn văn hóa</strong> - Giới thiệu và quảng bá giá trị văn hóa ẩm thực miền Tây</li>
                    <li><strong>Kết nối thế hệ</strong> - Tạo không gian giao lưu giữa nghệ nhân và thế hệ trẻ</li>
                    <li><strong>Thúc đẩy du lịch</strong> - Khuyến khích du lịch văn hóa và trải nghiệm</li>
                    <li><strong>Hỗ trợ nông dân</strong> - Tạo thị trường cho nông sản địa phương</li>
                    <li><strong>Gắn kết cộng đồng</strong> - Tạo niềm tự hào và sức mạnh cộng đồng</li>
                </ul>
                <br/>
                <p>Thông qua ẩm thực, chúng tôi muốn kể câu chuyện về một miền Tây giàu bản sắc, hiếu khách và đầy tiềm năng.</p>
            `
        },
        {
            title: "Thông điệp lan tỏa",
            content: `
                <p>"Ăn ngon để sống vui, sống vui để ăn ngon" - đó là triết lý sống của người miền Tây. Món ăn không chỉ để no bụng, mà còn là <strong>cách thể hiện tình yêu cuộc sống</strong>, sự trân trọng thiên nhiên và tình người.</p>
                <br/>
                <p>Sự kiện Hương Vị Miền Tây mong muốn lan tỏa thông điệp:</p>
                <ul>
                    <li>Hãy <strong>chậm lại</strong> để thưởng thức từng món ăn, từng hương vị</li>
                    <li>Hãy <strong>trân trọng</strong> những gì thiên nhiên ban tặng</li>
                    <li>Hãy <strong>gìn giữ</strong> những giá trị văn hóa của cha ông</li>
                    <li>Hãy <strong>chia sẻ</strong> những câu chuyện, những công thức ẩm thực quý giá</li>
                </ul>
                <p>Vì mỗi món ăn đều chứa đựng một câu chuyện, và mỗi câu chuyện đều đáng để được kể.</p>
            `
        }
    ]
}

export default function HuongViMienTayPage() {
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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            setSubmitSuccess("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.")
            setFormData({ fullName: "", email: "", phone: "", note: "" })
            handleCloseRegisterModal()
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Không thể gửi đăng ký. Vui lòng thử lại."
            setSubmitError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen overflow-x-hidden bg-[#FAF9F6]">
            {/* Hero Section */}
            <section
                className="relative w-full pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgb(115, 66, 186) 0%, #B668A1 100%)",
                }}
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        style={{ position: 'relative', zIndex: 1 }}
                    >
                        <Link
                            href="/#events"
                            className="inline-flex items-center gap-2 text-white mb-8 hover:gap-3 transition-all duration-300 cursor-pointer group"
                            style={{ position: 'relative', zIndex: 2 }}
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold">Quay lại</span>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
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
                                {huongViMiengTayData.title}
                            </span>
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8">
                            {huongViMiengTayData.dateDisplay && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70">Thời gian</p>
                                        <p className="font-semibold">{huongViMiengTayData.dateDisplay}</p>
                                    </div>
                                </div>
                            )}

                            {huongViMiengTayData.location && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70">Địa điểm</p>
                                        <p className="font-semibold">{huongViMiengTayData.location}</p>
                                    </div>
                                </div>
                            )}

                            {huongViMiengTayData.openingHours && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70">Giờ mở cửa</p>
                                        <p className="font-semibold">{huongViMiengTayData.openingHours}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
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
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8 flex items-center justify-center">
                                    <Image
                                        src={huongViMiengTayData.image || "/placeholder.svg"}
                                        alt={huongViMiengTayData.title}
                                        width={800}
                                        height={400}
                                        className="w-full max-h-[28rem] object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                                    <h2
                                        className="text-3xl font-serif font-bold mb-4"
                                        style={{ color: "#B668A1" }}
                                    >
                                        Về sự kiện
                                    </h2>
                                    <div
                                        className="prose prose-lg max-w-none"
                                        style={{ color: "#1f2937" }}
                                        dangerouslySetInnerHTML={{ __html: huongViMiengTayData.intro }}
                                    />
                                </div>

                                {huongViMiengTayData.sections.map((section, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-lg shadow-md p-8 mb-8"
                                    >
                                        <h2
                                            className="text-3xl font-serif font-bold mb-6"
                                            style={{ color: "#B668A1" }}
                                        >
                                            {section.title}
                                        </h2>
                                        <div
                                            className="prose prose-lg max-w-none [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2 [&>ul>li]:leading-relaxed [&>ul>li]:marker:text-[#B668A1]"
                                            style={{ color: "#1f2937" }}
                                            dangerouslySetInnerHTML={{ __html: section.content }}
                                        />
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="sticky top-24"
                            >
                                {/* Event Info Card */}
                                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                    <h3
                                        className="text-xl font-serif font-bold mb-4"
                                        style={{ color: "#B668A1" }}
                                    >
                                        Thông tin sự kiện
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-gray-600 mb-1">Thời gian</p>
                                            <p className="font-semibold text-gray-800">
                                                {huongViMiengTayData.dateDisplay || "Đang cập nhật"}
                                            </p>
                                        </div>
                                        {huongViMiengTayData.openingHours && (
                                            <div>
                                                <p className="text-gray-600 mb-1">Giờ mở cửa</p>
                                                <p className="font-semibold text-gray-800">{huongViMiengTayData.openingHours}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-gray-600 mb-1">Địa điểm</p>
                                            <p className="font-semibold text-gray-800">{huongViMiengTayData.location}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Registration Card */}
                                <div
                                    className="bg-white rounded-lg shadow-md p-6 mb-6"
                                    style={{ borderTop: "4px solid #B668A1" }}
                                >
                                    <h3
                                        className="text-2xl font-serif font-bold mb-3"
                                        style={{ color: "#B668A1" }}
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
                            style={{ color: "#B668A1" }}
                        >
                            Đăng ký tham gia {huongViMiengTayData.title}
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
                                    style={{ backgroundColor: "#B668A1" }}
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
        </main>
    )
}