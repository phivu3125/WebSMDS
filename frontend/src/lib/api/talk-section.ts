import { safeApiFetch } from "./base"

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
  const response = await safeApiFetch("talk-section")
  if (!response) {
    console.warn("Talk section API not available, returning default response")
    return { success: false, data: null }
  }
  return (await response.json()) as TalkSectionResponse
}
