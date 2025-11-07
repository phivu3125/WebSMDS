"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"

export default function PartnersSection() {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
    const [hoveredPartner, setHoveredPartner] = useState<string | null>(null)
    const [showFullIntro, setShowFullIntro] = useState(false)

    const partners = [
        {
            id: "phan-nu",
            name: "Phấn Nụ Hoàng Cung",
            bio: "Giữ lại tinh hoa làm đẹp của cung đình xưa, Phấn Nụ Hoàng Cung không chỉ là thương hiệu mỹ phẩm truyền thống mà còn là biểu tượng của sự thanh tao, nền nã và thuần Việt trong văn hóa làm đẹp.",
            logo: "/partners/phan-nu.jpg",
        },
        {
            id: "viet-phuc",
            name: "Việt phục Chiêu Minh Các",
            bio: "Mỗi tà áo, mỗi đường kim mũi chỉ, mỗi kiểu cách của dáng đứng, mái tóc là một nhịp nối giữa quá khứ và hiện tại. Chiêu Minh Các mang đến không chỉ là hình ảnh của người Việt trong trang phục truyền thống, mà là tinh thần Việt được tái sinh trong đời sống đương đại.",
            logo: "/partners/chieu-minh-cac.jpg",
        },
        {
            id: "de-do",
            name: "Đế Đô Khảo Cổ",
            bio: "Từ những mảnh vỡ lịch sử, Đế Đô Khảo Cổ khơi dậy ký ức một thời vàng son. Họ là những người kể chuyện quá khứ bằng hiện vật, giúp chúng ta nhìn thấy sự sống của di sản trong từng lớp đất, từng dấu tích.",
            logo: "/partners/de-do.jpg",
        },
        {
            id: "am-thuc",
            name: "Ẩm thực Góc Huế",
            bio: "Hương vị là ký ức. Góc Huế gìn giữ tinh hoa ẩm thực cố đô, đưa những món ăn dân dã mà thanh nhã trở lại trong đời sống hôm nay, như một cách chạm vào di sản bằng vị giác và cảm xúc.",
            logo: "/partners/goc-hue.jpg",
        },
        {
            id: "truc-chi",
            name: "Trúc Chỉ",
            bio: 'Nghệ thuật giấy Trúc Chỉ là biểu tượng của sáng tạo từ truyền thống. Mỗi tấm giấy được tạo nên từ nước, ánh sáng và đôi bàn tay nghệ nhân, mang trong mình triết lý "nghệ thuật là dòng chảy của tâm hồn Việt".',
            logo: "/partners/truc-chi.jpg",
        },
        {
            id: "thuong-an",
            name: "Trường hướng nghiệp Thương và An",
            bio: "Nơi nghệ thuật và giáo dục gặp gỡ trong yêu thương. Thương và An đồng hành cùng Sắc Màu Di Sản để mang di sản đến gần hơn với trẻ tự kỷ và trầm cảm — để mỗi em nhỏ đều có thể tìm thấy niềm vui, sự kết nối và chữa lành từ văn hóa thông qua những sản phẩm thủ công mà chính tay các em sáng tạo và làm ra, góp phần giá trị nhân văn khi kết nối các em với cộng đồng thông qua vẻ đẹp của văn hóa và di sản.",
            logo: "/partners/thuong-an.jpg",
        },
        {
            id: "moc-truly",
            name: "Mộc Truly's Hue",
            bio: "Mang hơi thở của xứ Huế vào từng sản phẩm, Mộc Truly's Hue kết nối truyền thống và hiện đại qua những món đồ gỗ thủ công tinh xảo.",
            logo: "/partners/moc-truly.jpg",
        },
        {
            id: "vivian",
            name: "Vivian",
            bio: "Đối tác sáng tạo của Sắc Màu Di Sản, Vivian đồng hành cùng chúng tôi trong việc lan tỏa giá trị văn hóa qua nghệ thuật và thiết kế.",
            logo: "/partners/vivian.jpg",
        },
        {
            id: "co-ca-ngua",
            name: "Cờ Cá Ngựa",
            bio: "Trò chơi dân gian truyền thống được tái hiện, Cờ Cá Ngựa mang đến niềm vui và sự kết nối giữa các thế hệ thông qua những ván cờ đầy màu sắc.",
            logo: "/partners/co-ca-ngua.jpg",
        },
    ]

    return (
        <section
            id="partners"
            ref={ref}
            className="relative w-full py-20 px-4 sm:px-6 lg:px-8"
            style={{
                background: "linear-gradient(135deg, rgb(115, 66, 186) 0%, #B668A1 100%)",
            }}
        >
            {/* SVG Pattern Background */}
            <svg
                className="absolute inset-0 w-full h-full opacity-5"
                viewBox="0 0 1200 800"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <pattern
                        id="partners-pattern"
                        x="0"
                        y="0"
                        width="200"
                        height="200"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="100" cy="100" r="40" fill="none" stroke="white" strokeWidth="1" />
                        <circle cx="100" cy="100" r="20" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="1200" height="800" fill="url(#partners-pattern)" />
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
                        style={{ color: "#fcd34d" }}
                    >
                        NHỮNG “ĐỒNG ĐỘI” CHUNG ĐƯỜNG
                    </h2>
                    <div className="w-24 h-1 mx-auto" style={{ backgroundColor: "#fcd34d" }} />
                </motion.div>

                {/* Introduction Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto mb-16"
                >
                    <p
                        className="text-center text-xl md:text-2xl italic leading-relaxed mb-6"
                        style={{ color: "white" }}
                    >
                        “Chúng tôi tin rằng di sản chỉ có thể "sống" khi được chung tay kể tiếp.”
                    </p>

                    <AnimatePresence>
                        {showFullIntro && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4 }}
                                className="overflow-hidden"
                            >
                                <div
                                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border"
                                    style={{ borderColor: "rgba(252, 211, 77, 0.3)" }}
                                >
                                    <p
                                        className="text-base md:text-lg leading-relaxed text-justify"
                                        style={{ color: "white", lineHeight: 1.8 }}
                                    >
                                        Trên hành trình lan tỏa giá trị văn hóa, <span className="italic">Sắc Màu Di Sản </span> 
                                        không bước đi một
                                        mình, mà chúng tôi rất hạnh phúc khi được sánh vai cùng những người bạn đồng
                                        hành — những "đồng đội" mang trong mình tình yêu sâu sắc với truyền thống và
                                        khát vọng đưa di sản trở lại trong đời sống hôm nay. Họ đến từ những miền giá
                                        trị khác nhau, cùng chung một niềm tin: di sản cần được sống, được cảm, và
                                        được kể tiếp bằng tình yêu và sáng tạo.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={() => setShowFullIntro(!showFullIntro)}
                        className="flex items-center gap-2 mx-auto mt-6 px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 select-none cursor-pointer"
                        style={{
                            backgroundColor: "rgba(252, 211, 77, 0.2)",
                            color: "#fcd34d",
                            border: "2px solid #fcd34d",
                        }}
                    >
                        {showFullIntro ? "Thu gọn" : "Tìm hiểu thêm"}
                        {showFullIntro ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </motion.div>

                {/* Horizontal Scrollable Partners */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="relative select-none"
                >
                    {/* Scroll Container */}
                    <div className="overflow-x-auto pb-6 scrollbar-hide">
                        <div className="flex gap-6 px-2" style={{ minWidth: "min-content" }}>
                            {partners.map((partner, index) => (
                                <motion.div
                                    key={partner.id}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    onMouseEnter={() => setHoveredPartner(partner.id)}
                                    onMouseLeave={() => setHoveredPartner(null)}
                                    className="flex-shrink-0 bg-white rounded-lg shadow-lg transition-all duration-500 cursor-pointer relative overflow-hidden"
                                    style={{
                                        width: "280px",
                                        height: "320px",
                                        border: "3px solid transparent",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = "#fcd34d"
                                        e.currentTarget.style.transform = "translateY(-8px)"
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = "transparent"
                                        e.currentTarget.style.transform = "translateY(0)"
                                    }}
                                >
                                    {/* Default State: Logo + Name (Centered) */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 gap-6">
                                        <Image
                                            src={partner.logo || "/placeholder.svg"}
                                            alt={partner.name}
                                            width={140}
                                            height={140}
                                            className="max-w-[140px] max-h-[140px] object-contain transition-transform duration-500"
                                            style={{
                                                transform:
                                                    hoveredPartner === partner.id
                                                        ? "scale(0.8)"
                                                        : "scale(1)",
                                            }}
                                            priority={index === 0}
                                            placeholder="blur"
                                            blurDataURL="/placeholder.svg"
                                        />
                                        <h3
                                            className="text-lg font-serif font-bold text-center transition-opacity duration-300"
                                            style={{
                                                color: "#5b21b6",
                                                opacity: hoveredPartner === partner.id ? 0 : 1,
                                            }}
                                        >
                                            {partner.name}
                                        </h3>
                                    </div>

                                    {/* Hover State: Bio Overlay */}
                                    <AnimatePresence>
                                        {hoveredPartner === partner.id && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="absolute inset-0 flex flex-col items-center justify-center p-6"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, rgba(182, 104, 161, 0.95), rgba(252, 211, 77, 0.95))",
                                                    backdropFilter: "blur(10px)",
                                                }}
                                            >
                                                <h3
                                                    className="text-lg font-serif font-bold text-center mb-4"
                                                    style={{ color: "white" }}
                                                >
                                                    {partner.name}
                                                </h3>
                                                <div className="overflow-y-auto max-h-full scrollbar-thin">
                                                    <p
                                                        className="text-sm leading-relaxed text-justify"
                                                        style={{ color: "white" }}
                                                    >
                                                        {partner.bio}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Scroll Hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="text-center mt-6"
                    >
                        <p className="text-sm italic" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                            ← Kéo sang để xem thêm đối tác →
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Custom scrollbar styles */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    height: 8px;
                }
                .scrollbar-hide::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .scrollbar-hide::-webkit-scrollbar-thumb {
                    background: rgba(252, 211, 77, 0.5);
                    border-radius: 10px;
                }
                .scrollbar-hide::-webkit-scrollbar-thumb:hover {
                    background: rgba(252, 211, 77, 0.8);
                }
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.2);
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 2px;
                }
            `}</style>
        </section>
    )
}