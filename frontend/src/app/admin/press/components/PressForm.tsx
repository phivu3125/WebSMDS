"use client"

import { useMemo, useState, useEffect, ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { adminApi } from "@/lib/api"
import type { AdminPressItem, AdminPressPayload } from "@/lib/api/admin/press"
import { SingleImageUpload } from "@/components/admin/reusable-image-upload"
import { resolveMediaUrl } from "@/lib/media"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { vi } from "date-fns/locale"

const PRESS_TYPES: { value: string; label: string }[] = [
  { value: "article", label: "Bài viết" },
  { value: "video", label: "Video" },
  { value: "podcast", label: "Podcast" },
  { value: "news", label: "Tin tức" },
  { value: "other", label: "Khác" },
]

interface PressFormProps {
  initialData?: AdminPressItem
  mode: "create" | "edit"
}

type PressFormState = Omit<AdminPressPayload, "image"> & { image: string | File }

const defaultValues: PressFormState = Object.freeze({
  source: "",
  title: "",
  description: "",
  date: "",
  type: "article",
  link: "",
  image: "",
  featured: false,
} satisfies PressFormState)

export function PressForm({ initialData, mode }: PressFormProps) {
  const router = useRouter()
  const initialFormData = useMemo<PressFormState>(() => {
    if (!initialData) return defaultValues
    const { source, title, description, date, type, link, image, featured } = initialData
    return { source, title, description, date, type, link, image, featured }
  }, [initialData])

  const [formData, setFormData] = useState<PressFormState>(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  const handleChange = <K extends keyof PressFormState>(field: K, value: PressFormState[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleInputChange = (field: keyof PressFormState) => (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(field, event.target.value as PressFormState[typeof field])
  }

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    handleChange("description", event.target.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      let imageValue = formData.image

      const deleteExistingImage = async () => {
        if (!initialData?.image) return
        try {
          const url = new URL(resolveMediaUrl(initialData.image))
          const filename = url.pathname.split("/").filter(Boolean).pop()
          if (filename) {
            await adminApi.deleteImage(filename)
          }
        } catch (deleteError) {
          console.warn("Failed to delete old image:", deleteError)
        }
      }

      if (imageValue instanceof File) {
        const uploadedUrl = await adminApi.uploadImage(imageValue)
        imageValue = uploadedUrl
        if (mode === "edit") {
          await deleteExistingImage()
        }
      } else if (mode === "edit" && imageValue === "" && initialData?.image) {
        await deleteExistingImage()
      }

      const payload: AdminPressPayload = {
        source: formData.source,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        type: formData.type,
        link: formData.link,
        image: typeof imageValue === "string" ? imageValue : "",
        featured: formData.featured,
      }

      if (mode === "create") {
        await adminApi.createPress(payload)
      } else if (initialData) {
        await adminApi.updatePress(initialData.id, payload)
      }

      router.push("/admin/press")
    } catch (err) {
      console.error("Failed to submit press form:", err)
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại."
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>{mode === "create" ? "Thêm nội dung truyền thông" : "Chỉnh sửa nội dung truyền thông"}</CardTitle>
        <p className="text-sm text-gray-600">
          Điền thông tin chi tiết cho nội dung truyền thông của bạn.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nguồn *</label>
              <Input
                value={formData.source}
                onChange={handleInputChange("source")}
                placeholder="Tên báo, kênh truyền thông"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Liên kết *</label>
              <Input
                value={formData.link}
                onChange={handleInputChange("link")}
                placeholder="https://..."
                type="url"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tiêu đề *</label>
            <Input
              value={formData.title}
              onChange={handleInputChange("title")}
              placeholder="Tiêu đề của bài viết hoặc video"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mô tả *</label>
            <Textarea
              value={formData.description}
              onChange={handleTextareaChange}
              placeholder="Mô tả ngắn gọn nội dung"
              rows={4}
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ngày đăng *</label>
              <div className="relative">
                <DatePicker
                  selected={formData.date && formData.date.trim() !== '' && !isNaN(new Date(formData.date).getTime()) ? new Date(formData.date) : null}
                  onChange={(date: Date | null) => {
                    const dateStr = date ? date.toISOString().split('T')[0] : '';
                    handleChange('date', dateStr);
                  }}
                  locale={vi}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="20/05/2024"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Loại nội dung *</label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                value={formData.type}
                onChange={(event) => handleChange("type", event.target.value)}
                required
              >
                {PRESS_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <SingleImageUpload
              value={formData.image}
              onChange={(value) => handleChange("image", value || "")}
              label="Hình ảnh đại diện"
              placeholder="Kéo thả hoặc chọn ảnh để tải lên"
              size="lg"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hoặc nhập URL hình ảnh</label>
              <Input
                value={typeof formData.image === "string" ? formData.image : ""}
                onChange={handleInputChange("image")}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              checked={formData.featured}
              onChange={(event) => handleChange("featured", event.target.checked)}
            />
            <label htmlFor="featured" className="text-sm text-gray-700">
              Đánh dấu nội dung nổi bật
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/press")}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Đang lưu..." : mode === "create" ? "Tạo nội dung" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
