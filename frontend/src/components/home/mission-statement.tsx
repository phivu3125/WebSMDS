import { EnvelopeClosedIcon } from "@radix-ui/react-icons"
import { Sparkles } from "lucide-react"

export function MissionStatement() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <EnvelopeClosedIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Thông Điệp</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-balance">
            Mỗi Chạm Là Một Ký Ức
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-3xl mx-auto">
            Mỗi Chạm trong hành trình "Sắc Màu Di Sản" không chỉ là một trải nghiệm nghệ thuật, mà còn là ngọn lửa nhỏ
            thắp sáng ký ức tập thể, để di sản ấy không chỉ nằm trong trang sách, mà sống động trong cảm xúc của hàng
            trăm người tham dự.
          </p>

          <p className="text-base text-muted-foreground italic max-w-2xl mx-auto">
            Đây không đơn thuần là một sự kiện – mà là một hành trình gìn giữ niềm tự hào văn hóa Việt, để mỗi người đến
            đều mang theo một mảnh ký ức đẹp về quê hương.
          </p>
        </div>
      </div>
    </section>
  )
}
