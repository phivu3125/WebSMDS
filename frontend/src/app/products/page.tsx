"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, Search, Filter, Star, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/home/navigation"
import { Footer } from "@/components/layout/Footer"
import { products } from "@/mock/products"
import { categories } from "@/mock/categories"

const categoryOptions = ["all", ...categories.map(c => c.name)]

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedStock, setSelectedStock] = useState("all")
    const [sortBy, setSortBy] = useState("featured")

    // Filter and sort products
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "all" || categories.find(c => c.id === product.categoryId)?.name === selectedCategory
        const matchesStock = selectedStock === "all" || (selectedStock === "inStock" ? product.inStock : !product.inStock)

        return matchesSearch && matchesCategory && matchesStock
    })

    // Sort products
    if (sortBy === "price-asc") {
        filteredProducts = [...filteredProducts].sort((a, b) => a.priceNum - b.priceNum)
    } else if (sortBy === "price-desc") {
        filteredProducts = [...filteredProducts].sort((a, b) => b.priceNum - a.priceNum)
    } else if (sortBy === "name") {
        filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "featured") {
        filteredProducts = [...filteredProducts].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

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
                            "Chạm" Vào Di Sản & Sáng Tạo
                        </h1>
                        <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: "#fcd34d" }} />
                        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                            Khám phá những sản phẩm văn hóa độc đáo, nơi di sản truyền thống gặp gỡ sáng tạo đương đại
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter & Search Section */}
            <section className="sticky top-16 z-40 bg-white shadow-md py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-gray-600" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {categoryOptions.map(category => (
                                    <option key={category} value={category}>
                                        {category === "all" ? "Tất cả danh mục" : category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Stock Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Tình trạng:</span>
                            <select
                                value={selectedStock}
                                onChange={(e) => setSelectedStock(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="all">Tất cả</option>
                                <option value="inStock">Còn hàng</option>
                                <option value="outOfStock">Hết hàng</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Sắp xếp:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="featured">Nổi bật</option>
                                <option value="name">Tên A-Z</option>
                                <option value="price-asc">Giá tăng dần</option>
                                <option value="price-desc">Giá giảm dần</option>
                            </select>
                        </div>
                    </div>

                    {/* Results count */}
                    <p className="text-sm text-gray-600">
                        Tìm thấy <span className="font-semibold text-purple-600">{filteredProducts.length}</span> sản phẩm
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-500">Không tìm thấy sản phẩm nào phù hợp</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product, index) => (
                                <Link href={`/products/${product.id}`} key={product.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full max-w-sm mx-auto w-full cursor-pointer"
                                        style={{
                                            border: product.featured ? "3px solid #D4AF37" : "1px solid #e5e7eb",
                                        }}
                                    >
                                        {/* Featured Badge */}
                                        {product.featured && (
                                            <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                                <Star size={14} fill="currentColor" />
                                                NỔI BẬT
                                            </div>
                                        )}

                                        {/* Stock Badge */}
                                        {!product.inStock && (
                                            <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                HẾT HÀNG
                                            </div>
                                        )}

                                        {/* Image */}
                                        <div className="relative h-64 overflow-hidden flex-shrink-0">
                                            <Image
                                                src={product.image || "/placeholder.svg"}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                placeholder="blur"
                                                blurDataURL="/placeholder.svg"
                                            />
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                style={{
                                                    background: "linear-gradient(to top, rgba(212, 175, 55, 0.4), transparent)",
                                                }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center mb-3">
                                                <span
                                                    className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg"
                                                    style={{
                                                        backgroundColor: "#D4AF37",
                                                        color: "white",
                                                    }}
                                                >
                                                    {categories.find(c => c.id === product.categoryId)?.name || ''}
                                                </span>
                                            </div>

                                            <h3
                                                className="font-serif text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors min-h-[3.5rem]"
                                                style={{ color: "#1f2937" }}
                                            >
                                                {product.name}
                                            </h3>

                                            <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed min-h-[4rem]">
                                                {product.description}
                                            </p>

                                            {/* Price & Button - Fixed at bottom */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                                                <span
                                                    className="text-2xl font-bold font-mono"
                                                    style={{ color: "#D4AF37" }}
                                                >
                                                    {product.priceNum.toLocaleString('vi-VN')}đ
                                                </span>
                                                <button
                                                    disabled={!product.inStock}
                                                    className={`flex items-center justify-center gap-2 px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 whitespace-nowrap min-w-[120px] ${product.inStock ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'
                                                        }`}
                                                    style={{
                                                        backgroundColor: product.inStock ? "#B668A1" : "#9ca3af",
                                                        color: "white",
                                                    }}
                                                >
                                                    <ShoppingBag size={16} />
                                                    {product.inStock ? "Mua ngay" : "Hết hàng"}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
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
                        Tham gia các sự kiện, workshop và khám phá những câu chuyện văn hóa độc đáo
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