import { Navigation } from "@/components/home/navigation"
import { HeroSection } from "@/components//home/hero-section"
import { EventsSection } from "@/components//home/events-section"
import { AboutSection } from "@/components/home/about-section"
import { MissionStatement } from "@/components/home/mission-statement"
import { JourneysSection } from "@/components/home/journeys-section"
import { ProductsSection } from "@/components/home/products-section"
import { NewsSection } from "@/components/home/news-section"
import { PartnersSection } from "@/components/home/partners-section"
import { Footer } from "@/components/layout/Footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <EventsSection />
      <AboutSection />
      <MissionStatement />
      <JourneysSection />
      <ProductsSection />
      <NewsSection />
      <PartnersSection />
      <Footer />
    </main>
  )
}
