import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

const news = [
    {
        id: 1,
        title: 'Khai Mạc Triển Lãm "Sắc Màu Di Sản" Tại Bảo Tàng Lịch Sử',
        excerpt: "Triển lãm quy tụ hơn 200 hiện vật quý giá về văn hóa truyền thống Việt Nam từ các vùng miền...",
        date: "10 Tháng 10, 2025",
        image: "/placeholder.svg?height=300&width=500",
        category: "Sự Kiện",
    },
    {
        id: 2,
        title: "Workshop Nghệ Thuật Sơn Mài Thu Hút Hơn 100 Bạn Trẻ",
        excerpt: "Chương trình workshop giới thiệu kỹ thuật sơn mài truyền thống đã nhận được sự quan tâm lớn...",
        date: "5 Tháng 10, 2025",
        image: "/placeholder.svg?height=300&width=500",
        category: "Hoạt Động",
    },
    {
        id: 3,
        title: "Hợp Tác Với Làng Nghề Bát Tràng Phát Triển Sản Phẩm Mới",
        excerpt: "Dự án hợp tác nhằm kết hợp giữa kỹ thuật gốm sứ truyền thống và thiết kế hiện đại...",
        date: "28 Tháng 9, 2025",
        image: "/placeholder.svg?height=300&width=500",
        category: "Đối Tác",
    },
]

export function NewsSection() {
    return (
        <section id="tin-tuc" className="py-24 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-secondary text-secondary-foreground">Tin Tức</Badge>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                        Tin Tức Mới Nhất
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                        Cập nhật những hoạt động và sự kiện mới nhất của Sắc Màu Di Sản
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <Card key={item.id} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{item.category}</Badge>
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{item.date}</span>
                                </div>
                                <h3 className="font-serif text-lg font-bold mb-2 text-foreground line-clamp-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{item.excerpt}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
