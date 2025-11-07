"use client"

import Link from "next/link"
import { LotusPattern } from "@/components/ui/lotus-pattern"

export default function NotFound() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 text-white"
      style={{
        background: "linear-gradient(135deg, rgba(115, 66, 186, 0.95) 0%, rgba(182, 104, 161, 0.9) 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <LotusPattern
          patternId="not-found-lotus"
          patternSize={260}
          opacity={0.1}
          rotation={-8}
          petalFill="#f7f5f5"
          pistilFill="#fae757"
        />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-2xl rounded-3xl bg-white/10 p-10 text-center backdrop-blur">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-yellow-200">404 - Không tìm thấy trang</p>
        <h1 className="mb-4 text-4xl font-serif font-bold md:text-5xl">
          Có vẻ bạn đang lạc vào miền di sản chưa được khám phá
        </h1>
        <p className="mb-8 text-sm md:text-base">
          Chúng tôi không tìm thấy đường dẫn bạn yêu cầu. Hãy quay lại trang chủ để tiếp tục hành trình cùng Sắc Màu Di Sản.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="w-full rounded-full px-6 py-3 text-center text-sm font-semibold text-[#5b21b6] transition-all duration-300 hover:shadow-lg sm:w-auto"
            style={{ backgroundColor: "#fcd34d" }}
          >
            Về trang chủ
          </Link>
          <Link
            href="/#events"
            className="w-full rounded-full border border-white/40 bg-white/10 px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:shadow-lg sm:w-auto"
          >
            Khám phá sự kiện nổi bật
          </Link>
        </div>
      </section>

      <footer className="relative z-10 mt-10 text-center text-xs text-white/80">
        <p> {new Date().getFullYear()} Sắc Màu Di Sản. Nếu cần hỗ trợ, vui lòng liên hệ với chúng tôi.</p>
      </footer>
    </main>
  )
}