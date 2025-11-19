"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/mock/products"

export default function ProductsSection() {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

    // Get featured products
    const featuredProducts = products.filter(product => product.featured).slice(0, 6)

    if (featuredProducts.length === 0) {
        return (
            <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8">
                <div className="text-center">Hiện chưa có sản phẩm nổi bật nào</div>
            </section>
        )
    }

    return (
        <section
            id="products"
            ref={ref}
            className="relative w-full py-20 px-4 sm:px-6 lg:px-8"
            style={{
                background: "linear-gradient(to bottom, #ffffff 0%, #FAF9F6 100%)",
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
                        id="product-pattern"
                        x="0"
                        y="0"
                        width="200"
                        height="200"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="100" cy="100" r="50" fill="none" stroke="#D4AF37" strokeWidth="1" />
                        <circle cx="100" cy="100" r="30" fill="none" stroke="#B668A1" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="1200" height="800" fill="url(#product-pattern)" />
            </svg>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2
                        className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance"
                        style={{ color: "#D4AF37" }}
                    >
                        &ldquo;CHẠM&rdquo; VÀO DI SẢN VÀ SÁNG TẠO
                    </h2>
                    <div className="w-24 h-1 mx-auto" style={{ backgroundColor: "#D4AF37" }} />
                    <p
                        className="text-center text-lg md:text-xl italic mt-6 leading-relaxed max-w-3xl mx-auto"
                        style={{ color: "#1f2937" }}
                    >
                        &ldquo;Di sản vượt qua ranh giới bảo tồn và trở thành cảm hứng sáng tạo.&rdquo;
                    </p>
                </motion.div>

                {/* Products Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                >
                    {featuredProducts.map((product, index) => (
                        <Link href={`/products/${product.id}`} key={product.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                style={{
                                    border: "2px solid transparent",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#B668A1"
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "transparent"
                                }}
                            >
                                {/* Image */}
                                <div className="relative h-72 overflow-hidden">
                                    <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 select-none"
                                        priority={index === 0}
                                        placeholder="blur"
                                        blurDataURL="/placeholder.svg"
                                    />
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            background:
                                                "linear-gradient(to top, rgba(212, 175, 55, 0.3), transparent)",
                                        }}
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3
                                        className="font-serif text-xl font-bold mb-2"
                                        style={{ color: "#1f2937" }}
                                    >
                                        {product.name}
                                    </h3>
                                    <p
                                        className="text-sm mb-4 leading-relaxed line-clamp-2"
                                        style={{ color: "#6b7280" }}
                                    >
                                        {product.description}
                                    </p>

                                    {/* Price & Button */}
                                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "#e5e7eb" }}>
                                        <span
                                            className="text-2xl font-bold font-mono"
                                            style={{ color: "#D4AF37" }}
                                        >
                                            {product.priceNum.toLocaleString('vi-VN')}đ
                                        </span>
                                        <button
                                            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 select-none cursor-pointer"
                                            style={{
                                                backgroundColor: "#B668A1",
                                                color: "white",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#D4AF37"
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "#B668A1"
                                            }}
                                        >
                                            <ShoppingBag size={16} />
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center"
                >
                    <button
                        onClick={() => { window.location.href = "/products" }}
                        className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 select-none cursor-pointer"
                        style={{
                            background: "linear-gradient(135deg, #D4AF37, #B668A1)",
                        }}
                    >
                        Xem Tất Cả Sản Phẩm
                    </button>
                </motion.div>
            </div>
        </section>
    )
}