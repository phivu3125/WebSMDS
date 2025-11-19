"use client"

import { useState, FormEvent, ChangeEvent } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, X } from "lucide-react"

// Dữ liệu tĩnh cho sự kiện INNOCULTURE 2025
const innoculture2025Data = {
    title: "Triển Lãm – Ngày Hội Công Nghiệp Văn Hóa Việt Nam 2025",
    subtitle: "Nơi Sáng Tạo Văn Hóa Giao Thoa Công Nghệ",
    thumbnailImage: "/images/events/inno-thumbnail.png",
    image: "/images/events/inno-thumbnail.png",
    dateDisplay: "14 – 17/11/2025",
    location: "SIHUB – 123 Trương Định, P. Xuân Hoà, TP.HCM",
    openingHours: "8h00 – 17h00 hàng ngày",
    year: 2025,
    intro: `
        <p>Khi văn hoá Việt được kể bằng ngôn ngữ của thời đại số</p>
        <br/>
        <p>Từ ngày 14 đến 17/11/2025, tại SIHUB – Trung tâm Hỗ trợ Khởi nghiệp và Đổi mới sáng tạo TP.HCM (123 Trương Định, phường Xuân Hoà, TP.HCM), sự kiện Triển lãm – Ngày hội Công nghiệp Văn hóa Việt Nam 2025 chính thức diễn ra, mang đến một không gian hội tụ giữa sáng tạo, công nghệ và bản sắc Việt.</p>
        <br/>
        <p>Với chủ đề <strong>"Nơi sáng tạo văn hoá giao thoa công nghệ"</strong>, chương trình là điểm nhấn trong chuỗi hoạt động hướng tới việc thúc đẩy sự phát triển của công nghiệp văn hoá Việt Nam, khơi mở cách tiếp cận mới – nơi văn hoá không chỉ được lưu giữ, mà còn được tái sinh mỗi ngày bằng trí tuệ và công nghệ Việt.</p>
    `,
    content: `
        <h2 style="color: #7342ba; font-size: 2rem; margin: 2rem 0 1rem 0; font-family: 'serif'; font-weight: 700;">Không gian giao thoa giữa truyền thống và tương lai</h2>

        <p style="font-size: 1.125rem; line-height: 1.8; margin-bottom: 1rem;">Tại Ngày hội, khách tham quan sẽ được "bước vào" một thế giới nơi di sản và công nghệ gặp nhau, nơi câu chuyện văn hoá dân tộc được kể lại bằng ngôn ngữ của thời đại số.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Các khu trưng bày, triển lãm và hoạt động trải nghiệm được thiết kế mang tính tương tác cao, kết hợp giữa AR, VR, trình chiếu đa phương tiện, game, phim ảnh, thiết kế và mỹ thuật số – mang lại cảm giác vừa gần gũi vừa mới mẻ.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Không gian còn là nơi quy tụ sáng tạo từ 12 lĩnh vực văn hoá tiêu biểu: Điện ảnh – Nghệ thuật biểu diễn – Mỹ thuật & Triển lãm – Thiết kế – Thời trang – Thủ công mỹ nghệ – Truyền hình – Quảng cáo – Kiến trúc – Trò chơi giải trí – Xuất bản – Du lịch văn hoá.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Từ những sản phẩm khởi nghiệp sáng tạo đến các dự án nghệ thuật đương đại, từ công nghệ kể chuyện tương tác đến thiết kế ứng dụng văn hoá Việt – tất cả cùng hòa quyện, tạo nên một "bức tranh đa chiều" về nền công nghiệp văn hoá Việt Nam đang chuyển mình mạnh mẽ.</p>

        <h2 style="color: #7342ba; font-size: 2rem; margin: 2rem 0 1rem 0; font-family: 'serif'; font-weight: 700;">CultureTech – Khi công nghệ trở thành cầu nối cho di sản</h2>

        <p style="font-size: 1.125rem; line-height: 1.8;">Điểm nhấn đặc biệt của chương trình là Tọa đàm chuyên đề "CultureTech và mô hình hợp tác công – tư trong bảo tồn và lan tỏa di sản văn hoá", diễn ra lúc 14:00 – 16:00, ngày 14/11/2025 tại hội trường SIHUB.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Buổi tọa đàm do SIHUB phối hợp cùng Santani tổ chức, quy tụ nhiều chuyên gia, nghệ sĩ, doanh nhân sáng tạo và đại diện các tổ chức văn hoá để cùng đối thoại về vai trò của công nghệ trong việc bảo tồn, giáo dục và phát triển di sản Việt.</p>

        <blockquote style="border-left: 4px solid rgb(253, 224, 71); padding: 1.5rem; margin: 2rem 0; background-color: #fef9e7; border-radius: 8px;">
            <h3 style="margin-bottom: 1rem; font-weight: 600;">Nội dung nổi bật:</h3>
            <ul style="line-height: 1.8; padding-left: 1.5rem; list-style-type: disc;">
                <li style="margin-bottom: 1rem; color: #000000; font-weight: 500;">Xu hướng <strong>CultureTech</strong> – ứng dụng công nghệ trong bảo tồn, trưng bày và truyền thông văn hoá.</li>
                <li style="margin-bottom: 1rem; color: #000000; font-weight: 500;"><strong>Mô hình hợp tác công – tư</strong> trong phát triển sản phẩm văn hoá và du lịch.</li>
                <li style="margin-bottom: 1rem; color: #000000; font-weight: 500;"><strong>Câu chuyện thực tế</strong> từ các startup, doanh nghiệp sáng tạo và bảo tàng đang tiên phong số hoá di sản.</li>
            </ul>
        </blockquote>

        <p style="font-size: 1.125rem; line-height: 1.8;">Buổi tọa đàm còn ghi dấu bằng Keynote "Sắc Màu Di Sản – Đưa văn hoá Việt đến giới trẻ & du khách" do Santani thực hiện – một hành trình sáng tạo trong việc "kể chuyện di sản" bằng ngôn ngữ hình ảnh, cảm xúc và công nghệ.</p>

        <h2 style="color: #7342ba; font-size: 2rem; margin: 2rem 0 1rem 0; font-family: 'serif'; font-weight: 700;">Khi di sản gặp thương hiệu – Khi quá khứ chạm tương lai</h2>

        <p style="font-size: 1.125rem; line-height: 1.8;">Tọa đàm còn là dịp để nghệ thuật, thương mại và bản sắc Việt cùng đối thoại.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Sự kiện ký kết hợp tác giữa Ngọc Trà Hương Tịnh × Santani với chương trình "Hành trình sáng tạo – Từ Di sản đến Thương hiệu" đánh dấu bước tiến quan trọng trong việc chuyển hoá giá trị di sản thành sản phẩm văn hoá đương đại, mở ra hướng đi mới cho các mô hình phát triển bền vững dựa trên di sản.</p>

        <blockquote style="border-left: 4px solid rgb(253, 224, 71); padding: 1.5rem; margin: 2rem 0; background-color: #fef9e7; border-radius: 8px;">
            <h3 style="margin-bottom: 1rem; font-weight: 600;">Panel thảo luận:</h3>
            <ul style="line-height: 1.8; padding-left: 1.5rem; list-style-type: disc;">
                <li style="margin-bottom: 1rem; color: #000000; font-weight: 500; font-style: italic;">"Cuộc gặp gỡ giữa Thương hiệu và Di sản văn hoá"</li>
                <li style="margin-bottom: 1rem; color: #000000; font-weight: 500; font-style: italic;">"Kể chuyện di sản bằng công nghệ và mạng lưới toàn cầu"</li>
            </ul>
        </blockquote>

        <p style="font-size: 1.125rem; line-height: 1.8;">Các diễn giả khách mời gồm <strong> TS. Nguyễn Hồng Ngọc, CEO Santani – đạo diễn Nguyệt Quế, TS. Trịnh Đăng Khoa, CEO VAN•HOA Nguyễn Huyền Châu </strong>, cùng nhiều chuyên gia đến từ <strong>Đại học Văn hoá TP.HCM, ĐH KHTN, Mholdings, VIE-X Group</strong>, và <strong>AP SaiGonPetro</strong>… hứa hẹn mang lại những góc nhìn đa chiều và thực tiễn.</p>
        
        <div style="width: 100%; margin: 2rem 0; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <img src="/images/events/inno1.png" alt="CultureTech - Di sản và công nghệ" style="width: 100%; height: 100%; object-fit: cover; background-color: #f8f9fa;">
        </div>

        <div style="width: 100%; margin: 2rem 0; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <img src="/images/events/inno2.png" alt="CultureTech - Di sản và công nghệ" style="width: 100%; height: 100%; object-fit: cover; background-color: #f8f9fa;">
        </div>

        <h2 style="color: #7342ba; font-size: 2rem; margin: 2rem 0 1rem 0; font-family: 'serif'; font-weight: 700;">Một "điểm hẹn sáng tạo" của người yêu văn hoá</h2>

        <p style="font-size: 1.125rem; line-height: 1.8;">"Triển lãm – Ngày hội Công nghiệp Văn hoá Việt Nam 2025" không chỉ là sự kiện trưng bày, mà còn là một nền tảng kết nối cộng đồng sáng tạo Việt – nơi các bạn trẻ, nhà thiết kế, startup, nghệ sĩ, học giả và doanh nghiệp có thể cùng gặp gỡ, chia sẻ ý tưởng và hợp tác để xây dựng một nền văn hoá số mang bản sắc Việt.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Triển lãm mở cửa tự do từ 8h00 đến 17h00 mỗi ngày, chào đón mọi người đến trải nghiệm, sáng tạo và cảm nhận cách công nghệ đang giúp văn hoá Việt trở nên gần gũi, sống động và lan tỏa hơn bao giờ hết.</p>

        <p style="font-size: 1.125rem; line-height: 1.8; font-style: italic; margin: 2rem 0; padding: 1.5rem; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; text-align: center; font-weight: 500;">Hãy đến SIHUB – nơi văn hoá Việt gặp công nghệ thời đại, nơi di sản được thắp sáng bằng sáng tạo Việt.</p>

        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 2rem; border-radius: 12px; margin: 2rem 0; text-align: center;">
            <h3 style="color: #7342ba; font-size: 1.5rem; margin-bottom: 1rem; font-family: 'serif'; font-weight: 700;">Thông tin chi tiết</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: center; font-size: 1.125rem;">
                <p><strong>📍 Địa điểm:</strong> SIHUB – 123 Trương Định, P. Xuân Hoà, TP.HCM</p>
                <p><strong>🗓 Thời gian:</strong> 14 – 17/11/2025</p>
                <p><strong>🕐 Giờ mở cửa:</strong> 8h00 – 17h00</p>
            </div>
            <p style="margin-top: 1.5rem; font-size: 1.25rem; font-weight: bold; color: #B668A1;">✨ Hãy đến để trải nghiệm sự giao thoa giữa di sản và công nghệ!</p>
        </div>
    `
}

