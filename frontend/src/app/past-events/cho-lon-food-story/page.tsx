"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Dữ liệu tĩnh cho sự kiện Chợ Lớn Food Story
const choLonFoodStoryData = {
    title: "Lễ hội Ẩm thực “Chợ Lớn Food Story lần 1 năm 2023” – Hành trình kết nối văn hóa, ẩm thực và phát triển du lịch Quận 5",
    thumbnailImage: "/images/past-events/cho-lon-food-story.jpg",
    year: 2023,
    intro: `
        <p>Vào ngày <strong>1 đến 3 tháng 12 năm 2023</strong>, tại Trung tâm Văn hóa Quận 5 (TP Hồ Chí Minh), diễn ra lễ hội ẩm thực mang chủ đề <strong>“Trải nghiệm món ngon điểm tâm”</strong> – sự kiện lần đầu tiên của Quận 5 nhằm tôn vinh và quảng bá văn hóa ẩm thực Hoa-Việt đặc trưng vùng "Chợ Lớn".</p>
    `,
    sections: [
        {
            title: "Mục tiêu & ý nghĩa",
            content: `
                <p>Lễ hội được tổ chức dưới sự chỉ đạo của UBND Quận 5; phối hợp bởi Phòng Kinh tế Quận 5 và Trung tâm Văn hóa Quận 5, với sự tham gia thực hiện của Công ty Cổ phần Santani.
                Qua đó, sự kiện đặt ra các mục tiêu sau: </p> <br/>
                <ul>
                    <li>Góp phần bảo tồn, phát huy các giá trị văn hóa truyền thống, văn hóa ẩm thực Hoa-Việt tại Quận 5.</li>
                    <li>Giới thiệu, tôn vinh và xây dựng thương hiệu cho ẩm thực người Hoa, hướng đến việc đưa Quận 5 trở thành điểm đến du lịch ẩm thực hàng đầu TP.HCM.</li>
                    <li>Tạo điều kiện cho doanh nghiệp, hộ kinh doanh ẩm thực trên địa bàn được giới thiệu, quảng bá thương hiệu, mở rộng thị trường trong và ngoài nước.</li>
                </ul>
            `
        },
        {
            title: "Quy mô & hoạt động chính",
            content: `
                <ul>
                    <li>Sự kiện diễn ra trong 3 ngày từ 01-03/12/2023 tại Trung tâm Văn hóa Quận 5.</li>
                    <li>Có hơn <strong>50 gian hàng</strong>, phần lớn là các nhà hàng, quán ăn uy tín tại Quận 5, tập trung vào chủ đề điểm tâm và món ăn mang phong cách ẩm thực Hoa.</li>
                    <li>Các hoạt động nổi bật gồm: lễ trao giải hội thi “Ăn ngon Quận 5”; biểu diễn văn hóa-nghệ thuật; tọa đàm phát triển du lịch & bảo tồn văn hóa Hoa-Việt; trải nghiệm chế biến món ăn (dimsum); trò chơi dân gian; triển lãm văn hóa; và thưởng thức ẩm thực.</li>
                    <li>Trong phần ẩm thực, khách tham quan được khám phá những món ăn có “chất Hoa” rất đặc trưng như: sủi cảo, mì vịt tiềm, vịt quay, cơm gà, xíu mại, bánh bao… </li>
                </ul>
            `
        },
        {
            title: "Tầm quan trọng đối với Quận 5",
            content: `
                <p>Quận 5 vốn là nơi cư trú lâu đời của cộng đồng người Hoa, đồng thời là vùng giao thoa văn hóa, với nền ẩm thực phong phú và nhiều điểm đến lịch sử – kiến trúc đặc sắc.</p> <br/>
                <p>Lễ hội này được xem là “sự kiện nổi bật” dịp cuối năm tại Quận 5, và được kỳ vọng sẽ trở thành thương hiệu thường niên mang dấu ấn đặc trưng của địa phương.</p> <br/>
                <p>Thông qua lễ hội, Quận 5 hướng tới mục tiêu phát triển kinh tế – xã hội, thúc đẩy ngành du lịch ẩm thực, quảng bá thương hiệu địa phương và tạo điểm đến không thể bỏ lỡ với du khách trong và ngoài nước. </p>
            `
        }
    ]
}

export default function ChoLonFoodStoryPage() {
    const overlay = "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)"

    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
                <Link
                    href="/#past_events"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                        backgroundColor: "white",
                        color: "#B668A1",
                        border: "2px solid #B668A1",
                    }}
                >
                    <ArrowLeft size={18} />
                    Quay lại
                </Link>
            </div>

            {/* Hero Section */}
            <section className="relative w-full">
                <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
                    <Image
                        src={choLonFoodStoryData.thumbnailImage}
                        alt={choLonFoodStoryData.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0" style={{ background: overlay }} />

                    <div className="absolute inset-0 flex items-end">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 w-full">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.7 }}
                            >
                                <div className="inline-flex mb-4">
                                    <span
                                        className="px-4 py-2 rounded-full font-bold text-sm"
                                        style={{
                                            backgroundColor: "#D4AF37",
                                            color: "white",
                                        }}
                                    >
                                        Sự kiện {choLonFoodStoryData.year}
                                    </span>
                                </div>

                                <h1
                                    className="text-4xl md:text-6xl font-serif font-bold mb-4 text-white drop-shadow-xl"
                                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                                >
                                    {choLonFoodStoryData.title}
                                </h1>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Intro Content */}
                        <div className="prose prose-lg max-w-none mb-12 text-lg italic" style={{ color: "#1f2937" }}>
                            <div dangerouslySetInnerHTML={{ __html: choLonFoodStoryData.intro }} />
                        </div>

                        {/* Video Section */}
                        <div className="mb-12">
                            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6" style={{ color: "#B668A1" }}>
                                Video về sự kiện
                            </h3>
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/WCh6SDwM0QA"
                                    title="Chợ Lớn Food Story - Chiến dịch quảng bá ẩm thực độc đáo | NTV News"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <p className="text-sm text-gray-600 mt-4 italic">
                                Chợ Lớn Food Story - Chiến dịch quảng bá ẩm thực độc đáo | NTV News
                            </p>
                        </div>

                        {/* Feature Sections */}
                        {choLonFoodStoryData.sections.map((section, idx) => (
                            <div key={idx} className="mb-12">
                                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4" style={{ color: "#B668A1" }}>
                                    {section.title}
                                </h3>
                                <div
                                    className="prose prose-lg max-w-none [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2 [&>ul>li]:leading-relaxed [&>ul>li]:marker:text-[#D4AF37]"
                                    style={{ color: "#1f2937" }}
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Link
                        href="/#past_events"
                        className="inline-block px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105"
                        style={{
                            backgroundColor: "#B668A1",
                            color: "white",
                        }}
                    >
                        Khám phá thêm sự kiện khác
                    </Link>
                </div>
            </section>
        </main>
    )
}