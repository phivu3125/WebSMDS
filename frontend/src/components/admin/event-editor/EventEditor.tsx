"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BasicFields } from "./BasicFields"
import { ContentEditor } from "./ContentEditor"
import { LivePreview } from "./LivePreview"
import { ArrowLeft, Save, Eye, Edit3, FileText } from "lucide-react"
import Link from "next/link"

interface EventFormData {
  title: string
  slug: string
  description: string
  fullDescription: string
  heroImage: string | File
  location: string
  dateDisplay: string
  openingHours: string
}

interface EventEditorProps {
  initialData?: Partial<EventFormData>
  onSave?: (data: EventFormData) => Promise<void>
  onCancel?: () => void
  saving?: boolean
  mode?: "create" | "edit"
}

export function EventEditor({
  initialData = {},
  onSave,
  onCancel,
  saving = false,
  mode = "create"
}: EventEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    slug: "",
    description: "",
    fullDescription: "",
    heroImage: "",
    location: "",
    dateDisplay: "",
    openingHours: "",
    ...initialData
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleFieldChange = (field: keyof EventFormData, value: string | File) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear validation error when field is updated
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = "Vui lòng nhập tiêu đề sự kiện"
    }

    if (!formData.slug.trim()) {
      errors.slug = "Vui lòng nhập slug"
    }

    if (!formData.description.trim()) {
      errors.description = "Vui lòng nhập mô tả ngắn"
    }

    if (!formData.location.trim()) {
      errors.location = "Vui lòng nhập địa điểm"
    }

    if (!formData.dateDisplay.trim()) {
      errors.dateDisplay = "Vui lòng nhập ngày diễn ra"
    }

    if (!formData.openingHours.trim()) {
      errors.openingHours = "Vui lòng nhập giờ mở cửa"
    }

    if (!formData.heroImage) {
      errors.heroImage = "Vui lòng tải lên hero image"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    if (onSave) {
      await onSave(formData)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "edit" | "preview")
  }

  return (
    <div className="space-y-6 px-4 pb-10 pt-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link href="/admin/events">
            <Button variant="outline" size="sm" className="cursor-pointer w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {mode === "create" ? "Tạo sự kiện mới" : "Chỉnh sửa sự kiện"}
            </h1>
            <p className="text-gray-600">
              {mode === "create"
                ? "Thêm sự kiện mới vào hệ thống với giao diện trực quan"
                : "Chỉnh sửa thông tin sự kiện"
              }
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => setActiveTab(activeTab === "edit" ? "preview" : "edit")}
            className="cursor-pointer w-full sm:w-auto"
          >
            {activeTab === "edit" ? (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Xem preview
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-1" />
                Chỉnh sửa
              </>
            )}
          </Button>
          {onSave && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="cursor-pointer w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-1" />
              {saving ? "Đang lưu..." : (mode === "create" ? "Tạo sự kiện" : "Lưu thay đổi")}
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Chỉnh sửa
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Editor Column */}
            <div className="lg:col-span-2 space-y-6">
              <BasicFields
                title={formData.title}
                slug={formData.slug}
                description={formData.description}
                location={formData.location}
                dateDisplay={formData.dateDisplay}
                openingHours={formData.openingHours}
                heroImage={formData.heroImage}
                onFieldChange={handleFieldChange}
                validationErrors={validationErrors}
              />

              <ContentEditor
                value={formData.fullDescription}
                onChange={(value) => handleFieldChange("fullDescription", value)}
              />
            </div>

            {/* Right Sidebar - Quick Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5" />
                      Quick Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-semibold text-gray-900 truncate">
                          {formData.title || "Chưa có tiêu đề"}
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                          {formData.slug || "Chưa có slug"}
                        </p>
                      </div>

                      {formData.description && (
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Mô tả ngắn:</p>
                          <p className="text-gray-600 line-clamp-3">
                            {formData.description}
                          </p>
                        </div>
                      )}

                      {formData.location && (
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Địa điểm:</p>
                          <p className="text-gray-600">{formData.location}</p>
                        </div>
                      )}

                      {formData.dateDisplay && (
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Thời gian:</p>
                          <p className="text-gray-600">{formData.dateDisplay}</p>
                        </div>
                      )}

                      <div className="pt-4 border-t">
                        <p className="text-xs text-gray-500">
                          💡 Nhấn &ldquo;Xem preview&rdquo; để xem trang sự kiện hoàn chỉnh
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trạng thái</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <span className="font-medium text-green-600">
                          {mode === "create" ? "Mới tạo" : "Đang chỉnh sửa"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hero Image:</span>
                        <span className={`font-medium ${formData.heroImage ? "text-green-600" : "text-red-600"}`}>
                          {formData.heroImage ? "Đã tải lên" : "Chưa có"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nội dung chi tiết:</span>
                        <span className={`font-medium ${formData.fullDescription ? "text-green-600" : "text-red-600"}`}>
                          {formData.fullDescription ? "Đã có" : "Chưa có"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <LivePreview eventData={formData} />
        </TabsContent>
      </Tabs>

      {/* Validation Errors Summary */}
      {Object.keys(validationErrors).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-red-800 mb-2">Vui lòng hoàn thành các thông tin bắt buộc:</h3>
            <ul className="space-y-1 text-sm text-red-700">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  {error}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}