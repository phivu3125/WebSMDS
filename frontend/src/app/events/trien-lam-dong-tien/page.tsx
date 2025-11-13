"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, X } from "lucide-react"

// Dữ liệu tĩnh cho sự kiện Triển Lãm Đồng Tiền
const trienLamDongTienData = {
    title: "Triển Lãm Đồng Tiền Việt Nam – Hành Trình Theo Dòng Chảy Lịch Sử Dân Tộc",
    thumbnailImage: "/images/events/dong-tien-hero.png",
    image: "/images/events/dong-tien-hero.png",
    dateDisplay: "22/11/2025 – tháng 4/2026",
    location: "Ngân hàng Nhà nước Việt Nam – Chi nhánh Khu vực 2, số 08 Võ Văn Kiệt, phường Sài Gòn, TP. Hồ Chí Minh",
    openingHours: "Hoạt động vào các ngày cuối tuần",
    year: 2025,
    intro: `
        <p>Một lát cắt lịch sử được kể bằng những tờ tiền mang hồn Việt</p>
        <br/>
        <p>Từ những tờ bạc Đông Dương phủ bụi thời gian đến những tờ polymer hiện đại, mỗi đồng tiền Việt Nam đều ẩn chứa một câu chuyện – về lịch sử, văn hóa và khát vọng vươn lên của dân tộc. Triển lãm "Đồng tiền Việt Nam – Hành trình theo dòng chảy lịch sử dân tộc", do Ngân hàng Nhà nước Việt Nam – Chi nhánh Khu vực 2 TP. Hồ Chí Minh tổ chức, sẽ chính thức mở cửa từ ngày 22/11/2025 đến hết tháng 4/2026, hứa hẹn mang đến cho công chúng một hành trình khám phá sinh động và đầy tự hào.</p>
    `,
    content: `
        <h2 style="color: #7342ba; font-size: 2rem; margin: 2rem 0 1rem 0; font-family: 'serif'; font-weight: 700; position: relative; z-index: 10;">Dấu ấn 80 năm lịch sử qua lăng kính đồng tiền</h2>

        <p style="font-size: 1.125rem; line-height: 1.8; margin-bottom: 1rem;">Từ khi Chủ tịch Hồ Chí Minh ký Sắc lệnh số 18B/SL vào năm 1946, cho phép phát hành những tờ "Giấy bạc Cụ Hồ" đầu tiên, đồng tiền Việt Nam đã trở thành biểu tượng của chủ quyền tài chính và tinh thần độc lập dân tộc.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Trải qua tám thập kỷ, hành trình ấy không chỉ phản ánh sự chuyển mình của nền kinh tế mà còn khẳng định vai trò trung tâm của Ngân hàng Nhà nước trong sự nghiệp dựng xây và phát triển đất nước.</p>

        <p style="font-size: 1.125rem; line-height: 1.8; font-style: italic; margin: 1.5rem 0; padding: 1rem; background-color: #f8f9fa; border-left: 4px solid #7342ba;">Đồng tiền – một vật thể nhỏ bé – lại mang trong mình sức mạnh của một quốc gia: là "lá cờ chủ quyền" trong kháng chiến, là "ngọn hải đăng" dẫn đường cho thời kỳ đổi mới, và là "nhịp tim" của nền kinh tế hiện đại hôm nay.</p>

        <div style="width: 100%; height: 100%; margin: 2rem 0; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); overflow: hidden; position: relative; z-index: 1;">
            <img src="/images/events/dong-tien-1.png" alt="Sức mạnh của đồng tiền Việt Nam" style="width: 100%; height: 100%; object-fit: cover; background-color: #f8f9fa;">
        </div>

        <h2 style="color: #7342ba; font-size: 2rem; margin: 2rem 0 1rem 0; font-family: 'serif'; font-weight: 700; position: relative; z-index: 10;">Hơn 1.300 hiện vật – Câu chuyện kể bằng tiền</h2>

        <p style="font-size: 1.125rem; line-height: 1.8;">Triển lãm quy tụ hơn 1.300 hiện vật quý hiếm, được sưu tầm, phục dựng và trưng bày công phu, tái hiện bốn giai đoạn phát triển quan trọng của tiền tệ Việt Nam:</p>

        <div style="display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; margin: 2rem 0;">
            <div>
                <h3 style="color: #B668A1; margin-bottom: 0.5rem; font-weight: 600;">Đồng tiền Đông Dương (1875–1955)</h3>
                <p style="line-height: 1.6;">dấu ấn của thời thuộc địa, nơi đồng tiền mang hình bóng ngoại lai nhưng ẩn chứa tinh thần phản kháng và khát vọng tự do.</p>
            </div>

            <div>
                <h3 style="color: #B668A1; margin-bottom: 0.5rem; font-weight: 600;">Giấy bạc Tài chính (1945–1954)</h3>
                <p style="line-height: 1.6;">minh chứng cho ý chí độc lập, khi từng tờ tiền được in thủ công bằng mực mượn, máy in cũ, nhưng chứa đựng niềm tin lớn lao của cả dân tộc.</p>
            </div>

            <div>
                <h3 style="color: #B668A1; margin-bottom: 0.5rem; font-weight: 600;">Tiền Ngân hàng Quốc gia Việt Nam (1951–1975)</h3>
                <p style="line-height: 1.6;">biểu tượng của sự tự chủ tài chính, gắn liền với công cuộc xây dựng miền Bắc xã hội chủ nghĩa và thống nhất đất nước.</p>
            </div>

            <div>
                <h3 style="color: #B668A1; margin-bottom: 0.5rem; font-weight: 600;">Từ thống nhất tiền tệ đến tiền polymer (1975–nay)</h3>
                <p style="line-height: 1.6;">hành trình của hòa bình, hội nhập và hiện đại hóa, nơi mỗi tờ tiền là kết tinh của khoa học, nghệ thuật và khát vọng phát triển bền vững.</p>
                <div style="width: 100%; margin: 1.5rem 0; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <img src="/images/events/dong-tien-2.png" alt="Hành trình tiền polymer hiện đại" style="width: 100%; height: auto; object-fit: cover; background-color: #f8f9fa;">
                </div>
            </div>
        </div>

        <h2 style="color: #7342ba; font-size: 2rem; margin: 2rem 0 1rem 0; font-family: 'serif'; font-weight: 700;">Nghệ thuật và ký ức trong từng nét mực</h2>

        <p style="font-size: 1.125rem; line-height: 1.8;">Không chỉ là tư liệu tài chính, đồng tiền Việt Nam còn là tác phẩm nghệ thuật thu nhỏ.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Những tờ tiền vẽ tay thời kháng chiến – được phác họa thủ công trong điều kiện thiếu thốn – nay trở thành những bức ký họa sống động về một thời kỳ lịch sử bi tráng.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Mỗi chi tiết, mỗi họa tiết – từ hình Bác Hồ hiền từ, mái đình, con thuyền đến ruộng đồng, công trường – đều là biểu tượng cho tinh thần tự lực và niềm tin vào tương lai.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Ngày nay, những tờ tiền polymer hiện đại tiếp tục lưu giữ tinh thần ấy: bền đẹp, chống giả, nhưng vẫn mang trong mình linh hồn Việt – nơi lịch sử, nghệ thuật và văn hóa cùng hội tụ.</p>

        <h2 style="color: #7342ba; font-size: 2rem; margin: 2rem 0 1rem 0; font-family: 'serif'; font-weight: 700; position: relative; z-index: 10;">Không gian di sản giữa lòng đô thị</h2>

        <p style="font-size: 1.125rem; line-height: 1.8;">Triển lãm được tổ chức tại Tòa nhà Ngân hàng Nhà nước Việt Nam – Chi nhánh Khu vực 2, số 08 Võ Văn Kiệt, phường Sài Gòn, TP. Hồ Chí Minh – một công trình kiến trúc cổ được xây dựng từ năm 1878, kết hợp tinh tế giữa phong cách Pháp và yếu tố bản địa.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Giữa nhịp sống sôi động của đô thị, nơi đây như một "chứng nhân" lặng lẽ kể lại câu chuyện của thời gian, để mỗi người khi ghé qua đều có thể chạm đến mạch nguồn ký ức của dân tộc.</p>

        <h2 style="color: #7342ba; font-size: 2rem; margin: 2rem 0 1rem 0; font-family: 'serif'; font-weight: 700; position: relative; z-index: 10;">Trải nghiệm kết nối giữa quá khứ và hiện tại</h2>

        <p style="font-size: 1.125rem; line-height: 1.8;">Triển lãm "Đồng tiền Việt Nam" không chỉ mang tính trưng bày mà còn hướng đến trải nghiệm tương tác đa giác quan.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Công nghệ trình chiếu 3D, không gian thực tế mở và tư liệu số hóa giúp người xem được "chạm" vào lịch sử, quan sát từng chi tiết tinh xảo của đồng tiền qua mô hình và phim tư liệu.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Đây là cơ hội để thế hệ trẻ – học sinh, sinh viên, nhà nghiên cứu – tiếp cận lịch sử bằng một cách gần gũi, sinh động và đầy cảm xúc.</p>

        <h2 style="color: #7342ba; font-size: 2rem; margin: 2rem 0 1rem 0; font-family: 'serif'; font-weight: 700; position: relative; z-index: 10;">Một hành trình văn hóa đáng tự hào</h2>

        <p style="font-size: 1.125rem; line-height: 1.8;">Với quy mô lớn, nội dung sâu sắc và giá trị tư liệu đặc biệt, triển lãm "Đồng tiền Việt Nam" không chỉ là điểm đến của người yêu lịch sử, mà còn là sự kiện văn hóa – giáo dục mang tính biểu tượng.</p>

        <p style="font-size: 1.125rem; line-height: 1.8;">Đó là lời nhắc nhở mỗi người về hành trình đi lên của đất nước – nơi từng đồng tiền không chỉ mang giá trị vật chất, mà còn chứa đựng niềm tin, tự hào và khát vọng trường tồn của dân tộc Việt Nam.</p>

        <div style="width: 100%; height: 100%; margin: 2rem 0; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); overflow: hidden; position: relative; z-index: 1;">
            <img src="/images/events/dong-tien-3.png" alt="Hành trình văn hóa đáng tự hào" style="width: 100%; height: 100%; object-fit: cover; background-color: #f8f9fa;">
        </div>

        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 2rem; border-radius: 12px; margin: 2rem 0; text-align: center;">
            <h3 style="color: #7342ba; font-size: 1.5rem; margin-bottom: 1rem; font-family: 'serif'; font-weight: 700;">Thông tin chi tiết</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: center; font-size: 1.125rem;">
                <p><strong>📅 Thời gian:</strong> Hoạt động vào các ngày cuối tuần, từ 22/11/2025 – tháng 4/2026</p>
                <p><strong>📍 Địa điểm:</strong> Ngân hàng Nhà nước Việt Nam – Chi nhánh Khu vực 2, số 08 Võ Văn Kiệt, phường Sài Gòn, TP. Hồ Chí Minh</p>
            </div>
            <p style="margin-top: 1.5rem; font-size: 1.25rem; font-weight: bold; color: #B668A1;">✨ Hãy đến để chiêm ngưỡng, cảm nhận và tự hào – về hành trình của đồng tiền Việt Nam, hành trình của lịch sử, văn hóa và tinh thần Việt!</p>
        </div>
    `
}

