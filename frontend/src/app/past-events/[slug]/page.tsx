import { notFound } from "next/navigation"
import { getPastEventBySlug } from "@/lib/api/past-events"
import PastEventDetailClient from "./past-event-client"

export default async function PastEventPage({ params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params
        const event = await getPastEventBySlug(slug)

        if (!event) {
            notFound()
        }

        return <PastEventDetailClient event={event} />
    } catch (error) {
        console.error("Error loading past event:", error)
        notFound()
    }
}
