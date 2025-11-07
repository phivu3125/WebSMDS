"use client"

import type React from "react"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Mail, Facebook, Instagram, Twitter, ArrowUp } from "lucide-react"
import { ChevronUp, ChevronDown } from "lucide-react"

import { submitStory } from "@/lib/api/stories"
import { submitIdea } from "@/lib/api/ideas"
import { subscribeNewsletter } from "@/lib/api/email-subcriptions"

type FeedbackState = { type: "success" | "error"; message: string } | null

export default function ContactSection() {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
    const [activeTab, setActiveTab] = useState("story")
    const [storyForm, setStoryForm] = useState({
        title: "",
        author: "",
        email: "",
        content: "",
    })
    const [storyLoading, setStoryLoading] = useState(false)
    const [storyFeedback, setStoryFeedback] = useState<FeedbackState>(null)

    const [ideaForm, setIdeaForm] = useState({
        title: "",
        submitter: "",
        email: "",
        phone: "",
        description: "",
    })
    const [ideaLoading, setIdeaLoading] = useState(false)
    const [ideaFeedback, setIdeaFeedback] = useState<FeedbackState>(null)

    const [newsletterEmail, setNewsletterEmail] = useState("")
    const [newsletterLoading, setNewsletterLoading] = useState(false)
    const [newsletterFeedback, setNewsletterFeedback] = useState<FeedbackState>(null)
    const [showFullIntro, setShowFullIntro] = useState(false)

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleStoryChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setStoryForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleIdeaChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setIdeaForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleStorySubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setStoryFeedback(null)

        if (!storyForm.title.trim() || !storyForm.email.trim() || !storyForm.content.trim() || !storyForm.author.trim()) {
            setStoryFeedback({ type: "error", message: "Vui lòng điền đầy đủ tiêu đề, email, nội dung câu chuyện và tên tác giả." })
            return
        }

        try {
            setStoryLoading(true)
            await submitStory({
                title: storyForm.title.trim(),
                content: storyForm.content.trim(),
                author: storyForm.author.trim() || undefined,
                authorEmail: storyForm.email.trim(),
            })
            setStoryFeedback({ type: "success", message: "Cảm ơn bạn! Chúng tôi đã nhận được câu chuyện." })
            setStoryForm({ title: "", author: "", email: "", content: "" })
        } catch (error) {
            console.error("Submit story error", error)
            setStoryFeedback({ type: "error", message: "Gửi câu chuyện thất bại. Vui lòng thử lại sau." })
        } finally {
            setStoryLoading(false)
        }
    }

    const handleIdeaSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIdeaFeedback(null)

        if (!ideaForm.title.trim() || !ideaForm.email.trim() || !ideaForm.description.trim() || !ideaForm.submitter.trim()) {
            setIdeaFeedback({ type: "error", message: "Vui lòng điền đầy đủ tiêu đề, email, mô tả ý tưởng và người gửi." })
            return
        }

        try {
            setIdeaLoading(true)
            await submitIdea({
                title: ideaForm.title.trim(),
                description: ideaForm.description.trim(),
                email: ideaForm.email.trim(),
                submitter: ideaForm.submitter.trim(),
                phone: ideaForm.phone.trim() || undefined,
            })
            setIdeaFeedback({ type: "success", message: "Cảm ơn bạn! Ý tưởng đã được gửi thành công." })
            setIdeaForm({ title: "", submitter: "", email: "", phone: "", description: "" })
        } catch (error) {
            console.error("Submit idea error", error)
            setIdeaFeedback({ type: "error", message: "Gửi ý tưởng thất bại. Vui lòng thử lại sau." })
        } finally {
            setIdeaLoading(false)
        }
    }

    const handleNewsletterSubmit = async (event: React.FormEvent) => {
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

            const message = isDuplicate
                ? duplicateMessage
                : "Đăng ký thất bại. Vui lòng thử lại sau."

            setNewsletterFeedback({ type: "error", message })
        } finally {
            setNewsletterLoading(false)
        }
    }

    return (
        <section
            id="contact"
            ref={ref}
            className="relative w-full py-20 px-4 sm:px-6 lg:px-8"
            style={{
                background: "linear-gradient(135deg, rgb(115, 66, 186) 0%, #B668A1 100%)",
            }}
        >
            {/* SVG Pattern Background */}
            <svg
                className="absolute inset-0 w-full h-full opacity-5"
                viewBox="0 0 1200 800"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <pattern
                        id="contact-pattern"
                        x="0"
                        y="0"
                        width="200"
                        height="200"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="100" cy="100" r="40" fill="none" stroke="white" strokeWidth="1" />
                        <circle cx="100" cy="100" r="20" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="1200" height="800" fill="url(#contact-pattern)" />
            </svg>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2
                        className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance"
                        style={{ color: "#fcd34d" }}
                    >
                        NHỮNG CÁNH TAY NỐI DÀI
                    </h2>
                    <div className="w-24 h-1 mx-auto" style={{ backgroundColor: "#fcd34d" }} />
                </motion.div>

                {/* Introduction Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto mb-16"
                >
                    <p
                        className="text-center text-xl md:text-2xl italic leading-relaxed mb-6 text-balance"
                        style={{ color: "white" }}
                    >
                        “Nếu bạn cũng tin vào sức mạnh của văn hóa, hãy cùng chúng tôi đi tiếp hành trình này.”
                    </p>

                    <AnimatePresence>
                        {showFullIntro && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4 }}
                                className="overflow-hidden"
                            >
                                <div
                                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border"
                                    style={{ borderColor: "rgba(252, 211, 77, 0.3)" }}
                                >
                                    <div className="space-y-4">
                                        <p
                                            className="text-base md:text-lg leading-relaxed text-justify"
                                            style={{ color: "white", lineHeight: 1.8 }}
                                        >
                                            Chúng tôi tin rằng, di sản không chỉ được lưu giữ trong bảo tàng hay trang sách, mà còn được tiếp nối trong từng ý tưởng, từng hành động kết nối giữa người và người.
                                        </p>

                                        <p
                                            className="text-base md:text-lg leading-relaxed text-justify"
                                            style={{ color: "white", lineHeight: 1.8 }}
                                        >
                                            <span className="italic">Sắc Màu Di Sản </span> mong muốn trở thành <span className="font-bold">một không gian sáng tạo</span>, nơi mỗi người có thể góp một "gam màu" riêng vào bức tranh chung của văn hóa Việt. Ở đó, bạn có thể chia sẻ câu chuyện của mình, gửi gắm ý tưởng sáng tạo, hay đơn giản là cùng chúng tôi kể lại vẻ đẹp của di sản theo cách bạn cảm nhận.
                                        </p>

                                        <p
                                            className="text-base md:text-lg leading-relaxed text-justify"
                                            style={{ color: "white", lineHeight: 1.8 }}
                                        >
                                            Mỗi câu chuyện bạn chia sẻ, mỗi ý tưởng bạn gửi gắm – đều là một sắc màu mới làm nên bức tranh văn hóa Việt thêm rực rỡ.
                                        </p>

                                        <p
                                            className="text-base md:text-lg leading-relaxed text-justify"
                                            style={{ color: "white", lineHeight: 1.8 }}
                                        >
                                            Chúng tôi tin rằng, bảo tồn không chỉ là lưu giữ, mà còn là <span className="font-bold">sống cùng di sản</span>, để chúng trở thành nguồn cảm hứng và năng lượng cho hiện tại.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={() => setShowFullIntro(!showFullIntro)}
                        className="flex items-center gap-2 mx-auto mt-6 px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 select-none cursor-pointer"
                        style={{
                            backgroundColor: "rgba(252, 211, 77, 0.2)",
                            color: "#fcd34d",
                            border: "2px solid #fcd34d",
                        }}
                    >
                        {showFullIntro ? "Thu gọn" : "Tìm hiểu thêm"}
                        {showFullIntro ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </motion.div>

                {/* Tabs Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-12"
                >
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {[
                            { id: "story", label: "Gửi câu chuyện" },
                            { id: "idea", label: "Chia sẻ ý tưởng" },
                            { id: "newsletter", label: "Đăng ký nhận tin" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 select-none cursor-pointer"
                                style={{
                                    backgroundColor: activeTab === tab.id ? "#fcd34d" : "rgba(255, 255, 255, 0.9)",
                                    color: activeTab === tab.id ? "white" : "#5b21b6",
                                    border: activeTab === tab.id ? "2px solid #fcd34d" : "2px solid rgba(255, 255, 255, 0.5)",
                                    boxShadow: activeTab === tab.id ? "0 4px 12px rgba(252, 211, 77, 0.3)" : "none",
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-lg p-8 border shadow-md" style={{ borderColor: "#a78bfa" }}>
                        {activeTab === "story" && (
                            <form onSubmit={handleStorySubmit} className="space-y-4">
                                <div>
                                    <label className="block font-semibold mb-2" style={{ color: "#1f2937" }}>
                                        Tiêu đề câu chuyện
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={storyForm.title}
                                        onChange={handleStoryChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: "#a78bfa",
                                        }}
                                        placeholder="Đặt tiêu đề cho câu chuyện"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold mb-2" style={{ color: "#1f2937" }}>
                                        Tên của bạn
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={storyForm.author}
                                        onChange={handleStoryChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: "#a78bfa",
                                        }}
                                        placeholder="Tên hoặc bút danh (không bắt buộc)"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold mb-2" style={{ color: "#1f2937" }}>
                                        Email liên hệ
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={storyForm.email}
                                        onChange={handleStoryChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: "#a78bfa",
                                        }}
                                        placeholder="Email để chúng tôi liên hệ lại"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold mb-2" style={{ color: "#1f2937" }}>
                                        Câu chuyện của bạn
                                    </label>
                                    <textarea
                                        name="content"
                                        value={storyForm.content}
                                        onChange={handleStoryChange}
                                        rows={5}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: "#a78bfa",
                                        }}
                                        placeholder="Chia sẻ câu chuyện của bạn về di sản và văn hóa Việt..."
                                    />
                                </div>
                                {storyFeedback && (
                                    <p
                                        className={`text-sm ${
                                            storyFeedback.type === "success" ? "text-green-600" : "text-red-600"
                                        }`}
                                    >
                                        {storyFeedback.message}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={storyLoading}
                                    className="w-full px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: "#fcd34d",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!storyLoading) e.currentTarget.style.backgroundColor = "#fef3c7"
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!storyLoading) e.currentTarget.style.backgroundColor = "#fcd34d"
                                    }}
                                >
                                    {storyLoading ? "Đang gửi..." : "Gửi câu chuyện"}
                                </button>
                            </form>
                        )}

                        {activeTab === "idea" && (
                            <form onSubmit={handleIdeaSubmit} className="space-y-4">
                                <div>
                                    <label className="block font-semibold mb-2" style={{ color: "#1f2937" }}>
                                        Tên dự án
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={ideaForm.title}
                                        onChange={handleIdeaChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: "#a78bfa",
                                        }}
                                        placeholder="Tên dự án hoặc ý tưởng của bạn"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold mb-2" style={{ color: "#1f2937" }}>
                                        Email liên hệ
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={ideaForm.email}
                                        onChange={handleIdeaChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: "#a78bfa",
                                        }}
                                        placeholder="Email của bạn"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold mb-2" style={{ color: "#1f2937" }}>
                                        Số điện thoại (tuỳ chọn)
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={ideaForm.phone}
                                        onChange={handleIdeaChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: "#a78bfa",
                                        }}
                                        placeholder="Số điện thoại liên hệ"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold mb-2" style={{ color: "#1f2937" }}>
                                        Người gửi / Tổ chức
                                    </label>
                                    <input
                                        type="text"
                                        name="submitter"
                                        value={ideaForm.submitter}
                                        onChange={handleIdeaChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: "#a78bfa",
                                        }}
                                        placeholder="Tên người gửi hoặc tổ chức"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold mb-2" style={{ color: "#1f2937" }}>
                                        Mô tả dự án
                                    </label>
                                    <textarea
                                        name="description"
                                        value={ideaForm.description}
                                        onChange={handleIdeaChange}
                                        rows={5}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: "#a78bfa",
                                        }}
                                        placeholder="Mô tả ý tưởng sáng tạo hoặc dự án của bạn..."
                                    />
                                </div>
                                {ideaFeedback && (
                                    <p
                                        className={`text-sm ${
                                            ideaFeedback.type === "success" ? "text-green-600" : "text-red-600"
                                        }`}
                                    >
                                        {ideaFeedback.message}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={ideaLoading}
                                    className="w-full px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: "#fcd34d",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!ideaLoading) e.currentTarget.style.backgroundColor = "#fef3c7"
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!ideaLoading) e.currentTarget.style.backgroundColor = "#fcd34d"
                                    }}
                                >
                                    {ideaLoading ? "Đang gửi..." : "Gửi ý tưởng"}
                                </button>
                            </form>
                        )}

                        {activeTab === "newsletter" && (
                            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                                <div>
                                    <label className="block font-semibold mb-2" style={{ color: "#1f2937" }}>
                                        Email của bạn
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newsletterEmail}
                                        onChange={(event) => setNewsletterEmail(event.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: "#a78bfa",
                                        }}
                                        placeholder="Nhập email để nhận tin tức"
                                    />
                                </div>
                                <p className="text-sm" style={{ color: "#1f2937" }}>
                                    Đăng ký để nhận những cập nhật mới nhất về các sự kiện, sản phẩm và câu chuyện từ Sắc Màu Di Sản.
                                </p>
                                {newsletterFeedback && (
                                    <p
                                        className={`text-sm ${
                                            newsletterFeedback.type === "success" ? "text-green-600" : "text-red-600"
                                        }`}
                                    >
                                        {newsletterFeedback.message}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={newsletterLoading}
                                    className="w-full px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: "#fcd34d",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!newsletterLoading) e.currentTarget.style.backgroundColor = "#fef3c7"
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!newsletterLoading) e.currentTarget.style.backgroundColor = "#fcd34d"
                                    }}
                                >
                                    {newsletterLoading ? "Đang đăng ký..." : "Đăng ký"}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center"
                >
                    <button
                        onClick={scrollToTop}
                        className="inline-flex items-center gap-2 transition-colors select-none cursor-pointer"
                        style={{ color: "#fcd34d" }}
                    >
                        <span className="text-sm font-semibold">Về đầu trang</span>
                        <ArrowUp size={20} />
                    </button>
                </motion.div>
            </div>
        </section>
    )
}
