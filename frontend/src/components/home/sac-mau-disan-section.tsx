"use client"

import { useInView } from "react-intersection-observer"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

export default function SacMauDiSanSection({ images = [] }) { // Pass array 3 images nếu có
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const sectionRef = useRef(null)

  // Parallax scroll cho hình (kéo tới đâu hiện hình tới đó)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]) // Hình SẮC di chuyển lên khi scroll
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]) // Hình MÀU di chuyển xuống nhẹ
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -80]) // Hình DI SẢN di chuyển lên

  // Placeholder images (thay bằng real URLs)
  const defaultImages = [
    '/images/sac-mau-disan/img1.jpg', // Tầng SẮC
    '/images/sac-mau-disan/img2.jpg', // Tầng MÀU
    '/images/sac-mau-disan/img3.jpg' // Tầng DI SẢN
  ]
  const imgSrc = images.length > 0 ? images : defaultImages

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3 // Delay giữa các tầng
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section id="sac_mau_disan" ref={sectionRef} className="relative w-full py-16 px-4 lg:px-8 bg-gradient-to-b from-[#f8fafc] to-[#FAF9F6]">
      {/* SVG Pattern Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="sac_mau_disan-pattern"
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
        <rect width="1200" height="800" fill="url(#sac_mau_disan-pattern)" />
      </svg>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-16"
        >
          {/* Block 1: Tiêu đề */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance" style={{ color: "#D4AF37" }}>
              SẮC – MÀU – DI SẢN
            </h1>
            <div className="w-24 h-1 mx-auto mb-4" style={{ backgroundColor: "#D4AF37" }} />
            <p
              className="text-center text-xl md:text-2xl italic leading-relaxed mb-4 mt-4 text-[#B668A1]"
            >
              Ba tầng ý nghĩa của hành trình
            </p>
          </motion.div>

          {/* Block 2: Tầng SẮC - Hình trái, Text phải */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              className="relative rounded-xl overflow-hidden shadow-lg order-2 lg:order-2"
              style={{ y: y1 }} // Parallax cho hình SẮC
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={imgSrc[0]}
                alt="Lễ hội đa dạng văn hóa Việt Nam"
                width={600}
                height={400}
                className="w-full h-64 lg:h-80 object-cover select-none"
              />
            </motion.div>
            <div className="space-y-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-[#D4AF37]/20 shadow-lg order-1 lg:order-1 flex flex-col justify-center">
              <div className="flex items-center space-x-3">
                {/* Icon bản đồ đa sắc */}
                {/* <svg className="w-10 h-10" fill="none" stroke="#D4AF37" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg> */}
                <h2 className="text-3xl font-serif font-bold" style={{ color: "#B668A1" }}>SẮC</h2>
              </div>
              <p className="leading-relaxed text-[#1f2937]" style={{ lineHeight: 1.7 }}>
                Là bản sắc, là tinh thần đặc trưng của mỗi vùng đất, mỗi con người.
              </p>
              <p className="leading-relaxed text-[#1f2937]" style={{ lineHeight: 1.7 }}>
                Chúng tôi mong muốn khắc họa nên một bức tranh văn hóa đa thanh, nơi mọi bản sắc — dù nhỏ bé hay xa xôi — đều được tôn trọng và cất lên tiếng nói tự hào. Bản sắc ấy không chỉ thuộc về một vùng miền hay một tộc người, mà là sự hòa quyện của mọi gam màu tạo nên Việt Nam trong hình hài văn hóa đa sắc.
              </p>
            </div>
          </motion.div>

          {/* Block 3: Tầng MÀU - Text trái, Hình phải */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-[#B668A1]/30 shadow-lg order-1 lg:order-2 flex flex-col justify-center" style={{ background: 'linear-gradient(to bottom, rgba(182,104,161,0.05), transparent)' }}>
              <div className="flex items-center space-x-3">
                {/* Icon cọ vẽ + công nghệ */}
                {/* <svg className="w-10 h-10" fill="none" stroke="#D4AF37" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg> */}
                <h2 className="text-3xl font-serif font-bold" style={{ color: "#B668A1" }}>MÀU</h2>
              </div>
              <p className="leading-relaxed text-[#1f2937]" style={{ lineHeight: 1.7 }}>
                Là sự sáng tạo, là hơi thở của thời đại được thổi vào di sản.
              </p>
              <p className="leading-relaxed text-[#1f2937]" style={{ lineHeight: 1.7 }}>
                Từ những chất liệu nguyên bản của “SẮC”, chúng tôi tái hiện, chuyển hóa và làm mới bằng công nghệ, nghệ thuật, và những phương thức kể chuyện hiện đại — để di sản không chỉ được lưu giữ, mà còn được <span className="italic">cảm</span> theo cách của người hôm nay.
              </p>
            </div>
            <motion.div
              className="relative rounded-xl overflow-hidden shadow-lg order-2 lg:order-1"
              style={{ y: y2 }} // Parallax cho hình MÀU
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={imgSrc[1]}
                alt="Triển lãm nghệ thuật đương đại tái hiện di sản Việt Nam"
                width={600}
                height={400}
                className="w-full h-64 lg:h-80 object-cover select-none"
              />
            </motion.div>
          </motion.div>

          {/* Block 4: Tầng DI SẢN - Hình trái, Text phải (xen kẽ như SẮC) */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              className="relative rounded-xl overflow-hidden shadow-lg order-2 lg:order-2"
              style={{ y: y3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={imgSrc[2]}
                alt="Hoa sen biểu tượng cội nguồn văn hóa Việt Nam"
                width={600}
                height={400}
                className="w-full h-64 lg:h-80 object-cover select-none"
              />
            </motion.div>
            <div className="space-y-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-[#D4AF37]/20 shadow-lg order-1 lg:order-1 flex flex-col justify-center" style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.05), transparent)' }}>
              <div className="flex items-center space-x-3">
                {/* Icon cây sen */}
                {/* <svg className="w-10 h-10" fill="none" stroke="#B668A1" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg> */}
                <h2 className="text-3xl font-serif font-bold" style={{ color: "#B668A1" }}>DI SẢN</h2>
              </div>
              <p className="leading-relaxed text-[#1f2937]" style={{ lineHeight: 1.7 }}>
                Là cội nguồn, là giá trị nhân văn sâu thẳm mà chúng tôi muốn gìn giữ và trao truyền từ thế trước đến thế hệ sau.
              </p>
              <p className="leading-relaxed text-[#1f2937]" style={{ lineHeight: 1.7 }}>
                Với chúng tôi, bảo tồn không có nghĩa là đóng khung, mà là mở rộng; không chỉ là giữ lại quá khứ, mà còn là thắp sáng tương lai bằng chính ánh sáng của quá khứ ấy.
              </p>
            </div>
          </motion.div>

          {/* Block 5: Kết thúc */}
          <motion.div variants={itemVariants} className="text-center space-y-6 p-8 bg-gradient-to-r from-[#B668A1]/10 to-[#D4AF37]/10 rounded-2xl">
            <blockquote className="italic text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: "#1f2937" }}>
              Vì vậy, Sắc Màu Di Sản không chỉ là một dự án, mà là hành trình của những con người trẻ chọn đồng hành cùng di sản bằng sự sáng tạo và niềm tự hào văn hóa Việt.
            </blockquote>
            <div className="flex justify-center">
              {/* Divider ba đường cong */}
              <svg className="w-32 h-1" viewBox="0 0 128 4" fill="none">
                <path d="M0 2 Q32 0 64 2 Q96 4 128 2" stroke="#D4AF37" strokeWidth="2" />
              </svg>
            </div>
            <p className="leading-relaxed max-w-2xl mx-auto text-[#1f2937]">
              Chúng tôi tin rằng, khi những sắc riêng hòa cùng nhau, chúng sẽ tạo nên một màu chung – thứ màu của kết nối, của ký ức, và của tương lai mà ở đó <span className="font-bold">di sản không chỉ được kể mà còn được thổi hồn bằng đam mê của người trẻ đương đại.</span>
            </p>
            {/* <button className="px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105" 
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #B668A1)' }}>
              Tham gia hành trình
            </button> */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}