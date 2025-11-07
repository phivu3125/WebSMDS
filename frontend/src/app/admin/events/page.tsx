"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Calendar, MapPin, Eye, EyeOff, ExternalLink } from "lucide-react"
import Link from "next/link"
import { adminApi } from "@/lib/api"
import { resolveMediaUrl } from "@/lib/media"

interface Event {
  id: string
  title: string
  slug: string
  description: string
  location?: string
  dateDisplay?: string
  status: string
  createdAt: string
  image?: string
}

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const data = await adminApi.getAllEvents()
      setEvents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const openDeleteModal = (id: string) => {
    setEventToDelete(id)
    setDeletePassword("")
    setDeleteError("")
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!eventToDelete) return

    try {
      await adminApi.deleteEvent(eventToDelete, deletePassword)
      setDeleteModalOpen(false)
      setEventToDelete(null)
      setDeletePassword("")
      fetchEvents()
    } catch (error) {
      console.error("Failed to delete event:", error)
      setDeleteError(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const toggleEventStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "draft" ? "published" : "draft"

    try {
      await adminApi.updateEventStatus(id, newStatus)
      fetchEvents()
    } catch (error) {
      console.error("Failed to update event status:", error)
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      "draft": "Nháp",
      "published": "Đã đăng",
      "ongoing": "Đang diễn ra",
      "ended": "Đã kết thúc",
    }
    return labels[status] || status
  }

  const getStatusVariant = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "draft": "secondary",
      "published": "default",
      "ongoing": "default",
      "ended": "outline",
    }
    return variants[status] || "outline"
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "draft": "bg-gray-100 text-gray-800",
      "published": "bg-green-100 text-green-800",
      "ongoing": "bg-blue-100 text-blue-800",
      "ended": "bg-gray-100 text-gray-600",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6 px-4 pb-10 pt-4 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Quản lý Sự Kiện</h1>
          <p className="text-gray-600">Quản lý sự kiện và hoạt động</p>
        </div>
        <Link href="/admin/events/create" className="w-full sm:w-auto">
          <Button className="cursor-pointer w-full">
            <Plus className="h-4 w-4 mr-1" />
            Thêm sự kiện
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="draft" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="cursor-pointer" value="draft">Bản nháp ({events.filter(e => e.status === 'draft').length})</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="published">Đã đăng ({events.filter(e => e.status === 'published' || e.status === 'ongoing' || e.status === 'ended').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="draft" className="space-y-4">
            {events.filter(event => event.status === 'draft').map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4 md:items-center flex-1">
                      {event.image && (
                        <img
                          src={resolveMediaUrl(event.image) || "/placeholder.svg"}
                          alt={event.title}
                          className="w-16 h-16 object-contain rounded-lg bg-gray-100"
                        />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Badge className={getStatusColor(event.status)}>
                        {getStatusLabel(event.status)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleEventStatus(event.id, event.status)}
                        className="cursor-pointer w-full sm:w-auto"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Đăng
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm text-gray-500 space-y-2">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{event.dateDisplay || "Đang cập nhật"}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        Slug: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{event.slug}</code>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Button size="sm" variant="outline" className="cursor-pointer w-full sm:w-auto">
                          <Edit className="h-4 w-4 mr-1" />
                          Sửa
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteModal(event.id)}
                        className="cursor-pointer w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {events.filter(event => event.status === 'draft').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Không có sự kiện nào trong bản nháp
              </div>
            )}
          </TabsContent>

          <TabsContent value="published" className="space-y-4">
            {events.filter(event => event.status === 'published' || event.status === 'ongoing' || event.status === 'ended').map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4 md:items-center flex-1">
                      {event.image && (
                        <img
                          src={resolveMediaUrl(event.image) || "/placeholder.svg"}
                          alt={event.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Badge className={getStatusColor(event.status)}>
                        {getStatusLabel(event.status)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleEventStatus(event.id, event.status)}
                        className="cursor-pointer w-full sm:w-auto"
                      >
                        {event.status === "published" ? (
                          <EyeOff className="h-4 w-4 mr-1" />
                        ) : (
                          <Eye className="h-4 w-4 mr-1" />
                        )}
                        {event.status === "published" ? "Nháp" : "Đăng"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{event.dateDisplay || "Đang cập nhật"}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        Slug: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{event.slug}</code>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Link href={`/events/${event.slug}`} target="_blank">
                        <Button size="sm" variant="outline" className="cursor-pointer w-full sm:w-auto">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Xem
                        </Button>
                      </Link>
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Button size="sm" variant="outline" className="cursor-pointer w-full sm:w-auto">
                          <Edit className="h-4 w-4 mr-1" />
                          Sửa
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteModal(event.id)}
                        className="cursor-pointer w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {events.filter(event => event.status === 'published' || event.status === 'ongoing' || event.status === 'ended').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Không có sự kiện nào đã đăng
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xác nhận xóa sự kiện
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Hành động này không thể hoàn tác. Vui lòng nhập mật khẩu để xác nhận xóa sự kiện.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Nhập mật khẩu"
                />
                {deleteError && (
                  <p className="text-sm text-red-600 mt-1">{deleteError}</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteModalOpen(false)}
                  className="cursor-pointer"
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={!deletePassword}
                  className="cursor-pointer"
                >
                  Xóa sự kiện
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