export default function TrienLamDongTienPage() {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
    const overlay = "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)"

    const handleOpenVideoModal = () => {
        setIsVideoModalOpen(true)
    }

    const handleCloseVideoModal = () => {
        setIsVideoModalOpen(false)
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
                                {trienLamDongTienData.title}
                            </span>
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8">
                            {trienLamDongTienData.dateDisplay && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70">Thời gian</p>
                                        <p className="font-semibold">{trienLamDongTienData.dateDisplay}</p>
                                    </div>
                                </div>
                            )}

                            {trienLamDongTienData.location && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70">Địa điểm</p>
                                        <p className="font-semibold">{trienLamDongTienData.location}</p>
                                    </div>
                                </div>
                            )}

                            {trienLamDongTienData.openingHours && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70">Giờ mở cửa</p>
                                        <p className="font-semibold">{trienLamDongTienData.openingHours}</p>
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
                                onClick={handleOpenVideoModal}
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
                                        src={trienLamDongTienData.image}
                                        alt={trienLamDongTienData.title}
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
                                                            <p class="text-gray-600 font-medium">${trienLamDongTienData.title}</p>
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
                                        dangerouslySetInnerHTML={{ __html: trienLamDongTienData.intro }}
                                    />
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-8">
                                    <div
                                        className="prose prose-lg max-w-none"
                                        style={{ color: "#1f2937" }}
                                        dangerouslySetInnerHTML={{ __html: trienLamDongTienData.content }}
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
                                                {trienLamDongTienData.dateDisplay || "Đang cập nhật"}
                                            </p>
                                        </div>
                                        {trienLamDongTienData.openingHours && (
                                            <div>
                                                <p className="text-gray-600 mb-1">Giờ mở cửa</p>
                                                <p className="font-semibold text-gray-800">{trienLamDongTienData.openingHours}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-gray-600 mb-1">Địa điểm</p>
                                            <p className="font-semibold text-gray-800">{trienLamDongTienData.location}</p>
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
                                        onClick={handleOpenVideoModal}
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

            {/* Video Modal */}
            {isVideoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    <div
                        className="absolute inset-0 bg-black/70"
                        onClick={handleCloseVideoModal}
                        aria-hidden="true"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            type="button"
                            onClick={handleCloseVideoModal}
                            className="sticky top-2 sm:top-4 right-2 sm:right-4 float-right text-gray-500 hover:text-gray-700 cursor-pointer z-10 bg-white rounded-full p-2 sm:p-2.5 shadow-lg hover:shadow-xl transition-all"
                            aria-label="Đóng video hướng dẫn"
                        >
                            <X size={24} className="sm:w-6 sm:h-6" />
                        </button>

                        <div className="p-4 sm:p-6 lg:p-8 pt-12 sm:pt-8">
                            <h3
                                className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold mb-3 sm:mb-4 text-center px-2"
                                style={{ color: "#7342ba" }}
                            >
                                Video Hướng Dẫn Đăng Ký
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 px-2">
                                Xem video hướng dẫn chi tiết về cách đăng ký tham gia sự kiện Triển Lãm Đồng Tiền
                            </p>

                            {/* Video Container - Responsive */}
                            <div className="mb-6 sm:mb-8">
                                <div className="relative w-full bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-200 rounded-lg overflow-hidden p-3 sm:p-4">
                                    {/* Responsive iframe wrapper - Compact size */}
                                    <div className="relative w-full mx-auto max-w-lg sm:max-w-xl" style={{ paddingBottom: "75%" }}>
                                        <iframe
                                            src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1505175007204722%2F&show_text=false&width=560&t=0"
                                            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                                            style={{
                                                border: "none",
                                                overflow: "hidden"
                                            }}
                                            allowFullScreen
                                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                        />
                                    </div>
                                    <p className="text-xs text-center text-gray-500 mt-3">
                                        💡 Nhấn vào video để xem toàn màn hình nếu muốn
                                    </p>
                                </div>
                            </div>

                            {/* Registration Link Section */}
                            <div className="text-center space-y-3 sm:space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 sm:p-6 border border-purple-200">
                                    <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3" style={{ color: "#7342ba" }}>
                                        Sẵn sàng tham gia sự kiện?
                                    </h4>
                                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                                        Sau khi đã xem video hướng dẫn, hãy nhấn nút bên dưới để đến trang đăng ký chính thức và hoàn tất thủ tục tham dự.
                                    </p>
                                    <a
                                        href="https://dangky.sbvkv2.vn/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base text-purple-900 font-semibold bg-yellow-300 hover:bg-yellow-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span>Đến trang đăng ký chính thức</span>
                                    </a>
                                </div>

                                <p className="text-xs sm:text-sm text-gray-500 px-2">
                                    <strong>Lưu ý:</strong> Video chỉ mang tính chất tham khảo. Vui lòng hoàn tất đăng ký tại trang chính thức để xác nhận tham gia.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

        </main>
    )
}