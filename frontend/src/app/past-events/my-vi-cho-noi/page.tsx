"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Dữ liệu tĩnh cho sự kiện Mỹ Vị Chợ Nổi
const myViChoNoiData = {
    title: "Mỹ Vị Chợ Nổi-Hương vị sông nước giữa lòng phố thị",
    thumbnailImage: "/images/past-events/my-vi-cho-noi.jpg",
    year: 2023,
    intro: `
        <p>Giữa nhịp sống hối hả của đô thị, sự kiện Mỹ Vị Chợ Nổi mở ra một không gian mang đậm hơi thở miền sông nước — nơi thực khách không chỉ "ăn", mà còn "ngồi thuyền", "hòa mình" với văn hóa chợ nổi truyền thống. Đó là một lời mời trải nghiệm ẩm thực, nhưng cũng là lời nhắc về khúc giao hòa giữa đất – nước – con người.</p>
    `,
    sections: [
        {
            title: "Văn hóa sông nước và chợ nổi",
            content: `
                <p>Trong hành trình văn hóa của miền Nam Việt Nam, những khu chợ nổi lướt trên mặt nước luôn chứa đựng cái đẹp giản dị nhưng đậm bản sắc: tiếng xuồng máy văng vẳng, tiếng chào mời xen cùng tiếng cười nhẹ, cảnh ghe bơi liên tục đổi hàng… Như tại Chợ nổi Cái Răng (Cần Thơ) — nơi "chợ họp suốt cả ngày… thuyền ghe tấp nập luồn lách trên mặt nước".</p>
                <br/>
                <p>Sự kiện Mỹ Vị Chợ Nổi lấy cảm hứng từ chính không gian ấy, đặt ở đô thị, bắc cầu giữa bản sắc sông nước và nhịp sống thành phố.</p>
            `
        },
        {
            title: "Hương vị & trải nghiệm",
            content: `
                <p>Tham dự Mỹ Vị Chợ Nổi, bạn sẽ được mời lên "thuyền" hay vị trí bên kênh, ngồi thưởng thức món ăn mang dấu ấn miền sông nước: những hải sản tươi, những món ăn dân dã từ đồng bằng, kết hợp cách chế biến hiện đại.</p>\
                <br/>
                <p>Không đơn thuần là buffet, mà là trải nghiệm — ánh sáng nhẹ ven nước, âm nhạc du dương, tiếng xuồng xa xa — tạo nên cảm giác như "ra sông" giữa lòng thành phố.</p>
                <br/>
                <p>Đi kèm là hoạt động văn hóa: kể chuyện chợ nổi, trưng bày hình ảnh miền sông nước, và không gian để người tham dự hiểu hơn về văn hóa giao thương trên dòng kênh.</p>
            `
        },
        {
            title: "Ý nghĩa và giá trị văn hóa",
            content: `
                <p>Sự kiện này không chỉ là một buổi "ăn ngon" — mà còn là một buổi "gặp gỡ văn hóa". Nó giúp khơi dậy trong mỗi người cảm giác nhớ tới <strong>miền sông nước</strong>, tới ký ức của chợ nổi ngày mai.</p>
                <p>Cũng như việc hồi sinh không gian kênh nước vốn từng bị lãng quên — như Kênh Nhiêu Lộc-Thị Nghè – nơi "con kênh từng là 'ác mộng' của hàng triệu dân TP.HCM" nay đã được vực dậy.</p>
                <br/>
                <p>Với Mỹ Vị Chợ Nổi, văn hóa sông nước không chỉ được trưng bày như quá khứ, mà được sống lại, được đặt giữa lòng đô thị — để người tham dự không chỉ thưởng thức món ngon, mà còn "nghe" được hơi thở của nước, "nhìn" được ghe xuồng, và "cảm" được mùi vị đặc trưng của miền sông.</p>
            `
        },
        {
            title: "Thông điệp gửi tới người tham dự",
            content: `
                <ul>
                    <li>Hãy để mình <strong>chậm lại</strong>, ngồi bên nước, để thấy những tiếng động bình thường — tiếng mái chèo, tiếng trò chuyện, tiếng rao hàng — hóa ra là nhịp sống thanh bình.</li>
                    <li>Hãy thưởng thức món ăn với tâm thế không chỉ "ăn cho ngon", mà "ăn để hiểu", "ăn để cảm" — món ăn mang trong mình câu chuyện của người đi chợ nổi, người quen sông nước.</li>
                    <li>Hãy nhớ rằng mỗi trải nghiệm ẩm thực là một cơ hội gặp gỡ văn hóa — ở Mỹ Vị Chợ Nổi, bạn không chỉ là khách, mà là người đồng hành cùng ký ức và bản sắc.</li>
                </ul>
            `
        }
    ]
}

export default function MyViChoNoiPage() {
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
                        src={myViChoNoiData.thumbnailImage}
                        alt={myViChoNoiData.title}
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
                                        Sự kiện {myViChoNoiData.year}
                                    </span>
                                </div>

                                <h1
                                    className="text-4xl md:text-6xl font-serif font-bold mb-4 text-white drop-shadow-xl"
                                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                                >
                                    {myViChoNoiData.title}
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
                        <div className="prose prose-lg max-w-none mb-12 italic text-lg" style={{ color: "#1f2937" }}>
                            <div dangerouslySetInnerHTML={{ __html: myViChoNoiData.intro }} />
                        </div>

                        {/* Video Section */}
                        <div className="mb-12">
                            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6" style={{ color: "#B668A1" }}>
                                Video về sự kiện
                            </h3>
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/_fFQc1MWtHE"
                                    title="Có một chợ nổi miền Tây giữa trung tâm thành phố | NTV News"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <p className="text-sm text-gray-600 mt-4 italic">
                                Có một chợ nổi miền Tây giữa trung tâm thành phố | NTV News
                            </p>
                        </div>

                        {/* Feature Sections */}
                        {myViChoNoiData.sections.map((section, idx) => (
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