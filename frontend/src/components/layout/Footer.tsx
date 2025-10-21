import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                <span className="text-foreground font-bold text-lg">SM</span>
              </div>
              <span className="font-serif text-xl font-bold">Sắc Màu Di Sản</span>
            </div>
            <p className="text-background/80 text-sm leading-relaxed">
              Bảo tồn, phát huy và lan tỏa những giá trị văn hóa truyền thống Việt Nam
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Liên Kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#su-kien" className="text-background/80 hover:text-background transition-colors">
                  Sự Kiện
                </a>
              </li>
              <li>
                <a href="#ve-chung-toi" className="text-background/80 hover:text-background transition-colors">
                  Về Chúng Tôi
                </a>
              </li>
              <li>
                <a href="#hanh-trinh" className="text-background/80 hover:text-background transition-colors">
                  Hành Trình
                </a>
              </li>
              <li>
                <a href="#san-pham" className="text-background/80 hover:text-background transition-colors">
                  Sản Phẩm
                </a>
              </li>
              <li>
                <a href="#tin-tuc" className="text-background/80 hover:text-background transition-colors">
                  Tin Tức
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Liên Hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-background/80">Văn phòng [số], Tầng 03, Tòa nhà Sihub - Trung tâm khởi nghiệp sáng tạo TP.HCM, số 123 Trương Định, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">  {/* Wrapper để text wrap tốt */}
                  <a>
                    098 205 5093
                  </a>
                  <p className="text-sm text-muted-foreground italic leading-relaxed mt-0.5">  {/* Italic cho giờ, muted color */}
                    (9:00 - 17:00 từ thứ hai đến thứ sáu)
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-background/80">info@santani.vn</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Theo Dõi</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-sm text-background/60">
          <p>&copy; 2025 Sắc Màu Di Sản. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
