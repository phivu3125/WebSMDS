"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Dữ liệu tĩnh cho sự kiện Ngoạn Thu Việt
const ngoanThuVietData = {
    title: "Ngoạn Thu Việt",
    subtitle: "Cùng ngoạn Trung thu Việt - Vũ mùa lễ hội",
    thumbnailImage: "/images/past-events/ngoan-thu-viet/heroImg.jpg",
    year: 2024,
    intro: `
        <p>Một mùa trung thu nhộn nhịp lại đến, nếu bạn đang tìm kiếm một nơi như vậy giữa thành phối nhộn nhịp này thì đừng bỏ lỡ bài viết này nhé. Cùng ngoạn Trung thu Việt được tổ chức tại Nam Thi house sẽ như “cỗ máy thời gian” đưa bạn về thời thơ ấu bằng những hoạt động dân gian quen thuộc mùa trăng này.</p>
    `,
    gallery: [
        { url: "/images/past-events/ngoan-thu-viet/img1.jpg", alt: "Không khí lễ hội Trung thu" },
        { url: "/images/past-events/ngoan-thu-viet/img2.jpg", alt: "Các hoạt động dân gian" },
        { url: "/images/past-events/ngoan-thu-viet/img3.jpg", alt: "Trò chơi truyền thống" },
        { url: "/images/past-events/ngoan-thu-viet/img4.jpg", alt: "Mâm cỗ trăng rằm" },
        { url: "/images/past-events/ngoan-thu-viet/img5.jpg", alt: "Đèn lồng Hội An" },
        { url: "/images/past-events/ngoan-thu-viet/img6.jpg", alt: "Múa lân sư tử rồng" }
    ]
}

export default function NgoanThuVietPage() {
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
                        src={ngoanThuVietData.thumbnailImage}
                        alt={ngoanThuVietData.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0" style={{ background: overlay }} />

                    <div className="absolute inset-0 flex items-end">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 w-full">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
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
                                        Sự kiện {ngoanThuVietData.year}
                                    </span>
                                </div>

                                <h1
                                    className="text-4xl md:text-6xl font-serif font-bold mb-4 text-white drop-shadow-xl"
                                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                                >
                                    {ngoanThuVietData.title}
                                </h1>

                                <p
                                    className="text-xl md:text-2xl font-light text-white/90 max-w-4xl drop-shadow-md"
                                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                                >
                                    {ngoanThuVietData.subtitle}
                                </p>
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
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Intro Content */}
                        <div className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                            <div className="flex justify-center mb-6">
                                <div className="w-24 h-1" style={{ backgroundColor: "#D4AF37" }} />
                            </div>
                            <div
                                className="prose prose-lg max-w-none text-start italic"
                                style={{ color: "#1f2937" }}
                                dangerouslySetInnerHTML={{ __html: ngoanThuVietData.intro }}
                            />
                        </div>

                        {/* Video Section */}
                        <div className="mb-12">
                            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6" style={{ color: "#B668A1" }}>
                                Video về sự kiện
                            </h3>
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/watch/?v=503468218951052&rdid=dfKykgQpyERiHfda&show_text=0&width=560"
                                    title="Video Ngọạn Thu Việt"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    scrolling="no"
                                ></iframe>
                            </div>
                            <p className="text-sm text-gray-600 mt-4 italic">
                                Video tổng kết về Lễ hội Trung thu "Ngọạn Thu Việt"
                            </p>
                        </div>

                        {/* Gallery Section */}
                        <div className="mb-12">
                            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-center" style={{ color: "#D4AF37" }}>
                                Khoảnh khắc đáng nhớ
                            </h3>
                            <div className="w-24 h-1 mx-auto mt-6 mb-12" style={{ backgroundColor: "#D4AF37" }} />

                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                                {ngoanThuVietData.gallery.map((image, index) => (
                                    <motion.div
                                        key={`${image.url}-${index}`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        className="break-inside-avoid"
                                    >
                                        <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                            <div className="relative aspect-[16/9]">
                                                <Image
                                                    src={image.url}
                                                    alt={image.alt || `Gallery image ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 400px"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="text-center mt-12">
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
                    </motion.div>
                </div>
            </section>
        </main>
    )
}