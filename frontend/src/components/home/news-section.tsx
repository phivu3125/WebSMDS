"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Calendar, ExternalLink, Youtube } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { getPress, PressItem } from "@/lib/api/press"
import { resolveMediaUrl } from "@/lib/media"

const formatVNDate = (date: string): string => {
  if (!date) return ""
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

type NewsSectionProps = {
  initialPress?: PressItem[]
}

function FeaturedSkeleton() {
  return (
    <div className="lg:col-span-2 h-[420px] rounded-xl bg-white shadow-md animate-pulse" />
  )
}

function RegularSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4 animate-pulse">
      <div className="w-24 h-24 rounded-lg bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-28 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

export default function NewsSection({ initialPress = [] }: NewsSectionProps) {
  const [pressArticles, setPressArticles] = useState<PressItem[]>(initialPress)
  const [isLoading, setIsLoading] = useState(initialPress.length === 0)
  const [error, setError] = useState<string | null>(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    if (initialPress.length > 0) return

    let isMounted = true

    const fetchPress = async () => {
      try {
        setIsLoading(true)
        const response = await getPress()
        if (!isMounted) return
        setPressArticles(response.data ?? [])
        setError(null)
      } catch (err) {
        if (!isMounted) return
        console.error("Failed to load press articles", err)
        setError("Không thể tải dữ liệu truyền thông. Vui lòng thử lại sau.")
        setPressArticles([])
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    }

    fetchPress()

    return () => {
      isMounted = false
    }
  }, [])

  const featuredArticles = useMemo(
    () => pressArticles.filter((article) => article.featured),
    [pressArticles]
  )

  const highlightedArticle = useMemo(() => {
    if (featuredArticles.length > 0) {
      return featuredArticles[0]
    }

    if (pressArticles.length > 0) {
      return pressArticles[0]
    }

    return null
  }, [featuredArticles, pressArticles])

  const remainingArticles = useMemo(() => {
    if (pressArticles.length === 0) return []

    const rest = pressArticles.filter((article) => article.id !== highlightedArticle?.id)
    const prioritized = rest.filter((article) => article.featured)
    const others = rest.filter((article) => !article.featured)

    return [...prioritized, ...others]
  }, [pressArticles, highlightedArticle?.id])

  const regularDisplay = useMemo<(PressItem | null)[]>(
    () =>
      isLoading
        ? Array.from({ length: 5 }).map(() => null)
        : remainingArticles.slice(0, 5),
    [isLoading, remainingArticles]
  )

  return (
    <section
      id="news"
      ref={ref}
      className="relative w-full py-20 px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(to bottom, #ffffff 0%, #FAF9F6 100%)",
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="news-pattern"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="100" cy="100" r="50" fill="none" stroke="#D4AF37" strokeWidth="1" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="#B668A1" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1200" height="800" fill="url(#news-pattern)" />
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance"
            style={{ color: "#D4AF37" }}
          >
            TRONG DÒNG CHẢY VĂN HÓA ĐƯƠNG ĐẠI
          </h2>
          <div className="w-24 h-1 mx-auto" style={{ backgroundColor: "#D4AF37" }} />
          <p
            className="text-center text-lg md:text-xl italic mt-6 leading-relaxed max-w-3xl mx-auto"
            style={{ color: "#1f2937" }}
          >
            &ldquo;Sắc Màu Di Sản được đồng hành cùng các cơ quan truyền thông trong việc lan tỏa giá trị văn hóa.&rdquo;
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {error && (
            <div className="lg:col-span-3">
              <p className="text-center text-sm text-red-500">{error}</p>
            </div>
          )}

          {isLoading && !highlightedArticle && !error && <FeaturedSkeleton />}

          {highlightedArticle && (
            <motion.div
              key={highlightedArticle.id}
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`lg:col-span-2 group bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 relative ${highlightedArticle.featured ? "border-2 border-[#D4AF37]" : "border border-transparent"
                }`}
            >
              <div className="absolute top-6 left-6 z-20 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {highlightedArticle.featured ? "NỔI BẬT" : "GỢI Ý"}
              </div>

              <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
                <Image
                  src={resolveMediaUrl(highlightedArticle.image) || "/placeholder.svg"}
                  alt={highlightedArticle.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  priority
                  placeholder="blur"
                  blurDataURL="/placeholder.svg"
                />
                {highlightedArticle.type === "video" && (
                  <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                    <Youtube size={16} />
                    Video
                  </div>
                )}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(to top, rgba(212, 175, 55, 0.4), transparent)",
                  }}
                />
              </div>

              <div className="p-8 lg:p-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg shadow-md text-white" style={{ backgroundColor: "#D4AF37" }}>
                    {highlightedArticle.source}
                  </span>
                  <p className="text-sm font-semibold flex items-center gap-2 text-gray-500">
                    <Calendar size={16} />
                    {formatVNDate(highlightedArticle.date)}
                  </p>
                </div>

                <h3 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900">
                  {highlightedArticle.title}
                </h3>
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                  {highlightedArticle.description}
                </p>

                <a
                  href={highlightedArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-lg font-semibold text-[#B668A1] hover:gap-3 transition-all"
                >
                  {highlightedArticle.type === "video" ? "Xem video" : "Đọc bài viết"}
                  <ExternalLink size={18} />
                </a>
              </div>
            </motion.div>
          )}

          {!isLoading && !error && featuredArticles.length === 0 && (
            <div className="lg:col-span-2 text-center text-sm text-gray-500">
              Chưa có bài nổi bật.
            </div>
          )}

          <div className="lg:col-span-1 flex flex-col gap-6">
            {regularDisplay.map((article, index) => (
              <motion.div
                key={article ? article.id : `skeleton-${index}`}
                initial={{ opacity: 0, x: 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-transparent hover:border-[#B668A1]"
              >
                {article ? (
                  <div className="flex gap-4 p-4">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={resolveMediaUrl(article.image) || "/placeholder.svg"}
                        alt={article.title}
                        fill
                        sizes="96px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        placeholder="blur"
                        blurDataURL="/placeholder.svg"
                      />
                      {article.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Youtube size={24} className="text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded text-white"
                        style={{ backgroundColor: "#D4AF37" }}
                      >
                        {article.source}
                      </span>
                      <h4 className="font-serif text-sm font-bold mt-2 mb-1 line-clamp-2 text-gray-900 group-hover:text-[#B668A1] transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-1 line-clamp-1 leading-relaxed">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs flex items-center gap-1 text-gray-400">
                          <Calendar size={10} />
                          {formatVNDate(article.date)}
                        </p>
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold flex items-center gap-1 text-[#B668A1] hover:gap-2 transition-all"
                        >
                          Xem thêm
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <RegularSkeleton />
                )}
              </motion.div>
            ))}
            {!isLoading && !error && remainingArticles.length === 0 && (
              <p className="text-sm text-gray-500 text-center">Chưa có bài truyền thông nào.</p>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/press"
            className="inline-block px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #B668A1)",
            }}
          >
            Xem Tất Cả Bài Viết
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
