"use client";

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Calendar, MapPin, ArrowRight } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Hướng Sắc Cổ Đô",
    description: "Khám phá vẻ đẹp kiến trúc và văn hóa của cố đô Huế",
    date: "15-20 Tháng 11, 2025",
    location: "Huế, Việt Nam",
    image: "/placeholder.svg?height=400&width=400",
    featured: true,
  },
  {
    id: 2,
    title: "Sắc Hội Tràng Thu",
    description: "Lễ hội thu hoạch truyền thống miền Bắc",
    date: "5-7 Tháng 12, 2025",
    location: "Hà Nội, Việt Nam",
    image: "/placeholder.svg?height=400&width=400",
    featured: false,
  },
  {
    id: 3,
    title: "Nghệ Thuật Sơn Mài",
    description: "Workshop trải nghiệm nghệ thuật sơn mài truyền thống",
    date: "10 Tháng 12, 2025",
    location: "TP. Hồ Chí Minh",
    image: "/placeholder.svg?height=400&width=400",
    featured: false,
  },
  {
    id: 4,
    title: "Âm Nhạc Dân Gian",
    description: "Đêm nhạc ca trù và hát xẩm truyền thống",
    date: "18 Tháng 12, 2025",
    location: "Hà Nội, Việt Nam",
    image: "/placeholder.svg?height=400&width=400",
    featured: false,
  },
]

export function EventsSection() {
  return (
    <section id="su-kien" className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="event-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#event-grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <Badge className="mb-4 bg-secondary/80 text-secondary-foreground border-0">Sự Kiện</Badge>
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Sự Kiện Đang Diễn Ra
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Tham gia cùng chúng tôi trong những hành trình khám phá văn hóa Việt Nam đầy ý nghĩa
          </p>
        </div>

        <Carousel className="w-full">  {/* Shadcn Carousel wrapper */}
          <CarouselContent className="-ml-1 transform -translate-x-[8%] md:-translate-x-[4%] lg:-translate-x-[2%]">  {/* Negative margin cho snap mượt */}
            {events.map((event) => (
              <CarouselItem  key={event.id} className="md:basis-1/2 lg:basis-1/3 pl-4">  {/* Responsive: 1/2/3 slides */}
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border hover:border-primary/20 h-full w-full">
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {event.featured && (
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-0 px-3 py-1">
                        Nổi Bật
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="p-6">
                    <CardTitle className="font-serif text-xl font-bold text-foreground mb-2 line-clamp-1">{event.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-foreground">
                      <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground">
                      <MapPin className="h-3 w-3 text-accent flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full rounded-full mt-4 border-2">
                      Tìm Hiểu Thêm
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />  {/* Shadcn buttons tự handle */}
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}