export default function InnoCulture2025Page() {
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

    const overlay = "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)"

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
                                <span className="text-sm font-medium">Sự kiện sắp diễn ra</span>
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
                            <span className="block bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                                {innoculture2025Data.title}
                            </span>
                        </h1>

                        <p className="text-xl sm:text-2xl font-serif italic mb-8 text-purple-200">
                            {innoculture2025Data.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8">
                            {innoculture2025Data.dateDisplay && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70">Thời gian</p>
                                        <p className="font-semibold">{innoculture2025Data.dateDisplay}</p>
                                    </div>
                                </div>
                            )}

                            {innoculture2025Data.location && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70">Địa điểm</p>
                                        <p className="font-semibold">{innoculture2025Data.location}</p>
                                    </div>
                                </div>
                            )}

                            {innoculture2025Data.openingHours && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70">Giờ mở cửa</p>
                                        <p className="font-semibold">{innoculture2025Data.openingHours}</p>
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
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8 flex items-center justify-center bg-gray-100">
                                    <img
                                        src={innoculture2025Data.image}
                                        alt={innoculture2025Data.title}
                                        className="w-full max-h-[28rem] object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = `
                                                    <div class="flex items-center justify-center h-full min-h-[280px] bg-gray-100">
                                                        <div class="text-center p-8">
                                                            <svg class="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                            <p class="text-gray-600 font-medium">${innoculture2025Data.title}</p>
                                                            <p class="text-gray-500 text-sm mt-2">Hình ảnh đang cập nhật</p>
                                                        </div>
                                                    </div>
                                                `;
                                            }
                                        }}
                                    />
                                </div>
                                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                                    <h2
                                        className="text-3xl font-serif font-bold mb-4"
                                        style={{ color: "#7342ba" }}
                                    >
                                        Về sự kiện
                                    </h2>
                                    <div
                                        style={{ color: "#1f2937", fontSize: "1.125rem", lineHeight: "1.8" }}
                                        dangerouslySetInnerHTML={{ __html: innoculture2025Data.intro }}
                                    />
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-8">
                                    <div
                                        className="prose prose-lg max-w-none"
                                        style={{ color: "#1f2937" }}
                                        dangerouslySetInnerHTML={{ __html: innoculture2025Data.content }}
                                    />
                                </div>
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
                                        style={{ color: "#7342ba" }}
                                    >
                                        Thông tin sự kiện
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-gray-600 mb-1">Thời gian</p>
                                            <p className="font-semibold text-gray-800">
                                                {innoculture2025Data.dateDisplay || "Đang cập nhật"}
                                            </p>
                                        </div>
                                        {innoculture2025Data.openingHours && (
                                            <div>
                                                <p className="text-gray-600 mb-1">Giờ mở cửa</p>
                                                <p className="font-semibold text-gray-800">{innoculture2025Data.openingHours}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-gray-600 mb-1">Địa điểm</p>
                                            <p className="font-semibold text-gray-800">{innoculture2025Data.location}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 mb-1">Gi vé</p>
                                            <p className="font-semibold text-gray-800">Miễn phí</p>
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
                                        style={{ color: "#7342ba" }}
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
                            style={{ color: "#7342ba" }}
                        >
                            Đăng ký tham gia {innoculture2025Data.title}
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
        </main>
    )
}