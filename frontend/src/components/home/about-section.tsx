import { Badge } from "@/components/ui/badge"
import { Archive, Sprout, Megaphone } from "lucide-react"

const values = [
    {
        icon: Archive,
        title: "Gìn Giữ",
        description: "Bảo tồn làng nghề truyền thống và di sản văn hóa Việt Nam qua từng thế hệ",
    },
    {
        icon: Sprout,
        title: "Phát Triển",
        description: "Ứng dụng công nghệ và sáng tạo để phát triển di sản một cách bền vững",
    },
    {
        icon: Megaphone,
        title: "Lan Tỏa",
        description: "Đưa di sản văn hóa đến gần hơn với công chúng, đặc biệt là thế hệ trẻ",
    },
]

export function AboutSection() {
    return (
        <section id="ve-chung-toi" className="py-24 bg-muted/30 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02]">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="tech-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <circle cx="30" cy="30" r="1" fill="currentColor" />
                            <circle cx="0" cy="0" r="1" fill="currentColor" />
                            <circle cx="60" cy="0" r="1" fill="currentColor" />
                            <circle cx="0" cy="60" r="1" fill="currentColor" />
                            <circle cx="60" cy="60" r="1" fill="currentColor" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#tech-grid)" />
                </svg>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch min-h-[600px]">
                    <div className="relative h-full">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-full">
                            <img
                                src="/placeholder.svg?height=1024&width=1024"
                                alt="Về chúng tôi"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary/20 rounded-full blur-3xl -z-10" />
                        <div className="absolute -top-6 -left-6 w-48 h-48 bg-accent/20 rounded-full blur-3xl -z-10" />
                    </div>

                    <div className="space-y-8">
                        <div>
                            <Badge className="mb-4 bg-secondary text-secondary-foreground">Về Chúng Tôi</Badge>
                            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                                Tầm Nhìn và Sứ Mệnh
                            </h2>

                            <div className="space-y-4">
                                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                                    Giữa nhịp sống hiện đại, <span className="font-semibold text-foreground">"Sắc Màu Di Sản"</span> ra
                                    đời như một cây cầu nối quá khứ và hiện tại — nơi mỗi người được chạm tay vào ký ức văn hoá, thưởng
                                    thức tinh hoa thủ công, và sống lại những khoảnh khắc mang đậm hồn Việt.
                                </p>
                                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                                    Chuỗi sự kiện được thiết kế với tinh thần{" "}
                                    <span className="font-semibold text-foreground">
                                        kết hợp thẩm mỹ truyền thống và công nghệ đương đại
                                    </span>
                                    , để mỗi trải nghiệm không chỉ là tham quan mà là một hành trình cảm xúc, một di sản được đánh thức.
                                </p>
                                <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                                    <p className="text-base font-medium text-foreground">
                                        Tất cả tâm huyết đều hướng tới một sứ mệnh duy nhất:{" "}
                                        <span className="text-primary">Gìn giữ – Phát triển – Lan tỏa</span> những làng nghề truyền thống và
                                        di sản văn hóa Việt đến gần hơn với công chúng.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-4">
                            {values.map((value, index) => (
                                <div key={index} className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <value.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-foreground mb-1">{value.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
