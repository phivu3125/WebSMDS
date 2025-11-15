"use client"

import { Input } from "@/components/ui/input"
import { SingleImageUpload } from "@/components/admin/reusable-image-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type EventField = "title" | "slug" | "description" | "location" | "dateDisplay" | "openingHours" | "heroImage"

interface BasicFieldsProps {
  title: string
  slug: string
  description: string
  location: string
  dateDisplay: string
  openingHours: string
  heroImage: string | File
  onFieldChange: (field: EventField, value: string | File) => void
  validationErrors?: Record<string, string>
}

export function BasicFields({
  title,
  slug,
  description,
  location,
  dateDisplay,
  openingHours,
  heroImage,
  onFieldChange,
  validationErrors = {}
}: BasicFieldsProps) {
  const sanitizeSlug = (input: string) =>
    input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")

  const handleTitleChange = (value: string) => {
    onFieldChange("title", value)
    onFieldChange("slug", sanitizeSlug(value))
  }

  const handleSlugChange = (value: string) => {
    onFieldChange("slug", sanitizeSlug(value))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tiêu đề *</label>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Nhập tiêu đề sự kiện"
            className={validationErrors.title ? "border-red-500" : ""}
          />
          {validationErrors.title && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Slug *</label>
          <Input
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="slug-su-kiem"
            className={validationErrors.slug ? "border-red-500" : ""}
          />
          <p className="text-xs text-gray-500 mt-1">Slug sẽ được tự động tạo từ tiêu đề</p>
          {validationErrors.slug && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.slug}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mô tả ngắn *</label>
          <textarea
            value={description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            placeholder="Mô tả ngắn về sự kiện"
            className={`w-full p-3 border rounded-md min-h-[100px] ${validationErrors.description ? "border-red-500" : ""
              }`}
          />
          {validationErrors.description && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ngày diễn ra *</label>
            <Input
              value={dateDisplay}
              onChange={(e) => onFieldChange("dateDisplay", e.target.value)}
              placeholder="Ví dụ: 15-17/12/2024"
              className={validationErrors.dateDisplay ? "border-red-500" : ""}
            />
            {validationErrors.dateDisplay && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.dateDisplay}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Giờ mở cửa *</label>
            <Input
              value={openingHours}
              onChange={(e) => onFieldChange("openingHours", e.target.value)}
              placeholder="Ví dụ: 8:00 - 22:00"
              className={validationErrors.openingHours ? "border-red-500" : ""}
            />
            {validationErrors.openingHours && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.openingHours}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Địa điểm *</label>
          <Input
            value={location}
            onChange={(e) => onFieldChange("location", e.target.value)}
            placeholder="Địa điểm tổ chức"
            className={validationErrors.location ? "border-red-500" : ""}
          />
          {validationErrors.location && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.location}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hero Image *</label>
          <SingleImageUpload
            value={heroImage}
            onChange={(value) => onFieldChange("heroImage", value || "")}
            label="Tải lên hình ảnh chính của sự kiện"
            placeholder="Hero image sẽ hiển thị ở đầu trang sự kiện"
            size="lg"
          />
          {validationErrors.heroImage && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.heroImage}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Hero image là hình ảnh chính sẽ hiển thị ở đầu trang sự kiện
          </p>
        </div>
      </CardContent>
    </Card>
  )
}