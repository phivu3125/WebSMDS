"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const journeys = [
    {
        id: 1,
        title: "Hướng Sắc Cổ Đô - Huế 2024",
        description: "Hành trình khám phá kiến trúc và ẩm thực cung đình Huế",
        image: "/placeholder.svg?height=400&width=400",
        date: "Tháng 3, 2024",
    },
    {
        id: 2,
        title: "Sắc Hội Tràng Thu - Hà Nội 2024",
        description: "Trải nghiệm lễ hội thu hoạch truyền thống miền Bắc",
        image: "/placeholder.svg?height=400&width=400",
        date: "Tháng 9, 2024",
    },
    {
        id: 3,
        title: "Nghệ Thuật Làng Nghề - Bắc Ninh",
        description: "Tìm hiểu nghệ thuật dân gian và làng nghề truyền thống",
        image: "/placeholder.svg?height=400&width=400",
        date: "Tháng 6, 2024",
    },
    {
        id: 4,
        title: "Âm Nhạc Dân Gian - Hội An",
        description: "Đêm nhạc truyền thống tại phố cổ Hội An",
        image: "/placeholder.svg?height=400&width=400g",
        date: "Tháng 12, 2024",
    },
]

export function JourneysSection() {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 400
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            })
        }
    }

    return (
        <section id="hanh-trinh" className="py-24 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-secondary text-secondary-foreground">Hành Trình</Badge>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                        Những Hành Trình Đã Qua
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                        Cùng nhìn lại những khoảnh khắc đáng nhớ trong hành trình bảo tồn văn hóa của chúng tôi
                    </p>
                </div>

                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {journeys.map((journey) => (
                            <Card
                                key={journey.id}
                                className="flex-shrink-0 w-[350px] overflow-hidden group hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={journey.image || "/placeholder.svg"}
                                        alt={journey.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-white/90 text-foreground backdrop-blur-sm">{journey.date}</Badge>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="font-serif text-xl font-bold mb-2 text-foreground">{journey.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{journey.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                        <Button variant="outline" size="icon" onClick={() => scroll("left")} className="rounded-full">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => scroll("right")} className="rounded-full">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
