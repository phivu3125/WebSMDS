"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { useInView } from "react-intersection-observer"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

const paragraphs = [
  "Trên hành trình kết nối văn hóa với đời sống đương đại, không dừng lại ở việc kể chuyện — chúng tôi tìm cách thổi hồn công nghệ vào ký ức, để mỗi di sản không chỉ được nhìn thấy, mà còn được chạm, nghe và cảm nhận.",
  "Công nghệ trở thành cây cầu nối giữa người xưa và người nay, giúp chúng ta bước vào không gian của di sản bằng những trải nghiệm mới mẻ, gần gũi hơn bao giờ hết.",
  "Từ thực tế tăng cường (AR), thực tế ảo (VR) cho đến trưng bày số hóa, mô phỏng tương tác, chúng tôi đang từng bước khiến di sản “sống” trong không gian số, để ai cũng có thể tiếp cận, khám phá và thêm yêu văn hóa Việt.",
]

const projects = [
  {
    title: "Thiên Hùng Ca Sử Việt",
    description:
      "Ứng dụng công nghệ tương tác kể lại lịch sử qua hình ảnh, âm thanh và chuyển động, giúp thế hệ trẻ “chạm” vào sử Việt bằng cảm xúc thật.",
    image: "/images/about-us/img1.JPG",
  },
  {
    title: "Không gian di sản số hóa 3D",
    description:
      "Khu di tích và điểm đến du lịch văn hóa được tái hiện bằng mô hình số hóa 3D và trưng bày tương tác, tái tạo không khí lễ hội giữa lòng đô thị.",
    image: "/images/about-us/img2.JPG",
  },
  {
    title: "Số hóa đình đền Sài Gòn",
    description:
      "Các đình, đền như Lăng Võ Tánh, Đình An Khánh… được quét 3D và chụp ảnh thực địa, tái hiện trong không gian trưng bày ảo để gìn giữ giá trị kiến trúc, tín ngưỡng và mỹ thuật.",
    image: "/images/about-us/img3.JPG",
  },
  {
    title: "Phòng truyền thống doanh nghiệp",
    description:
      "Mô hình kết hợp giữa công nghệ và ký ức tập thể, nơi mỗi hiện vật kể lại câu chuyện của một hành trình phát triển.",
    image: "/images/about-us/img4.JPG",
  },
  {
    title: "Triển lãm văn hóa Hồ Chí Minh",
    description:
      "Ứng dụng công nghệ cảm ứng và trình chiếu tương tác để đưa tinh thần văn hóa của Thành phố vào trải nghiệm sống động, gần gũi.",
    image: "/images/about-us/img5.JPG",
  },
  {
    title: "Trải nghiệm AR Thả lồng đèn ảo",
    description:
      "Cho phép du khách thả những chiếc đèn lồng ảo mang lời chúc tốt lành, để di sản trở thành một phần của ký ức số lung linh và bền vững.",
    image: "/images/about-us/img6.JPG",
  },
]

export default function HanhTrinhDanhThucDiSanSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const [showMore, setShowMore] = useState(false)

  return (
    <section
      id="hanh_trinh_danh_thuc_disan"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#f8fafc] via-white to-[#FAF9F6] py-20 px-4 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_15%_20%,rgba(182,104,161,0.18),transparent_55%),radial-gradient(circle_at_85%_10%,rgba(212,175,55,0.2),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,255,255,0.6),transparent_65%)]" />
        <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-gradient-to-br from-[#B668A1]/40 via-[#D4AF37]/30 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-gradient-to-tl from-[#D4AF37]/30 via-[#B668A1]/20 to-transparent blur-3xl" />
        <svg
          className="absolute -bottom-24 left-[-10%] w-[620px] opacity-25"
          viewBox="0 0 640 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 310C140 210 260 250 400 150C520 60 600 120 630 30" stroke="#B668A1" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 250C140 150 260 190 400 90C520 0 600 60 630 -30" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <svg
          className="absolute right-[-8%] top-12 w-[420px] opacity-20"
          viewBox="0 0 420 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="210" cy="210" r="200" stroke="#B668A1" strokeWidth="1.2" strokeDasharray="12 18" />
          <circle cx="210" cy="210" r="140" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="16 22" />
        </svg>
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl">
        <motion.div variants={containerVariants} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <motion.div variants={fadeUp} className="text-center">
            <h2 className="text-4xl font-serif font-bold uppercase text-[#D4AF37] md:text-5xl">
              HÀNH TRÌNH ĐÁNH THỨC DI SẢN
            </h2>
            <div className="mx-auto mt-4 h-1 w-24" style={{ backgroundColor: "#D4AF37" }} />
          </motion.div>

          <motion.blockquote
            variants={fadeUp}
            className="text-center text-xl md:text-2xl italic leading-relaxed mb-4 mt-12"
            style={{ color: "#1f2937" }}
          >
            “Di sản không ngủ yên trong quá khứ, mà là mạch sống đang chuyển động trong hơi thở đương đại.”
          </motion.blockquote>

          <AnimatePresence>
            {showMore && (
              <motion.div
                key="more-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
              >
                <div className="mt-8 rounded-3xl bg-white/85 px-6 py-6 text-base leading-relaxed text-[#1F2937] shadow-lg ring-1 ring-[#B668A1]/15 md:px-10 md:py-8 md:text-lg">
                  {paragraphs.map((paragraph, index) => (
                    <p key={index} className={index < paragraphs.length - 1 ? "mb-5" : undefined}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            variants={fadeUp}
            type="button"
            onClick={() => setShowMore((prev) => !prev)}
            className="mx-auto mt-10 flex items-center gap-2 rounded-full px-6 py-2 font-semibold transition-all duration-300 hover:scale-105 select-none cursor-pointer"
            style={{
              backgroundColor: "transparent",
              color: "#B668A1",
              border: "2px solid #B668A1",
            }}
          >
            {showMore ? "Thu gọn" : "Tìm hiểu thêm"}
            {showMore ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </motion.button>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex justify-center"
          >
            <div className="inline-flex items-center gap-3 rounded-full bg-white/80 px-6 py-2 font-serif font-semibold text-[#4C1D95] shadow-md ring-1 ring-[#D4AF37]/40 backdrop-blur-md md:px-8 md:py-3 md:text-base">
              <span className="h-1 w-6 rounded-full bg-[#D4AF37]" />
              <span className="uppercase text-xl whitespace-nowrap">NHỮNG DỰ ÁN TIÊU BIỂU</span>
              <span className="h-1 w-6 rounded-full bg-[#D4AF37]" />
            </div>
          </motion.div>

          <div className="mt-14 space-y-12">
            {projects.map((project, index) => {
              const isEven = index % 2 === 1
              const textOrderClass = isEven ? "order-2 lg:order-2" : "order-1 lg:order-1"
              const imageOrderClass = isEven ? "order-1 lg:order-1" : "order-2 lg:order-2"

              return (
                <motion.div
                  key={project.title}
                  variants={fadeUp}
                  className="grid grid-cols-1 items-center gap-8 rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-[#B668A1]/10 md:p-10 lg:grid-cols-2"
                >
                  <div className={`space-y-3 ${textOrderClass}`}>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#B668A1]/10 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-[#B668A1]">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span className="h-1 w-8 rounded-full bg-[#D4AF37]" />
                    </div>
                    <h3 className="text-2xl font-serif font-semibold text-[#4C1D95]">{project.title}</h3>
                    <p className="text-base leading-relaxed text-[#1F2937] md:text-lg">{project.description}</p>
                  </div>

                  <div className={`relative overflow-hidden rounded-2xl ${imageOrderClass}`}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#B668A1]/20 via-transparent to-[#D4AF37]/20" />
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={720}
                      height={480}
                      className="relative h-60 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-72 lg:h-80"
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            variants={fadeUp}
            className="mt-16 rounded-3xl bg-gradient-to-r from-[#B668A1]/15 via-[#D4AF37]/15 to-[#B668A1]/15 p-8 text-center text-[#1F2937] shadow-lg"
          >
            <p className="text-lg leading-relaxed md:text-xl">
              Với chúng tôi, công nghệ không chỉ là công cụ, mà là ngôn ngữ mới để kể lại câu chuyện di sản — một câu chuyện
              không chỉ lưu giữ trong quá khứ, mà đang từng ngày lớn lên cùng hiện tại.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
