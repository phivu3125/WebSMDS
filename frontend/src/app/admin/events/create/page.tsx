"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ArrowLeft, Save, Eye, X } from "lucide-react"
import Link from "next/link"
import { adminApi } from "@/lib/api"
import { ImageUpload } from "../[id]/edit/components/ImageUpload"
import { EventPreview } from "../[id]/edit/components/EventPreview"

interface EventSection {
  id: string
  title: string
  items: string[]
  position: number
}

interface Event {
  id: string
  title: string
  slug: string
  description: string
  fullDescription?: string
  image?: string
  location?: string
  openingHours?: string
  dateDisplay?: string
  venueMap?: string
  pricingImage?: string
  sections?: EventSection[]
  status: string
}

interface EventFormData {
  title: string
  slug: string
  description: string
  fullDescription: string
  image: string | File
  location: string
  openingHours: string
  dateDisplay: string
  venueMap: string | File
  pricingImage: string | File
  status: string
}

export default function CreateEventPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    slug: "",
    description: "",
    fullDescription: "",
    image: "",
    location: "",
    openingHours: "",
    dateDisplay: "",
    venueMap: "",
    pricingImage: "",
    status: "draft"
  })
  const [sections, setSections] = useState<EventSection[]>([])
  const [invalidSectionItems, setInvalidSectionItems] = useState<Record<string, number[]>>({})
  const [invalidSectionTitles, setInvalidSectionTitles] = useState<Set<string>>(new Set())

  const scrollToFirstInvalid = (invalidMap: Record<string, number[]>) => {
    for (const section of sections) {
      const indices = invalidMap[section.id]
      if (indices && indices.length) {
        const targetId = `section-${section.id}-item-${indices[0]}`
        const element = document.getElementById(targetId)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }, 0)
        }
        break
      }
    }
  }

  const scrollToFirstInvalidTitle = (invalidIds: Set<string>) => {
    for (const section of sections) {
      if (invalidIds.has(section.id)) {
        const targetId = `section-${section.id}-title`
        const element = document.getElementById(targetId)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }, 0)
        }
        break
      }
    }
  }

  const handleInputChange = (field: keyof EventFormData, value: string | File) => {
    setValidationError(null)

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

    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: field === "slug" ? sanitizeSlug(value as string) : value,
      }

      if (field === "title") {
        updated.slug = sanitizeSlug(value as string)
      }

      return updated
    })
  }

  const addSection = () => {
    const newSection: EventSection = {
      id: Date.now().toString(),
      title: "",
      items: [""],
      position: sections.length
    }
    setSections([...sections, newSection])
    setInvalidSectionTitles(prev => new Set([...prev, newSection.id]))
    setInvalidSectionItems(prev => ({ ...prev, [newSection.id]: [0] }))
  }

  const updateSection = (index: number, field: string, value: any) => {
    const updatedSections = [...sections]
    if (field === "title") {
      updatedSections[index].title = value
      const sectionId = updatedSections[index].id
      setInvalidSectionTitles(prev => {
        const next = new Set(prev)
        if (!value.trim()) {
          next.add(sectionId)
        } else {
          next.delete(sectionId)
        }
        return next
      })
    } else if (field === "items") {
      updatedSections[index].items = value
    }
    setSections(updatedSections)
  }

  const addSectionItem = (sectionIndex: number) => {
    const section = sections[sectionIndex]
    if (!section) return

    if (section.items.some(item => !item.trim())) {
      setValidationError("Vui lòng điền nội dung cho các mục hiện có trước khi thêm mục mới.")
      const nextInvalid = {
        ...invalidSectionItems,
        [section.id]: section.items
          .map((item, idx) => (!item.trim() ? idx : null))
          .filter((idx): idx is number => idx !== null),
      }
      setInvalidSectionItems(nextInvalid)
      scrollToFirstInvalid(nextInvalid)
      return
    }

    setValidationError(null)
    setInvalidSectionItems(prev => ({ ...prev, [section.id]: [] }))
    const updatedSections = [...sections]
    updatedSections[sectionIndex] = {
      ...section,
      items: [...section.items, ""],
    }
    setSections(updatedSections)
  }

  const updateSectionItem = (sectionIndex: number, itemIndex: number, value: string) => {
    const updatedSections = [...sections]
    updatedSections[sectionIndex].items[itemIndex] = value
    setSections(updatedSections)

    const sectionId = updatedSections[sectionIndex].id
    setInvalidSectionItems(prev => {
      const current = prev[sectionId] || []
      const filtered = current.filter(idx => idx !== itemIndex)
      if (!value.trim()) {
        return { ...prev, [sectionId]: [...filtered, itemIndex] }
      }
      if (!filtered.length) {
        const { [sectionId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [sectionId]: filtered }
    })
  }

  const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
    const updatedSections = [...sections]
    updatedSections[sectionIndex].items.splice(itemIndex, 1)
    setSections(updatedSections)

    const sectionId = updatedSections[sectionIndex].id
    setInvalidSectionItems(prev => {
      if (!prev[sectionId]) return prev
      const filtered = prev[sectionId]
        .filter(idx => idx !== itemIndex)
        .map(idx => (idx > itemIndex ? idx - 1 : idx))
      if (!filtered.length) {
        const { [sectionId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [sectionId]: filtered }
    })
  }

  const removeSection = (index: number) => {
    const removed = sections[index]
    const updatedSections = sections.filter((_, i) => i !== index)
    setSections(updatedSections)
    setInvalidSectionItems(prev => {
      if (!removed) return prev
      const { [removed.id]: _, ...rest } = prev
      return rest
    })
    setInvalidSectionTitles(prev => {
      if (!removed) return prev
      const next = new Set(prev)
      next.delete(removed.id)
      return next
    })
  }

  const saveEvent = async () => {
    const isMissingRequiredField = [
      formData.title,
      formData.slug,
      formData.description,
      formData.fullDescription,
      formData.dateDisplay,
      formData.location,
      formData.openingHours,
    ].some(value => !value.trim())

    if (isMissingRequiredField) {
      setValidationError("Vui lòng nhập đầy đủ các trường bắt buộc.")
      return
    }

    const emptyTitles = new Set(
      sections.filter(section => !section.title.trim()).map(section => section.id)
    )
    if (emptyTitles.size) {
      setValidationError("Mỗi phần cần có tiêu đề.")
      setInvalidSectionTitles(emptyTitles)
      scrollToFirstInvalidTitle(emptyTitles)
      return
    }

    const hasEmptySectionItem = sections.some(section =>
      section.items.some(item => !item.trim())
    )

    if (hasEmptySectionItem) {
      setValidationError("Mỗi mục trong phần nội dung phải có nội dung trước khi lưu.")
      const invalidMap = Object.fromEntries(
        sections.map(section => [
          section.id,
          section.items
            .map((item, idx) => (!item.trim() ? idx : null))
            .filter((idx): idx is number => idx !== null),
        ]).filter(([, indices]) => indices.length)
      )
      setInvalidSectionItems(invalidMap)
      scrollToFirstInvalid(invalidMap)
      return
    }

    const hasSectionTitleWithoutContent = sections.some(section => {
      if (!section.title.trim()) return false
      if (!section.items.length) return true
      return section.items.every(item => !item.trim())
    })

    if (hasSectionTitleWithoutContent) {
      setValidationError("Phần có tiêu đề phải chứa ít nhất một mục nội dung.")
      const invalidMap = Object.fromEntries(
        sections.map(section => [
          section.id,
          section.title.trim() && (!section.items.length || section.items.every(item => !item.trim()))
            ? section.items.length
              ? section.items.map((_, idx) => idx)
              : [0]
            : [],
        ]).filter(([, indices]) => indices.length)
      )
      if (Object.keys(invalidMap).length) {
        setInvalidSectionItems(invalidMap)
        scrollToFirstInvalid(invalidMap)
      }
      return
    }

    setInvalidSectionTitles(new Set())
    setInvalidSectionItems({})
    setSaving(true)
    try {
      // Upload images before creating event
      const imageFields = ['image', 'venueMap', 'pricingImage'] as const
      const updatedFormData = { ...formData }
      
      for (const field of imageFields) {
        const value = formData[field]
        if (value instanceof File) {
          const uploadedUrl = await adminApi.uploadImage(value)
          updatedFormData[field] = uploadedUrl
        }
      }

      const payload = {
        title: updatedFormData.title,
        slug: updatedFormData.slug,
        description: updatedFormData.description,
        fullDescription: updatedFormData.fullDescription,
        image: typeof updatedFormData.image === 'string' ? updatedFormData.image : undefined,
        location: updatedFormData.location,
        openingHours: updatedFormData.openingHours,
        dateDisplay: updatedFormData.dateDisplay,
        venueMap: typeof updatedFormData.venueMap === 'string' ? updatedFormData.venueMap : undefined,
        pricingImage: typeof updatedFormData.pricingImage === 'string' ? updatedFormData.pricingImage : undefined,
        status: updatedFormData.status,
        sections: sections.map(section => ({
          ...section,
          position: sections.indexOf(section)
        }))
      }
      
      await adminApi.createEvent(payload)
      router.push("/admin/events")
    } catch (error) {
      console.error("Failed to create event:", error)
      setValidationError(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.")
    } finally {
      setSaving(false)
    }
  }

  const previewEvent: Event = {
    ...formData,
    id: "preview",
    sections: sections,
    image: typeof formData.image === 'string' ? formData.image : undefined,
    venueMap: typeof formData.venueMap === 'string' ? formData.venueMap : undefined,
    pricingImage: typeof formData.pricingImage === 'string' ? formData.pricingImage : undefined,
  }

  return (
    <div className="space-y-6 px-4 pb-10 pt-4 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link href="/admin/events">
            <Button variant="outline" size="sm" className="cursor-pointer w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Tạo sự kiện mới</h1>
            <p className="text-gray-600">Thêm sự kiện mới vào hệ thống</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => setPreviewOpen(true)}
            className="cursor-pointer w-full sm:w-auto"
          >
            <Eye className="h-4 w-4 mr-1" />
            Xem preview
          </Button>
          <Button onClick={saveEvent} disabled={saving} className="cursor-pointer w-full sm:w-auto">
            <Save className="h-4 w-4 mr-1" />
            {saving ? "Đang lưu..." : "Tạo sự kiện"}
          </Button>
        </div>
      </div>

      {validationError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {validationError}
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tiêu đề *</label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Nhập tiêu đề sự kiện"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <Input
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="slug-su-kiem"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Slug sẽ được tự động tạo từ tiêu đề</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mô tả ngắn *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Mô tả ngắn về sự kiện"
                className="w-full p-3 border rounded-md min-h-[100px]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mô tả chi tiết *</label>
              <textarea
                value={formData.fullDescription}
                onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                placeholder="Mô tả chi tiết về sự kiện"
                className="w-full p-3 border rounded-md min-h-[150px]"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin sự kiện</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ngày diễn ra *</label>
              <Input
                value={formData.dateDisplay}
                onChange={(e) => handleInputChange("dateDisplay", e.target.value)}
                placeholder="Ví dụ: 15-17/12/2024"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Địa điểm *</label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Địa điểm tổ chức"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Giờ mở cửa *</label>
              <Input
                value={formData.openingHours}
                onChange={(e) => handleInputChange("openingHours", e.target.value)}
                placeholder="Ví dụ: 8:00 - 22:00"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hình ảnh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              value={formData.image}
              onChange={(url) => handleInputChange("image", url)}
              label="Hình ảnh sự kiện"
              placeholder="Tải lên hình ảnh chính của sự kiện"
            />
            <ImageUpload
              value={formData.venueMap}
              onChange={(url) => handleInputChange("venueMap", url)}
              label="Sơ đồ địa điểm"
              placeholder="Tải lên sơ đồ địa điểm sự kiện"
            />
            <ImageUpload
              value={formData.pricingImage}
              onChange={(url) => handleInputChange("pricingImage", url)}
              label="Bảng giá"
              placeholder="Tải lên hình ảnh bảng giá"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Các phần nội dung</CardTitle>
              <Button onClick={addSection} size="sm" className="cursor-pointer w-full sm:w-auto">
                Thêm phần
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.map((section, index) => (
              <div key={section.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Input
                    id={`section-${section.id}-title`}
                    value={section.title}
                    onChange={(e) => updateSection(index, "title", e.target.value)}
                    placeholder="Tiêu đề phần"
                    className={cn(
                      "w-full font-semibold sm:w-auto",
                      invalidSectionTitles.has(section.id) && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSection(index)}
                    className="cursor-pointer w-full sm:w-auto"
                  >
                    Xóa
                  </Button>
                </div>
                {invalidSectionTitles.has(section.id) && (
                  <p className="text-xs text-red-500">Tiêu đề phần không được để trống.</p>
                )}
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => {
                    const isInvalid = invalidSectionItems[section.id]?.includes(itemIndex)
                    return (
                      <div key={itemIndex} className="flex flex-col gap-1">
                        <div
                          id={`section-${section.id}-item-${itemIndex}`}
                          className="flex flex-col gap-2 sm:flex-row sm:items-center"
                        >
                          <Input
                            value={item}
                            onChange={(e) => updateSectionItem(index, itemIndex, e.target.value)}
                            placeholder="Nội dung mục"
                            className={isInvalid ? "border-red-500 focus-visible:ring-red-500" : undefined}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSectionItem(index, itemIndex)}
                            className="cursor-pointer w-full sm:w-auto"
                          >
                            Xóa
                          </Button>
                        </div>
                        {isInvalid && (
                          <p className="text-xs text-red-500">Mục này cần có nội dung.</p>
                        )}
                      </div>
                    )
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSectionItem(index)}
                    className="cursor-pointer w-full sm:w-auto"
                  >
                    Thêm mục
                  </Button>
                </div>
              </div>
            ))}
            {sections.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Chưa có phần nội dung nào</p>
                <p className="text-sm">Nhấn "Thêm phần" để bắt đầu</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setPreviewOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xem trước sự kiện</h3>
                <p className="text-sm text-gray-500">Hiển thị như người dùng sẽ thấy</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewOpen(false)}
                aria-label="Đóng preview"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <EventPreview event={previewEvent} sections={sections} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
