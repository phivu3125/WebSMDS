"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PressForm } from "../../components/PressForm"
import { adminApi } from "@/lib/api"
import type { AdminPressItem } from "@/lib/api/admin/press"

export default function EditPressPage() {
  const params = useParams<{ id: string }>()
  const idParam = params?.id
  const pressId = Number(idParam)

  const [press, setPress] = useState<AdminPressItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPress = async () => {
    if (!Number.isFinite(pressId)) {
      setError("ID không hợp lệ")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.getPressById(pressId)
      setPress(data)
    } catch (err) {
      console.error("Failed to fetch press item:", err)
      const message = err instanceof Error ? err.message : "Không thể tải nội dung truyền thông."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPress()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pressId])

  if (!Number.isFinite(pressId)) {
    return <div className="p-6 text-sm text-red-600">ID truyền thông không hợp lệ.</div>
  }

  if (loading) {
    return <div className="p-6">Đang tải dữ liệu...</div>
  }

  if (error) {
    return (
      <div className="space-y-4 px-4 pb-10 pt-4 sm:px-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-red-600">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchPress} className="cursor-pointer">
            <RefreshCcw className="mr-1 h-4 w-4" />
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  if (!press) {
    return <div className="p-6">Không tìm thấy nội dung truyền thông.</div>
  }

  return (
    <div className="space-y-6 px-4 pb-10 pt-4 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link href="/admin/press">
            <Button variant="outline" size="sm" className="w-full cursor-pointer sm:w-auto">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Chỉnh sửa nội dung truyền thông</h1>
            <p className="text-gray-600">Cập nhật thông tin cho bài viết, video hoặc nội dung truyền thông.</p>
          </div>
        </div>
      </div>

      <PressForm mode="edit" initialData={press} />
    </div>
  )
}
