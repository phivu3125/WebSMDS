import { apiFetch } from "./base"

export interface TalkSectionResponse {
  success: boolean
  data: {
    key: string
    title?: string | null
    description?: string | null
    liveInput?: string | null
    replayInput?: string | null
    createdAt?: string
    updatedAt?: string
  } | null
}

export async function getTalkSection() {
  const response = await apiFetch("talk-section")
  if (!response.ok) throw new Error("Failed to fetch talk section")
  return (await response.json()) as TalkSectionResponse
}
