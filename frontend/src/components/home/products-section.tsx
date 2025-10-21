import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"

const products = [
    {
        id: 1,
        name: "Áo Dài Truyền Thống",
        description: "Áo dài lụa tơ tằm thêu tay họa tiết sen",
        price: "2.500.000đ",
        image: "/placeholder.svg?height=400&width=400",
    },
    {
        id: 2,
        name: "Tranh Sơn Mài",
        description: "Tranh sơn mài vẽ tay phong cảnh Hạ Long",
        price: "5.000.000đ",
        image: "/placeholder.svg?height=400&width=400",
    },
    {
        id: 3,
        name: "Gốm Sứ Bát Tràng",
        description: "Bộ ấm chén gốm sứ vẽ hoa sen xanh",
        price: "1.200.000đ",
        image: "/placeholder.svg?height=400&width=400",
    },
    {
        id: 4,
        name: "Nón Lá Thủ Công",
        description: "Nón lá Huế thêu thơ truyền thống",
        price: "350.000đ",
        image: "/placeholder.svg?height=300&width=500",
    },
    {
        id: 5,
        name: "Túi Thổ Cẩm",
        description: "Túi xách thổ cẩm dệt tay từ Tây Bắc",
        price: "450.000đ",
        image: "/placeholder.svg?height=400&width=400",
    },
    {
        id: 6,
        name: "Đèn Lồng Hội An",
        description: "Đèn lồng lụa thủ công phong cách Hội An",
        price: "280.000đ",
        image: "/placeholder.svg?height=400&width=400",
    },
]

export function ProductsSection() {
    return (
        <section id="san-pham" className="py-32 bg-muted/30 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="product-dots" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="1.5" fill="currentColor" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#product-dots)" />
                </svg>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <Badge className="mb-4 bg-secondary/80 text-secondary-foreground border-0">Sản Phẩm</Badge>
                    <h2 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
                        Sản Phẩm Đặc Sắc
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                        Những sản phẩm thủ công mang đậm bản sắc văn hóa Việt Nam, được tuyển chọn từ các nghệ nhân
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border hover:border-primary/20"
                        >
                            <div className="relative h-72 overflow-hidden bg-muted">
                                <img
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <CardContent className="p-6">
                                <h3 className="font-serif text-xl font-bold mb-2 text-foreground">{product.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{product.description}</p>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-2xl font-bold text-primary font-mono">{product.price}</span>
                                    <Button size="sm" variant="outline" className="rounded-full border-2 bg-transparent">
                                        <ShoppingBag className="h-4 w-4 mr-2" />
                                        Mua
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
                        Xem Tất Cả Sản Phẩm
                    </Button>
                </div>
            </div>
        </section>
    )
}
