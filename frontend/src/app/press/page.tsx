"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, ExternalLink, Youtube, Filter, Search, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/home/navigation"
import { Footer } from "@/components/layout/Footer"
import { getPress, PressItem } from "@/lib/api/press"

export default function PressPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedType, setSelectedType] = useState("all")
    const [pressItems, setPressItems] = useState<PressItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        const fetchPress = async () => {
            try {
                setLoading(true)
                const response = await getPress()
                if (!isMounted) return
                setPressItems(response.data ?? [])
                setError(null)
            } catch (err) {
                if (!isMounted) return
                console.error("Failed to fetch press", err)
                setError("Không thể tải dữ liệu truyền thông. Vui lòng thử lại sau.")
            } finally {
                if (!isMounted) return
                setLoading(false)
            }
        }

        fetchPress()

        return () => {
            isMounted = false
        }
    }, [])

    const filteredArticles = useMemo(() => {
        return pressItems.filter((article) => {
            const query = searchTerm.trim().toLowerCase()
            const matchesSearch =
                query.length === 0 ||
                article.title.toLowerCase().includes(query) ||
                article.description.toLowerCase().includes(query) ||
                article.source.toLowerCase().includes(query)
            const matchesType = selectedType === "all" || article.type === selectedType

            return matchesSearch && matchesType
        })
    }, [pressItems, searchTerm, selectedType])

    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-[#FAF9F6]">
            <Navigation isScrolled={true} mode="inner" />

            {/* Header Section */}
            <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8"
                style={{
                    background: "linear-gradient(135deg, rgb(115, 66, 186) 0%, #B668A1 100%)",
                }}
            >
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 text-white">
                            Truyền Thông Nói Về Chúng Tôi
                        </h1>
                        <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: "#fcd34d" }} />
                        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                            Khám phá những bài viết, phóng sự và video về hành trình lan tỏa giá trị văn hóa Việt Nam của Sắc Màu Di Sản
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter & Search Section */}
            <section className="sticky top-16 z-40 bg-white shadow-md py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-gray-600" />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedType("all")}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedType === "all"
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    Tất cả
                                </button>
                                <button
                                    onClick={() => setSelectedType("article")}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedType === "article"
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    Bài viết
                                </button>
                                <button
                                    onClick={() => setSelectedType("video")}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedType === "video"
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    Video
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results count */}
                    <p className="mt-4 text-sm text-gray-600">
                        {loading ? "Đang tải dữ liệu..." : (
                            <>
                                Tìm thấy <span className="font-semibold text-purple-600">{filteredArticles.length}</span> kết quả
                            </>
                        )}
                    </p>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {error ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-red-500">{error}</p>
                        </div>
                    ) : loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={`press-skeleton-${index}`} className="h-[420px] rounded-xl bg-white shadow-md animate-pulse" />
                            ))}
                        </div>
                    ) : filteredArticles.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-500">Không tìm thấy bài viết nào phù hợp</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredArticles.map((article, index) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 relative"
                                    style={{
                                        border: article.featured ? "3px solid #D4AF37" : "1px solid #e5e7eb",
                                    }}
                                >
                                    {/* Featured Badge */}
                                    {article.featured && (
                                        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                            <Star size={14} fill="currentColor" />
                                            NỔI BẬT
                                        </div>
                                    )}

                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden">
                                        <Image
                                            src={article.image || "/placeholder.svg"}
                                            alt={article.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 400px"
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            placeholder="blur"
                                            blurDataURL="/placeholder.svg"
                                        />
                                        {article.type === "video" && (
                                            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                                                <Youtube size={14} />
                                                Video
                                            </div>
                                        )}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            style={{
                                                background: "linear-gradient(to top, rgba(212, 175, 55, 0.4), transparent)",
                                            }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span
                                                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg"
                                                style={{
                                                    backgroundColor: "#D4AF37",
                                                    color: "white",
                                                }}
                                            >
                                                {article.source}
                                            </span>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {article.date}
                                            </p>
                                        </div>

                                        <h3
                                            className="font-serif text-xl font-bold mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors"
                                            style={{ color: "#1f2937" }}
                                        >
                                            {article.title}
                                        </h3>

                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                                            {article.description}
                                        </p>

                                        <a
                                            href={article.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
                                            style={{ color: "#B668A1" }}
                                        >
                                            {article.type === "video" ? "Xem video" : "Đọc bài viết"}
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Back to Home CTA */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-serif font-bold mb-4" style={{ color: "#5b21b6" }}>
                        Khám Phá Thêm Về Sắc Màu Di Sản
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Tham gia các sự kiện, workshop và khám phá những sản phẩm văn hóa độc đáo
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105"
                        style={{
                            background: "linear-gradient(135deg, #D4AF37, #B668A1)",
                        }}
                    >
                        Về Trang Chủ
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    )
}