import { adminApiFetch, handleAdminResponse } from "./base"

interface EmailSubscription {
  id: string
  email: string
  status: "subscribed" | "unsubscribed"
  subscribedAt: string
}

export async function getAllSubscriptions(): Promise<EmailSubscription[]> {
  const response = await adminApiFetch("email-subscriptions")
  const data = await handleAdminResponse<{ success: boolean; data: EmailSubscription[] }>(response)
  return data.data || []
}
