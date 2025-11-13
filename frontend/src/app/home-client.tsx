"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import Navigation from "@/components/home/navigation"
import HeroSection from "@/components/home/hero-section"
import EventsSection from "@/components/home/events-section"
import LazySection from "@/components/home/lazy-section"
import { Footer } from "@/components/layout/Footer"
import type { TalkSectionProps } from "@/components/home/talk-section"

const AboutSection = dynamic(() => import("@/components/home/about-section"), { ssr: false })
const SacMauDiSanSection = dynamic(() => import("@/components/home/sac-mau-disan-section"), {
  ssr: false,
})
const HanhTrinhDanhThucDiSanSection = dynamic(
  () => import("@/components/home/hanh-trinh-danh-thuc-disan-section"),
  { ssr: false }
)
const PastEventsSection = dynamic(() => import("@/components/home/past-events-section"), {
  ssr: false,
})
const ProductsSection = dynamic(() => import("@/components/home/products-section"), {
  ssr: false,
})
const PartnersSection = dynamic(() => import("@/components/home/partners-section"), {
  ssr: false,
})
const NewsSection = dynamic(() => import("@/components/home/news-section"), { ssr: false })
const TalkSection = dynamic(() => import("@/components/home/talk-section"), { ssr: false })
const ContactSection = dynamic(() => import("@/components/home/contact-section"), { ssr: false })

export type HomeEvent = {
  id: string
  slug: string
  title: string
  description: string
  dateDisplay?: string | null
  image?: string | null
}

export type HomePress = {
  id: number
  source: string
  title: string
  description: string
  date: string
  type: string
  link: string
  image: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export type HomeClientProps = {
  events?: HomeEvent[]
  press?: HomePress[]
  talkSection?: TalkSectionProps
}

export default function HomeClient({ events = [], press = [], talkSection }: HomeClientProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const talkSectionProps = useMemo(() => talkSection ?? {}, [talkSection])

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }

    window.scrollTo(0, 0)
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navigation isScrolled={isScrolled} />
      <HeroSection />
      <EventsSection initialEvents={events} />
      <LazySection id="about">
        <AboutSection />
      </LazySection>
      <LazySection>
        <SacMauDiSanSection />
      </LazySection>
      <LazySection>
        <HanhTrinhDanhThucDiSanSection />
      </LazySection>
      <LazySection id="past_events">
        <PastEventsSection />
      </LazySection>
      {/* <LazySection>
        <ProductsSection />
      </LazySection> */}
      <LazySection>
        <PartnersSection />
      </LazySection>
      <LazySection>
        <NewsSection initialPress={press} />
      </LazySection>
      <LazySection id="talk">
        <TalkSection {...talkSectionProps} />
      </LazySection>
      <LazySection id="contact">
        <ContactSection />
      </LazySection>
      <Footer />
    </main>
  )
}
