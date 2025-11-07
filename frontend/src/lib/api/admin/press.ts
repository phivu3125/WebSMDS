import { adminApiFetch, handleAdminResponse } from "./base"

export interface AdminPressItem {
  id: number
  source: string
  title: string
  description: string
  date: string
  type: string
  link: string
  image: string
  featured: boolean
}

export type AdminPressPayload = Omit<AdminPressItem, "id">

export async function getAllPress(): Promise<AdminPressItem[]> {
  const response = await adminApiFetch("press")
  const { data } = await handleAdminResponse<{ success: boolean; data: AdminPressItem[] }>(response)
  return data ?? []
}

export async function getPressById(id: number): Promise<AdminPressItem> {
  const response = await adminApiFetch(`press/${id}`)
  const { data } = await handleAdminResponse<{ success: boolean; data: AdminPressItem }>(response)
  return data
}

export async function createPress(payload: AdminPressPayload): Promise<{ success: boolean; data: AdminPressItem }> {
  const response = await adminApiFetch("press", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return handleAdminResponse<{ success: boolean; data: AdminPressItem }>(response)
}

export async function updatePress(
  id: number,
  payload: Partial<AdminPressPayload>
): Promise<{ success: boolean; data: AdminPressItem }> {
  const response = await adminApiFetch(`press/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  return handleAdminResponse<{ success: boolean; data: AdminPressItem }>(response)
}

export async function deletePress(id: number): Promise<{ success: boolean; message: string }> {
  const response = await adminApiFetch(`press/${id}`, {
    method: "DELETE"
  })
  return handleAdminResponse<{ success: boolean; message: string }>(response)
}
