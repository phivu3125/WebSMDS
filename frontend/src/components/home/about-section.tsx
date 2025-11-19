"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

export default function AboutSection({ images = [] }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [showFullText, setShowFullText] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideInterval = useState(3000)

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (images.length || 6))
    }, slideInterval[0])
    return () => clearInterval(interval)
  }, [images.length])

  // Placeholder if no images provided
  const defaultImages = [
    '/images/about-us/img1.JPG', '/images/about-us/img2.JPG', '/images/about-us/img3.JPG',
    '/images/about-us/img4.JPG', '/images/about-us/img5.JPG', '/images/about-us/img6.JPG'
  ]
  const imgSrc = images.length > 0 ? images : defaultImages

  const boldText = (text: string) => (
    <span style={{ fontWeight: '600' }}>
      {text}
    </span>
  )

  const italicText = (text: string) => (
    <span style={{ fontStyle: 'italic' }}>
      {text}
    </span>
  )

  return (
    <section
      id="about"
      ref={ref}
      className="relative w-full py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#f8fafc" }}
    >
      {/* SVG Pattern Background - Update purple stroke */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="lotus-pattern" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
            <circle cx="150" cy="150" r="100" fill="none" stroke="#B668A1" strokeWidth="2" />
            <circle cx="150" cy="150" r="70" fill="none" stroke="#B668A1" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="1200" height="800" fill="url(#lotus-pattern)" />
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Tiêu đề - Giữ center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance" style={{ color: "#D4AF37" }}>
            KHỞI NGUỒN CỦA HÀNH TRÌNH
          </h2>
          <div className="w-24 h-1 mx-auto" style={{ backgroundColor: "#D4AF37" }} />
          <p
            className="text-center text-xl md:text-2xl italic leading-relaxed mb-4 mt-4"
            style={{ color: "#1f2937" }}
          >
            “Từ những nỗ lực gặp gỡ giữa văn hóa và công nghệ, một hành trình dài hơn được hình thành.”
          </p>
        </motion.div>

        {/* Grid Layout: 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-start"
        >
          {/* Left: Carousel of images */}
          <motion.div
            className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg select-none"
            whileHover={{ scale: 1.02 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={imgSrc[currentSlide]}
                  alt={`Hoạt động ${currentSlide + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Dots navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {imgSrc.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-[#D4AF37]' : 'bg-white/50'}`}
                />
              ))}
            </div>

            {/* Arrows (tùy chọn, dùng icon SVG nếu cần) */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + imgSrc.length) % imgSrc.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % imgSrc.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
            >
              ›
            </button>
          </motion.div>

          {/* Right: Text with highlight */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-8 border shadow-md" style={{ borderColor: "#B668A1" }}>
              <p className="leading-relaxed text-justify mb-4" style={{ color: "#1f2937", lineHeight: 1.7 }}>
                Mọi hành trình đều bắt đầu từ một niềm tin — rằng những giá trị của {boldText('di sản và văn hóa Việt Nam')} xứng đáng
                được tiếp nối, được sống cùng hơi thở của thời đại. Với chúng tôi, đó là khởi đầu của {italicText('Sắc Màu Di Sản')}.
              </p>

              <p className="leading-relaxed text-justify mb-4" style={{ color: "#1f2937", lineHeight: 1.7 }}>
                Là những người trẻ đam mê văn hóa và bản sắc dân tộc, chúng tôi không chỉ đơn giản nghĩ rằng văn hóa là những
                giá trị hiện diện trong xã hội, mà sâu xa hơn nữa, văn hóa chính là những gì thuộc căn tính, là tiếng vọng
                từ trong cội nguồn, gốc rễ của mỗi con người, là một phần &ldquo;nhân văn&rdquo; trong tâm hồn của mỗi người dân Việt Nam.
              </p>

              {showFullText && (
                <div className="space-y-4 mt-4">
                  <p className="leading-relaxed text-justify" style={{ color: "#1f2937", lineHeight: 1.7 }}>
                    Từ sự thấu hiểu rằng văn hóa như một phần của đời sống con người, chúng tôi cùng chung tay nỗ lực bảo tồn
                    và phát huy văn hóa, di sản qua những câu chuyện từ Mỹ Vị Việt Nam, Chợ Lớn Food Story, hay những dự án
                    số hóa các không gian văn hóa bằng giải pháp công nghệ hiện đại như thư viện Danh Nhân Nam Bộ, không gian
                    Văn hóa đọc trực tuyến. Chúng tôi từng bước đi qua nhiều con đường khác nhau, cùng một khát vọng chung:
                    {italicText(' làm cho di sản trở nên gần gũi, có thể chạm, có thể cảm, và có thể sống trong đời sống hôm nay.')}
                  </p>

                  <p className="leading-relaxed text-justify" style={{ color: "#1f2937", lineHeight: 1.7 }}>
                    Tuy nhiên, qua những bước đi đầu tiên, chúng tôi nhận thấy rằng, để di sản thật sự &ldquo;sống&rdquo;, cần phải có một
                    {boldText(' hệ sinh thái kết nối')}, nơi những giá trị truyền thống được tiếp sức bởi sáng tạo đương đại, nơi những nguồn lực
                    từ mọi miền mang bản sắc riêng, độc đáo hòa chung thành một hệ sinh thái sống động mang tên {italicText('Sắc Màu Di Sản')}.
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowFullText(!showFullText)}
                className="font-semibold mt-4 transition-all duration-300 hover:scale-105 flex items-center select-none cursor-pointer"
                style={{ color: "#D4AF37" }}
              >
                {showFullText ? "Thu gọn" : "Tìm hiểu thêm"}
                <motion.div
                  animate={{ rotate: showFullText ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-1"
                >
                  <ChevronDown size={32} />
                </motion.div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}