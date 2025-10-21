import { Badge } from "@/components/ui/badge"

const partners = [
    { name: "Bảo Tàng Lịch Sử Việt Nam", logo: "/placeholder.svg?height=80&width=200" },
    { name: "Làng Nghề Bát Tràng", logo: "/placeholder.svg?height=80&width=200" },
    { name: "Trung Tâm Văn Hóa Huế", logo: "/placeholder.svg?height=80&width=200" },
    { name: "Hội An Heritage", logo: "/placeholder.svg?height=80&width=200" },
    { name: "Viện Nghiên Cứu Văn Hóa", logo: "/placeholder.svg?height=80&width=200" },
    { name: "Làng Nghề Truyền Thống", logo: "/placeholder.svg?height=80&width=200" },
]

export function PartnersSection() {
    return (
        <section id="doi-tac" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-secondary text-secondary-foreground">Đối Tác</Badge>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                        Đối Tác Của Chúng Tôi
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                        Cùng nhau bảo tồn và phát huy giá trị văn hóa Việt Nam
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {partners.map((partner, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center p-6 bg-card rounded-lg hover:shadow-md transition-shadow duration-300 group"
                        >
                            <img
                                src={partner.logo || "/placeholder.svg"}
                                alt={partner.name}
                                className="w-full h-auto opacity-60 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
