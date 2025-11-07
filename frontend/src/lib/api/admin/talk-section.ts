import { adminApiFetch, handleAdminResponse } from "./base"

export interface TalkSectionData {
  key: string
  title?: string | null
  description?: string | null
  liveInput?: string | null
  replayInput?: string | null
  createdAt: string
  updatedAt: string
}

export interface TalkSectionResponse {
  success: boolean
  data: TalkSectionData | null
}

export async function getTalkSectionAdmin(): Promise<TalkSectionData | null> {
  const response = await adminApiFetch("talk-section")
  const result = await handleAdminResponse<TalkSectionResponse>(response)
  return result.data
}

export async function updateTalkSection(data: {
  title?: string
  description?: string
  liveInput?: string
  replayInput?: string
}): Promise<TalkSectionData> {
  const response = await adminApiFetch("talk-section", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const result = await handleAdminResponse<TalkSectionResponse>(response)
  if (!result.data) throw new Error("Failed to update talk section")
  return result.data
}
