"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminApi } from "@/lib/api"
import { resolveApiUrl } from "@/lib/api/base"

interface EventSummary {
  id: string
  title: string
  slug: string
}

interface EventRegistration {
  id: string
  fullName: string
  email?: string | null
  phone: string
  note?: string | null
  status: "read" | "unread"
  readAt?: string | null
  createdAt: string
  updatedAt: string
  event: EventSummary
}

export default function EventRegistrationsAdmin() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [events, setEvents] = useState<EventSummary[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread")

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    fetchRegistrations(selectedEventId === "all" ? undefined : selectedEventId)
  }, [selectedEventId])

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(resolveApiUrl("events"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      const eventsArray: EventSummary[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : []

      setEvents(
        eventsArray.map((event) => ({
          id: event.id,
          title: event.title,
          slug: event.slug,
        }))
      )
    } catch (error) {
      console.error("Failed to fetch events for filter:", error)
    }
  }

  const fetchRegistrations = async (eventId?: string) => {
    setLoading(true)
    try {
      const data = await adminApi.getEventRegistrations(eventId)
      setRegistrations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch event registrations:", error)
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: "read" | "unread") => {
    try {
      setUpdatingId(id)
      await adminApi.updateRegistrationStatus(id, status)
      await fetchRegistrations(selectedEventId === "all" ? undefined : selectedEventId)
    } catch (error) {
      console.error("Failed to update registration status:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteRegistration = async (id: string) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa đăng ký này?")
    if (!confirmed) return

    try {
      setDeletingId(id)
      await adminApi.deleteRegistration(id)
      await fetchRegistrations(selectedEventId === "all" ? undefined : selectedEventId)
    } catch (error) {
      console.error("Failed to delete registration:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const unreadRegistrations = useMemo(
    () => registrations.filter((registration) => registration.status === "unread"),
    [registrations]
  )

  const readRegistrations = useMemo(
    () => registrations.filter((registration) => registration.status === "read"),
    [registrations]
  )

  const currentRegistrations = activeTab === "unread" ? unreadRegistrations : readRegistrations

  const eventOptions = useMemo(() => {
    return [{ id: "all", title: "Tất cả sự kiện" }, ...events]
  }, [events])

  const handleExport = () => {
    if (loading || !currentRegistrations.length) return

    const headers = [
      "Họ và tên",
      "Email",
      "Số điện thoại",
      "Sự kiện",
      "Trạng thái",
      "Thời gian đăng ký",
      "Thời gian đọc",
      "Lời nhắn",
    ]

    const rows = currentRegistrations.map((registration) => [
      registration.fullName,
      registration.email ?? "",
      `\u200B${registration.phone}`,
      registration.event?.title ?? "",
      registration.status === "unread" ? "Chưa đọc" : "Đã đọc",
      new Date(registration.createdAt).toLocaleString("vi-VN"),
      registration.readAt ? new Date(registration.readAt).toLocaleString("vi-VN") : "",
      registration.note ?? "",
    ])

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n")

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `event-registrations-${activeTab}-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  const renderRegistrationsList = (list: EventRegistration[]) => {
    if (loading) {
      return (
        <div className="rounded-lg border border-dashed border-purple-200 bg-purple-50 p-6 text-center text-sm text-purple-700">
          Đang tải danh sách đăng ký...
        </div>
      )
    }

    if (!list.length) {
      return (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Chưa có người dùng nào đăng ký theo bộ lọc hiện tại.
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {list.map((registration) => (
          <Card key={registration.id}>
            <CardHeader>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {registration.fullName}
                  </CardTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span>{registration.phone}</span>
                    {registration.email && <span>{registration.email}</span>}
                    <span>
                      {new Date(registration.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={registration.status === "unread" ? "destructive" : "secondary"}>
                    {registration.status === "unread" ? "Chưa đọc" : "Đã đọc"}
                  </Badge>
                  <Badge variant="outline">{registration.event?.title ?? "Không xác định"}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {registration.note && (
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">Lời nhắn</p>
                  <p className="mt-2 whitespace-pre-wrap">{registration.note}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {registration.status === "unread" ? (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(registration.id, "read")}
                    disabled={updatingId === registration.id}
                  >
                    {updatingId === registration.id ? "Đang cập nhật..." : "Đánh dấu đã đọc"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(registration.id, "unread")}
                    disabled={updatingId === registration.id}
                  >
                    {updatingId === registration.id ? "Đang cập nhật..." : "Đánh dấu chưa đọc"}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteRegistration(registration.id)}
                  disabled={deletingId === registration.id}
                >
                  {deletingId === registration.id ? "Đang xóa..." : "Xóa đăng ký"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Đăng ký tham gia sự kiện</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Xem và quản lý thông tin người dùng đã đăng ký tham gia các sự kiện.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600" htmlFor="eventFilter">
              Lọc theo sự kiện
            </label>
            <select
              id="eventFilter"
              value={selectedEventId}
              onChange={(event) => setSelectedEventId(event.target.value)}
              className="min-w-[220px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              {eventOptions.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={loading || !currentRegistrations.length}
          >
            Xuất Excel
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "unread" | "read")}
        className="space-y-6"
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="unread">Chưa đọc ({unreadRegistrations.length})</TabsTrigger>
          <TabsTrigger value="read">Đã đọc ({readRegistrations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="unread">
          {renderRegistrationsList(unreadRegistrations)}
        </TabsContent>
        <TabsContent value="read">
          {renderRegistrationsList(readRegistrations)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
