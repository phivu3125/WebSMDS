import PastEventForm from "../../past-event-form"

export default function EditPastEventPage({ params }: { params: { id: string } }) {
    return <PastEventForm eventId={params.id} />
}
