"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ExternalLink, Star } from "lucide-react"
import { adminApi } from "@/lib/api"
import type { AdminPressItem } from "@/lib/api/admin/press"
import { resolveMediaUrl } from "@/lib/media"

const typeLabels: Record<string, string> = {
  article: "Bài viết",
  video: "Video",
  podcast: "Podcast",
  news: "Tin tức",
  other: "Khác",
}

export default function PressAdminPage() {
  const [press, setPress] = useState<AdminPressItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingId, setPendingId] = useState<number | null>(null)

  useEffect(() => {
    fetchPress()
  }, [])

  const fetchPress = async () => {
    try {
      setLoading(true)
      const items = await adminApi.getAllPress()
      setPress(items)
    } catch (error) {
      console.error("Failed to fetch press:", error)
    } finally {
      setLoading(false)
      setPendingId(null)
    }
  }

  const deletePress = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa nội dung truyền thông này?")) {
      return
    }

    try {
      setPendingId(id)
      await adminApi.deletePress(id)
      await fetchPress()
    } catch (error) {
      console.error("Failed to delete press:", error)
      setPendingId(null)
    }
  }

  const toggleFeatured = async (item: AdminPressItem) => {
    try {
      setPendingId(item.id)
      await adminApi.updatePress(item.id, { featured: !item.featured })
      await fetchPress()
    } catch (error) {
      console.error("Failed to toggle featured state:", error)
      setPendingId(null)
    }
  }

  if (loading) {
    return <div className="p-6">Đang tải dữ liệu...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Truyền thông</h1>
          <p className="mt-2 text-gray-600">Quản lý các bài viết, phóng sự và nội dung truyền thông.</p>
        </div>
        <Link href="/admin/press/create">
          <Button className="w-full md:w-auto">
            <Plus className="mr-1 h-4 w-4" />
            Thêm nội dung
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {press.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                  {!!item.image && (
                    <img
                      src={resolveMediaUrl(item.image) || "/placeholder.svg"}
                      alt={item.title}
                      className="h-24 w-24 flex-shrink-0 rounded-lg object-cover bg-gray-100"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Badge variant="outline">{typeLabels[item.type] ?? item.type}</Badge>
                      {item.featured && (
                        <Badge variant="default" className="flex items-center gap-1 bg-amber-500">
                          <Star className="h-3 w-3" fill="currentColor" />
                          Nổi bật
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="flex flex-row gap-3 lg:flex-col lg:items-end">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Nguồn:</span> {item.source}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Ngày:</span> {new Date(item.date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-gray-500">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:underline"
                  >
                    Truy cập liên kết
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFeatured(item)}
                    disabled={pendingId === item.id}
                  >
                    <Star className="mr-1 h-4 w-4" fill={item.featured ? "currentColor" : "none"} />
                    {item.featured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
                  </Button>
                  <Link href={`/admin/press/${item.id}/edit`}>
                    <Button size="sm" variant="outline" disabled={pendingId === item.id}>
                      <Edit className="mr-1 h-4 w-4" />
                      Sửa
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletePress(item.id)}
                    disabled={pendingId === item.id}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    {pendingId === item.id ? "Đang xử lý..." : "Xóa"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {press.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-gray-500">
              <p>Chưa có nội dung truyền thông nào.</p>
              <Link href="/admin/press/create" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-1 h-4 w-4" />
                  Thêm nội dung đầu tiên
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
