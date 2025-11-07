"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, Minus, Plus, Package, Truck, Shield, ArrowLeft, Star, Check, Phone, Mail, MapPin, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import Navigation from "@/components/home/navigation"
import { Footer } from "@/components/layout/Footer"
import { Product, OrderFormData } from "@/types"

// Mock product data - trong thực tế sẽ fetch từ API
const allProducts: Product[] = [
    {
        id: 1,
        name: "Áo Dài Truyền Thống",
        slug: "ao-dai-truyen-thong",
        description: "Áo dài lụa tơ tằm thêu tay họa tiết sen, chất liệu cao cấp, thiết kế tinh xảo",
        details: "Áo dài truyền thống được làm từ lụa tơ tằm 100% cao cấp, thêu tay họa tiết hoa sen - biểu tượng của sự thanh khiết và vẻ đẹp trong văn hóa Việt Nam. Mỗi sản phẩm được thực hiện bởi các nghệ nhân có trên 20 năm kinh nghiệm, đảm bảo từng đường nét thêu đều tinh xảo và tỉ mỉ.\n\nÁo dài không chỉ là trang phục mà còn là biểu tượng văn hóa, thể hiện nét đẹp duyên dáng, thanh lịch của phụ nữ Việt. Sản phẩm phù hợp cho các dịp lễ tết, cưới hỏi, hoặc làm quà tặng ý nghĩa.",
        price: "2.500.000đ",
        priceNum: 2500000,
        category: "Thời trang",
        image: "/placeholder.svg?height=600&width=600",
        featured: true,
        inStock: true,
        specifications: {
            material: "Lụa tơ tằm 100%",
            origin: "Làng nghề Vạn Phúc, Hà Đông",
            size: "S, M, L, XL (có thể đo may riêng)",
            color: "Đỏ, Vàng, Xanh, Trắng",
            weight: "300g"
        },
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600&text=Image2",
            "/placeholder.svg?height=600&width=600&text=Image3",
        ]
    },
    {
        id: 2,
        name: "Tranh Sơn Mài",
        slug: "tranh-son-mai",
        description: "Tranh sơn mài vẽ tay phong cảnh Hạ Long, nghệ thuật truyền thống Việt Nam",
        details: "Tranh sơn mài là một trong những nghệ thuật đặc trưng nhất của Việt Nam, kết hợp giữa kỹ thuật vẽ và công nghệ sơn mài truyền thống. Bức tranh phong cảnh Vịnh Hạ Long được vẽ tay hoàn toàn bởi họa sĩ, qua nhiều lớp sơn mài tạo nên chiều sâu và độ bóng đặc trưng.\n\nSản phẩm mang đến vẻ đẹp sang trọng, cổ điển, phù hợp trang trí cho không gian phòng khách, văn phòng làm việc hoặc làm quà tặng cao cấp.",
        price: "5.000.000đ",
        priceNum: 5000000,
        category: "Nghệ thuật",
        image: "/placeholder.svg?height=600&width=600",
        featured: false,
        inStock: true,
        specifications: {
            material: "Sơn mài thiên nhiên, gỗ MDF",
            origin: "Hà Nội",
            size: "60cm x 80cm",
            weight: "2.5kg"
        },
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600&text=Detail",
        ]
    },
    {
        id: 3,
        name: "Gốm Sứ Bát Tràng",
        slug: "gom-su-bat-trang",
        description: "Bộ ấm chén gốm sứ vẽ hoa sen xanh, làng nghề truyền thống Bát Tràng",
        details: "Bộ ấm chén gốm sứ Bát Tràng được làm thủ công hoàn toàn tại làng nghề gốm sứ Bát Tràng nổi tiếng với lịch sử hàng trăm năm. Men gốm trắng ngà kết hợp với họa tiết hoa sen xanh coban được vẽ tay tỉ mỉ, tạo nên vẻ đẹp thanh tao, tinh tế.\n\nBộ sản phẩm gồm 1 ấm trà và 6 chén nhỏ, thích hợp cho việc thưởng trà cùng gia đình và bạn bè, hoặc làm món quà tặng ý nghĩa.",
        price: "1.200.000đ",
        priceNum: 1200000,
        category: "Gốm sứ",
        image: "/placeholder.svg?height=600&width=600",
        featured: true,
        inStock: true,
        specifications: {
            material: "Gốm sứ cao cấp",
            origin: "Làng Bát Tràng, Gia Lâm, Hà Nội",
            size: "Ấm: 15cm x 12cm, Chén: 6cm x 4cm",
            weight: "1.2kg (bộ)"
        },
        images: [
            "/placeholder.svg?height=600&width=600",
        ]
    },
    {
        id: 4,
        name: "Nón Lá Thủ Công",
        slug: "non-la-thu-cong",
        description: "Nón lá Huế thêu thơ truyền thống, thủ công tinh xảo từ nghệ nhân",
        details: "Nón lá Huế là một trong những biểu tượng văn hóa đặc sắc của miền Trung Việt Nam. Mỗi chiếc nón được làm từ lá cọ non, qua nhiều công đoạn tỉ mỉ từ phơi lá, tẩm, xén, khâu cho đến thêu thơ.\n\nĐiểm đặc biệt của nón lá Huế là những câu thơ, hình ảnh được thêu tinh xảo vào giữa các lớp lá, chỉ có thể nhìn thấy khi đưa nón lên ánh sáng.",
        price: "350.000đ",
        priceNum: 350000,
        category: "Thủ công",
        image: "/placeholder.svg?height=600&width=600",
        featured: false,
        inStock: true,
        specifications: {
            material: "Lá cọ, chỉ tơ tằm",
            origin: "Huế",
            size: "Đường kính 40cm - 45cm",
            weight: "150g"
        },
        images: [
            "/placeholder.svg?height=600&width=600",
        ]
    },
    {
        id: 5,
        name: "Túi Thổ Cẩm",
        slug: "tui-tho-cam",
        description: "Túi xách thổ cẩm dệt tay từ Tây Bắc, họa tiết độc đáo của dân tộc thiểu số",
        details: "Túi xách thổ cẩm mang đậm nét văn hóa của các dân tộc thiểu số vùng Tây Bắc. Mỗi chiếc túi được dệt tay hoàn toàn trên khung cửi truyền thống, với những họa tiết màu sắc rực rỡ đặc trưng.\n\nSản phẩm không chỉ đẹp mắt mà còn bền chắc, thể hiện sự khéo léo và tài năng của người phụ nữ dân tộc.",
        price: "450.000đ",
        priceNum: 450000,
        category: "Thời trang",
        image: "/placeholder.svg?height=600&width=600",
        featured: false,
        inStock: false,
        specifications: {
            material: "Vải thổ cẩm dệt tay, da PU",
            origin: "Sapa, Lào Cai",
            size: "30cm x 25cm x 10cm",
            weight: "300g"
        },
        images: [
            "/placeholder.svg?height=600&width=600",
        ]
    },
]

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const productId = Number(params.id)

    const [product, setProduct] = useState<Product | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [showOrderForm, setShowOrderForm] = useState(false)
    const [formData, setFormData] = useState<OrderFormData>({
        productId: 0,
        productName: "",
        quantity: 1,
        fullName: "",
        email: "",
        phone: "",
        address: "",
        notes: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    useEffect(() => {
        const foundProduct = allProducts.find(p => p.id === productId)
        if (foundProduct) {
            setProduct(foundProduct)
            setFormData(prev => ({
                ...prev,
                productId: foundProduct.id,
                productName: foundProduct.name
            }))
        }
    }, [productId])

    if (!product) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-white to-[#FAF9F6]">
                <Navigation isScrolled={true} mode="inner" />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy sản phẩm</h2>
                        <Link href="/products" className="text-purple-600 hover:underline">
                            ← Quay lại danh sách sản phẩm
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta
        if (newQuantity >= 1 && newQuantity <= 99) {
            setQuantity(newQuantity)
            setFormData(prev => ({ ...prev, quantity: newQuantity }))
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        console.log("Order submitted:", { ...formData, quantity })
        setIsSubmitting(false)
        setSubmitSuccess(true)

        // Reset form after 3 seconds
        setTimeout(() => {
            setSubmitSuccess(false)
            setShowOrderForm(false)
            setFormData({
                productId: product.id,
                productName: product.name,
                quantity: 1,
                fullName: "",
                email: "",
                phone: "",
                address: "",
                notes: ""
            })
            setQuantity(1)
        }, 3000)
    }

    const totalPrice = product.priceNum * quantity

    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-[#FAF9F6]">
            <Navigation isScrolled={true} mode="inner" />

            {/* Breadcrumb */}
            <div className="pt-24 pb-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-purple-600">Trang chủ</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-purple-600">Sản phẩm</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Product Detail */}
            <section className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                    >
                        {/* Images */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl border-4 border-white">
                                <Image
                                    src={product.images?.[selectedImage] || product.image}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                    priority
                                />
                                {product.featured && (
                                    <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                                        <Star size={16} fill="currentColor" />
                                        SẢN PHẨM NỔI BẬT
                                    </div>
                                )}
                                {!product.inStock && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="text-white text-3xl font-bold">TẠM HẾT HÀNG</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Images */}
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                                                    ? "border-purple-600 scale-105"
                                                    : "border-gray-200 hover:border-purple-400"
                                                }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.name} ${idx + 1}`}
                                                fill
                                                sizes="100px"
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Category Badge */}
                            <div>
                                <span
                                    className="inline-block text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg"
                                    style={{ backgroundColor: "#D4AF37", color: "white" }}
                                >
                                    {product.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-baseline gap-4">
                                <span className="text-5xl font-bold" style={{ color: "#D4AF37" }}>
                                    {product.price}
                                </span>
                                {product.inStock && (
                                    <span className="text-green-600 font-semibold flex items-center gap-1">
                                        <Check size={20} />
                                        Còn hàng
                                    </span>
                                )}
                            </div>

                            {/* Short Description */}
                            <p className="text-lg text-gray-700 leading-relaxed border-l-4 border-purple-400 pl-4">
                                {product.description}
                            </p>

                            {/* Quantity Selector */}
                            {product.inStock && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Số lượng:
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center border-2 border-gray-300 rounded-lg">
                                                <button
                                                    onClick={() => handleQuantityChange(-1)}
                                                    className="p-3 hover:bg-gray-100 transition-colors"
                                                    disabled={quantity <= 1}
                                                >
                                                    <Minus size={20} />
                                                </button>
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value) || 1
                                                        if (val >= 1 && val <= 99) {
                                                            setQuantity(val)
                                                            setFormData(prev => ({ ...prev, quantity: val }))
                                                        }
                                                    }}
                                                    className="w-16 text-center font-bold text-lg border-x-2 border-gray-300 focus:outline-none"
                                                    min="1"
                                                    max="99"
                                                />
                                                <button
                                                    onClick={() => handleQuantityChange(1)}
                                                    className="p-3 hover:bg-gray-100 transition-colors"
                                                    disabled={quantity >= 99}
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                            <span className="text-lg text-gray-600">
                                                Tổng: <span className="font-bold text-2xl" style={{ color: "#D4AF37" }}>
                                                    {totalPrice.toLocaleString('vi-VN')}đ
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Button */}
                                    <button
                                        onClick={() => setShowOrderForm(true)}
                                        className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                                        style={{
                                            background: "linear-gradient(135deg, #D4AF37, #B668A1)",
                                        }}
                                    >
                                        <ShoppingBag size={24} />
                                        ĐẶT HÀNG NGAY
                                    </button>
                                </div>
                            )}

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                                <div className="text-center">
                                    <div className="flex justify-center mb-2">
                                        <Package className="text-purple-600" size={32} />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700">Hàng thủ công</p>
                                    <p className="text-xs text-gray-500">100% chính hãng</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex justify-center mb-2">
                                        <Truck className="text-purple-600" size={32} />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700">Miễn phí ship</p>
                                    <p className="text-xs text-gray-500">Đơn từ 500k</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex justify-center mb-2">
                                        <Shield className="text-purple-600" size={32} />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700">Đổi trả 7 ngày</p>
                                    <p className="text-xs text-gray-500">Nếu lỗi</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Detailed Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* Description */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg">
                            <h2 className="text-3xl font-serif font-bold mb-6" style={{ color: "#5b21b6" }}>
                                Mô tả chi tiết
                            </h2>
                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                                {product.details}
                            </div>
                        </div>

                        {/* Specifications */}
                        {product.specifications && (
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <h3 className="text-2xl font-serif font-bold mb-6" style={{ color: "#5b21b6" }}>
                                    Thông số kỹ thuật
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="border-b border-gray-200 pb-3">
                                            <dt className="text-sm font-semibold text-gray-600 mb-1 uppercase">
                                                {key === "material" && "Chất liệu"}
                                                {key === "origin" && "Xuất xứ"}
                                                {key === "size" && "Kích thước"}
                                                {key === "weight" && "Trọng lượng"}
                                                {key === "color" && "Màu sắc"}
                                            </dt>
                                            <dd className="text-base text-gray-900 font-medium">{value}</dd>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Order Form Modal */}
            {showOrderForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-serif font-bold" style={{ color: "#5b21b6" }}>
                                    Thông tin đặt hàng
                                </h2>
                                <button
                                    onClick={() => setShowOrderForm(false)}
                                    className="text-gray-500 hover:text-gray-700 text-3xl"
                                >
                                    ×
                                </button>
                            </div>

                            {submitSuccess ? (
                                <div className="text-center py-12">
                                    <div className="flex justify-center mb-4">
                                        <div className="rounded-full bg-green-100 p-6">
                                            <Check className="text-green-600" size={48} />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-green-600 mb-2">
                                        Đặt hàng thành công!
                                    </h3>
                                    <p className="text-gray-600">
                                        Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitOrder} className="space-y-6">
                                    {/* Order Summary */}
                                    <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                                        <h3 className="font-bold text-lg mb-3" style={{ color: "#5b21b6" }}>
                                            Sản phẩm đặt hàng
                                        </h3>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-700">{product.name}</span>
                                            <span className="font-bold" style={{ color: "#D4AF37" }}>
                                                {product.price}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-700">Số lượng:</span>
                                            <span className="font-bold text-lg">{quantity}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-purple-300">
                                            <span className="text-lg font-bold">Tổng cộng:</span>
                                            <span className="text-2xl font-bold" style={{ color: "#D4AF37" }}>
                                                {totalPrice.toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-lg" style={{ color: "#5b21b6" }}>
                                            Thông tin liên hệ
                                        </h3>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <User size={16} className="inline mr-2" />
                                                Họ và tên <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Nhập họ và tên của bạn"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    <Phone size={16} className="inline mr-2" />
                                                    Số điện thoại <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    pattern="[0-9]{10,11}"
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    placeholder="0123456789"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    <Mail size={16} className="inline mr-2" />
                                                    Email <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    placeholder="email@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <MapPin size={16} className="inline mr-2" />
                                                Địa chỉ nhận hàng <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Ghi chú (tùy chọn)
                                            </label>
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                                placeholder="Thời gian nhận hàng, yêu cầu đặc biệt..."
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowOrderForm(false)}
                                            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{
                                                background: "linear-gradient(135deg, #D4AF37, #B668A1)",
                                            }}
                                        >
                                            {isSubmitting ? "Đang gửi..." : "Xác nhận đặt hàng"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Related Products or Back Button */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                        style={{
                            background: "linear-gradient(135deg, #D4AF37, #B668A1)",
                        }}
                    >
                        <ArrowLeft size={20} />
                        Xem tất cả sản phẩm
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    )
}
