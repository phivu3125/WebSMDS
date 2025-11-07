import HomeClient, { HomeEvent, HomePress } from "./home-client"
import { getEvents } from "@/lib/api/events"
import { getPress } from "@/lib/api/news"
import { getTalkSection } from "@/lib/api/talk-section"
import type { TalkSectionProps } from "@/components/home/talk-section"

async function fetchHomeEvents(): Promise<HomeEvent[]> {
  try {
    const response = await getEvents({ status: "published" })
    const data = Array.isArray(response) ? response : response?.data ?? []

    return data.slice(0, 5).map((event: any) => ({
      id: event.id,
      slug: event.slug,
      title: event.title,
      description: event.description,
      dateDisplay: event.dateDisplay ?? null,
      image: event.image ?? null,
    }))
  } catch (error) {
    console.error("Failed to fetch home events:", error)
    return []
  }
}

async function fetchHomePress(): Promise<HomePress[]> {
  try {
    const response = await getPress()
    const data = response?.data ?? []

    return data.slice(0, 8).map((item) => ({
      id: item.id,
      source: item.source,
      title: item.title,
      description: item.description,
      date: item.date,
      type: item.type,
      link: item.link,
      image: item.image,
      featured: item.featured,
    }))
  } catch (error) {
    console.error("Failed to fetch home press:", error)
    return []
  }
}

async function fetchTalkSection(): Promise<TalkSectionProps | undefined> {
  try {
    const response = await getTalkSection()
    const data = response?.data
    if (!data) return undefined
    const { title, description, liveInput, replayInput } = data
    return {
      title: title ?? undefined,
      description: description ?? undefined,
      liveInput: liveInput ?? undefined,
      replayInput: replayInput ?? undefined,
    }
  } catch (error) {
    console.error("Failed to fetch talk section:", error)
    return undefined
  }
}

export default async function Home() {
  const [events, press, talkSection] = await Promise.all([
    fetchHomeEvents(),
    fetchHomePress(),
    fetchTalkSection(),
  ])
  return <HomeClient events={events} press={press} talkSection={talkSection} />
}
