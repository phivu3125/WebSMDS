import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/vietnamese-traditional-architecture-with-red-lacqu.jpg"
          alt="Vietnamese heritage"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 z-10 text-center">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 backdrop-blur-sm rounded-full border border-border">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <p className="text-sm text-foreground/80 font-medium">Cầu nối giữa quá khứ và hiện tại</p>
          </div>

          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold text-foreground text-balance leading-[0.95] tracking-tight">
            Sắc Màu
            <br />
            <span className="text-primary">Di Sản</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
            Hành trình chạm – cảm – gìn giữ di sản qua từng mùa lễ hội, kết hợp thẩm mỹ truyền thống và công nghệ đương
            đại
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 h-12 rounded-full"
            >
              Khám Phá Sự Kiện
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 text-base px-8 h-12 rounded-full hover:bg-muted bg-transparent"
            >
              Tìm Hiểu Thêm
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="text-4xl md:text-5xl font-bold text-primary font-mono">50+</div>
              <div className="text-sm text-muted-foreground">Sự kiện</div>
            </div>
            <div className="space-y-4">
              <div className="text-4xl md:text-5xl font-bold text-accent font-mono">10K+</div>
              <div className="text-sm text-muted-foreground">Người tham gia</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-secondary-foreground font-mono">30+</div>
              <div className="text-sm text-muted-foreground">Làng nghề</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
