"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PastEvent, PastEventFeatureItem } from "@/types/PastEvent"

interface PastEventDetailClientProps {
    event: PastEvent
}

export default function PastEventDetailClient({ event }: PastEventDetailClientProps) {
    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
                <Link
                    href="/#past_events"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                        backgroundColor: "white",
                        color: "#B668A1",
                        border: "2px solid #B668A1",
                    }}
                >
                    <ArrowLeft size={18} />
                    Quay lại
                </Link>
            </div>

            <HeroSection event={event} />
            {event.intro?.content && <IntroSection event={event} />}
            {event.featureList?.items?.length > 0 && <FeatureListSection event={event} />}
            {event.gallery?.images?.length > 0 && <GallerySection event={event} />}
            {event.conclusion?.content && <ConclusionSection event={event} />}
            <CTASection />
        </div>
    )
}

const DEFAULT_SECTION_PADDING = "py-16 md:py-20"

function HeroSection({ event }: { event: PastEvent }) {
    const overlay = "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)"
    const backgroundImage = event.hero?.backgroundImage || event.thumbnailImage || "/placeholder.svg"

    return (
        <section className="relative w-full">
            <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
                <Image src={backgroundImage} alt={event.title} fill className="object-cover" priority />
                <div className="absolute inset-0" style={{ background: overlay }} />

                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="inline-flex mb-4">
                                <span
                                    className="px-4 py-2 rounded-full font-bold text-sm"
                                    style={{
                                        backgroundColor: "#D4AF37",
                                        color: "white",
                                    }}
                                >
                                    Sự kiện {event.year}
                                </span>
                            </div>

                            <h1
                                className="text-4xl md:text-6xl font-serif font-bold mb-4 text-white drop-shadow-xl"
                                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                            >
                                {event.title}
                            </h1>

                            {event.subtitle && (
                                <p
                                    className="text-xl md:text-2xl font-light text-white/90 max-w-4xl drop-shadow-md"
                                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                                >
                                    {event.subtitle}
                                </p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function IntroSection({ event }: { event: PastEvent }) {
    const align = event.intro?.align === "center" ? "text-center" : "text-left"

    return (
        <section className={DEFAULT_SECTION_PADDING}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-2xl shadow-lg p-8 md:p-12"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-1" style={{ backgroundColor: "#D4AF37" }} />
                    </div>

                    <div
                        className={`prose prose-lg max-w-none ${align}`}
                        style={{ color: "#1f2937" }}
                        dangerouslySetInnerHTML={{ __html: event.intro?.content || "" }}
                    />
                </motion.div>
            </div>
        </section>
    )
}

function ConclusionSection({ event }: { event: PastEvent }) {
    return (
        <section className={DEFAULT_SECTION_PADDING}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-2xl shadow-lg p-8 md:p-12"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-1" style={{ backgroundColor: "#D4AF37" }} />
                    </div>

                    <div
                        className="prose prose-lg max-w-none text-start"
                        style={{ color: "#1f2937" }}
                        dangerouslySetInnerHTML={{ __html: event.conclusion?.content || "" }}
                    />
                </motion.div>
            </div>
        </section>
    )
}

function FeatureListSection({ event }: { event: PastEvent }) {
    return (
        <section className={DEFAULT_SECTION_PADDING}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: "#D4AF37" }}>
                        Hoạt động nổi bật
                    </h2>
                    <div className="w-24 h-1 mx-auto mt-6" style={{ backgroundColor: "#D4AF37" }} />
                </motion.div>

                <div className="space-y-20">
                    {event.featureList?.items?.map((item, itemIndex) => (
                        <FeatureCard key={itemIndex} item={item} index={itemIndex} />
                    ))}
                </div>
            </div>
        </section>
    )
}

const FeatureCard = ({ item, index }: { item: PastEventFeatureItem; index: number }) => {
    const isEven = index % 2 === 0
    const containerClasses = `flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 items-center`

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={containerClasses}
        >
            <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 h-full">
                    <div className="mb-6">
                        <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2" style={{ color: "#B668A1" }}>
                            {item.title}
                        </h3>
                        {item.subtitle && (
                            <p className="text-lg font-semibold" style={{ color: "#D4AF37" }}>
                                {item.subtitle}
                            </p>
                        )}
                    </div>

                    <div
                        className="prose prose-lg max-w-none"
                        style={{ color: "#1f2937" }}
                        dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                </div>
            </div>

            {item.images && item.images.length > 0 && (
                <div className="flex-1 w-full">
                    {item.images.length === 1 ? (
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
                            <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {item.images.slice(0, 4).map((img, idx) => (
                                <div key={idx} className="relative w-full h-[200px] rounded-lg overflow-hidden shadow-md">
                                    <Image src={img} alt={`${item.title} ${idx + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    )
}

function GallerySection({ event }: { event: PastEvent }) {
    return (
        <section className={DEFAULT_SECTION_PADDING}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: "#D4AF37" }}>
                        Khoảnh khắc đáng nhớ
                    </h2>
                    <div className="w-24 h-1 mx-auto" style={{ backgroundColor: "#D4AF37" }} />
                </motion.div>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {event.gallery?.images?.map((image, index) => (
                        <motion.div
                            key={`${image.url}-${index}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="break-inside-avoid"
                        >
                            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                <div className="relative aspect-[16/9]">
                                    <Image
                                        src={image.url}
                                        alt={image.alt || `Gallery image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 400px"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function CTASection() {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <Link
                    href="/#past_events"
                    className="inline-block px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105"
                    style={{
                        backgroundColor: "#B668A1",
                        color: "white",
                    }}
                >
                    Khám phá thêm sự kiện khác
                </Link>
            </div>
        </section>
    )
}
