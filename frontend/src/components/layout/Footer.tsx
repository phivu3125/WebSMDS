"use client"

import { useState } from "react"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Twitter } from "lucide-react"
import { BambooPattern } from "../ui/bamboo-pattern"
import Image from "next/image"
import { subscribeNewsletter } from "@/lib/api/email-subcriptions"

type FeedbackState = { type: "success" | "error"; message: string } | null

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterFeedback, setNewsletterFeedback] = useState<FeedbackState>(null)

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNewsletterFeedback(null)

    if (!newsletterEmail.trim()) {
      setNewsletterFeedback({ type: "error", message: "Vui lòng nhập email để đăng ký." })
      return
    }

    try {
      setNewsletterLoading(true)
      await subscribeNewsletter(newsletterEmail.trim())
      setNewsletterFeedback({ type: "success", message: "Đăng ký nhận tin thành công!" })
      setNewsletterEmail("")
    } catch (error) {
      const apiError = error as Error & { status?: number }
      const duplicateMessage = "Email này đã được đăng ký trước đó."
      const normalizedMessage = apiError?.message?.toLowerCase() ?? ""
      const isDuplicate = apiError?.status === 400 && normalizedMessage.includes("already subscribed")

      if (isDuplicate) {
        console.info("Subscribe newsletter skipped: duplicate email", apiError)
      } else {
        console.error("Subscribe newsletter error", apiError)
      }

      const message = isDuplicate ? duplicateMessage : "Đăng ký thất bại. Vui lòng thử lại sau."
      setNewsletterFeedback({ type: "error", message })
    } finally {
      setNewsletterLoading(false)
    }
  }

  return (
    <footer
      className="relative w-full py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden"
      style={{
        background: "linear-gradient(135deg, rgb(115, 66, 186) 0%, #B668A1 100%)",
      }}
    >
      <BambooPattern
        patternId="footer-bamboo"
        patternSize={950}
        opacity={0.05}
        fill="#f7f5f5"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Cột 1: Logo & Mô tả */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/images/logo2.png" alt="Sắc Màu Di Sản" width={180} height={180} className="-ml-2" />
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              Bảo tồn, phát huy và lan tỏa những giá trị văn hóa truyền thống Việt Nam qua
              công nghệ số và sáng tạo đương đại.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h3 className="font-semibold text-lg mb-4" style={{ color: "#fcd34d" }}>
              Liên Kết
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Về chúng tôi", href: "#about" },
                { label: "Sắc Màu Di Sản", href: "#sac_mau_disan" },
                { label: "Đánh thức di sản", href: "#hanh_trinh_danh_thuc_disan" },
                { label: "Hành trình", href: "#past_events" },
                { label: "Đối tác", href: "#partners" },
                { label: "Tin tức", href: "#news" },
                { label: "Toạ đàm", href: "#talk" },
                { label: "Liên hệ", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white transition-all duration-300"
                    style={{
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#fcd34d"
                      e.currentTarget.style.transform = "translateX(4px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)"
                      e.currentTarget.style.transform = "translateX(0)"
                    }}
                  >
                    → {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Thông tin liên hệ */}
          <div>
            <h3 className="font-semibold text-lg mb-4" style={{ color: "#fcd34d" }}>
              Liên Hệ
            </h3>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#fcd34d" }} />
                <span className="leading-relaxed">
                  Tầng 03, Tòa nhà Sihub - Trung tâm khởi nghiệp sáng tạo TP.HCM,
                  số 123 Trương Định, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#fcd34d" }} />
                <div>
                  <a
                    href="tel:0982055093"
                    className="hover:text-white transition-colors"
                    style={{ color: "#fcd34d" }}
                  >
                    098 205 5093
                  </a>
                  <p className="text-xs text-white/70 italic mt-1">
                    (9:00 - 17:00 từ thứ hai đến thứ sáu)
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0" style={{ color: "#fcd34d" }} />
                <a
                  href="mailto:info@santani.vn"
                  className="hover:text-white transition-colors"
                  style={{ color: "#fcd34d" }}
                >
                  info@santani.vn
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Theo dõi & Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4" style={{ color: "#fcd34d" }}>
              Theo Dõi Chúng Tôi
            </h3>
            <div className="flex gap-3 mb-6">
              {[
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Youtube, href: "#", label: "Youtube" },
                { Icon: Twitter, href: "#", label: "Twitter" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fcd34d"
                    e.currentTarget.style.transform = "scale(1.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                  aria-label={label}
                >
                  <Icon className="h-5 w-5 text-white" />
                </a>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-sm text-white/90 mb-3">
                Đăng ký nhận tin tức mới nhất
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    placeholder="Email của bạn"
                    className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={newsletterLoading}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "#fcd34d",
                      color: "white",
                    }}
                    onMouseEnter={(event) => {
                      if (!newsletterLoading) event.currentTarget.style.backgroundColor = "#fef3c7"
                    }}
                    onMouseLeave={(event) => {
                      if (!newsletterLoading) event.currentTarget.style.backgroundColor = "#fcd34d"
                    }}
                  >
                    {newsletterLoading ? "Đang đăng ký..." : "Gửi"}
                  </button>
                </div>
                {newsletterFeedback && (
                  <p className={`text-xs ${newsletterFeedback.type === "success" ? "text-green-200" : "text-red-200"}`}>
                    {newsletterFeedback.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
