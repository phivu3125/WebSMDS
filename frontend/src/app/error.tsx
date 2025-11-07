"use client"

import Link from "next/link"
import { useEffect } from "react"
import { LotusPattern } from "@/components/ui/lotus-pattern"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 text-white"
      style={{
        background: "linear-gradient(135deg, rgba(115, 66, 186, 0.95) 0%, rgba(182, 104, 161, 0.9) 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <LotusPattern
          patternId="error-lotus"
          patternSize={260}
          opacity={0.1}
          rotation={12}
          petalFill="#f7f5f5"
          pistilFill="#fae757"
        />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-2xl rounded-3xl bg-white/10 p-10 backdrop-blur">
        <header className="mb-6 text-center">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-yellow-200">Đã xảy ra lỗi</p>
          <h1 className="text-3xl font-serif font-bold leading-tight md:text-4xl">
            Rất tiếc, chúng tôi gặp sự cố ngoài ý muốn
          </h1>
        </header>

        <article className="space-y-4 text-center text-sm md:text-base">
          <p>
            Có vẻ như hệ thống vừa gặp trục trặc khi xử lý yêu cầu của bạn. Đội ngũ kỹ thuật sẽ kiểm tra và khắc phục sớm nhất có thể.
          </p>
          <p>
            Bạn có thể thử tải lại trang hoặc quay về trang chủ để tiếp tục khám phá Sắc Màu Di Sản.
          </p>
        </article>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="w-full rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:shadow-lg sm:w-auto"
          >
            Thử lại
          </button>
          <Link
            href="/"
            className="w-full rounded-full px-6 py-3 text-center text-sm font-semibold text-[#5b21b6] transition-all duration-300 hover:shadow-lg sm:w-auto"
            style={{ backgroundColor: "#fcd34d" }}
          >
            Về trang chủ
          </Link>
        </div>
      </section>

      <footer className="relative z-10 mt-10 text-center text-xs text-white/80">
        <p>© {new Date().getFullYear()} Sắc Màu Di Sản. Cảm ơn bạn đã đồng hành cùng chúng tôi.</p>
        {error.digest && (
          <p className="mt-1 font-mono text-[11px] text-white/60">Mã lỗi: {error.digest}</p>
        )}
      </footer>
    </main>
  )
}