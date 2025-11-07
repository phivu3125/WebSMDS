import { apiFetch } from "./base"

export async function createOrder(orderData: unknown) {
  const response = await apiFetch("orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  })
  if (!response.ok) throw new Error("Failed to create order")
  return response.json()
}
