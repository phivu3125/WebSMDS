"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { adminApi } from "@/lib/api"

interface Subscription {
  id: string
  email: string
  status: "subscribed" | "unsubscribed"
  subscribedAt: string
}

export default function EmailSubscriptionsAdmin() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const data = await adminApi.getAllSubscriptions()
      setSubscriptions(data)
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCsv = () => {
    if (!subscriptions.length) {
      return
    }

    const headers = ["Email", "Trạng thái", "Ngày đăng ký"]
    const rows = subscriptions.map((subscription) => [
      subscription.email,
      subscription.status,
      new Date(subscription.subscribedAt).toLocaleString("vi-VN"),
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `email-subscriptions-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Subscriptions</h1>
          <p className="text-gray-600 mt-2">Danh sách email đăng ký nhận tin</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCsv} disabled={!subscriptions.length}>
            <Download className="h-4 w-4 mr-1" />
            Xuất CSV ({subscriptions.length})
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={3}>
                      Chưa có email nào đăng ký
                    </td>
                  </tr>
                )}
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-t">
                    <td className="px-4 py-3 font-medium text-gray-900">{subscription.email}</td>
                    <td className="px-4 py-3 capitalize text-gray-600">{subscription.status}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(subscription.subscribedAt).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
