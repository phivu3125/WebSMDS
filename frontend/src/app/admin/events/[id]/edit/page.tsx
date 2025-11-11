"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ArrowLeft, Save, Eye, X } from "lucide-react"
import Link from "next/link"
import { adminApi } from "@/lib/api"
import { uploadImage, deleteImage } from "@/lib/api/admin/uploads"
import { EventPreview } from "./components/EventPreview"
import { SingleImageUpload } from "@/components/admin/reusable-image-upload"

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
  image: string
  imageFile?: File
  removedImage?: boolean
  location: string
  openingHours: string
  dateDisplay: string
  venueMap: string
  venueMapFile?: File
  removedVenueMap?: boolean
  pricingImage: string
  pricingImageFile?: File
  removedPricingImage?: boolean
  status: string
}

export default function EditEventPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)
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
  const slugInputRef = useRef<HTMLInputElement>(null)
  const [slugTouched, setSlugTouched] = useState(false)

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

  const scrollToSlugError = () => {
    if (slugInputRef.current) {
      slugInputRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      slugInputRef.current.focus()
    }
  }

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

  const checkSlugExists = async (slug: string): Promise<boolean> => {
    try {
      const sanitized = sanitizeSlug(slug)
      if (!sanitized) return false

      const res = await adminApi.checkEventSlug(sanitized, id)
      return res.exists === true
    } catch (error) {
      console.error("Lỗi khi kiểm tra slug:", error)
      return false
    }
  }

  useEffect(() => {
    if (id) {
      fetchEvent()
    }
  }, [id])

  const fetchEvent = async () => {
    try {
      const data = await adminApi.getEventById(id)
      setEvent(data)
      
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        description: data.description || "",
        fullDescription: data.fullDescription || "",
        image: data.image || "",
        location: data.location || "",
        openingHours: data.openingHours || "",
        dateDisplay: data.dateDisplay || "",
        venueMap: data.venueMap || "",
        pricingImage: data.pricingImage || "",
        status: data.status || "draft"
      })
      
      setSections(data.sections || [])
    } catch (error) {
      console.error("Failed to fetch event:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof EventFormData, value: string | File) => {
    setValidationError(null)

    if (field === "slug") {
      setSlugTouched(true)
    }

    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: field === "slug" ? sanitizeSlug(value as string) : value,
      }

      if (field === "title") {
        updated.slug = sanitizeSlug(value as string)
        setSlugTouched(false)
      }

      return updated
    })
  }

  const handleImageChange = (field: 'image' | 'venueMap' | 'pricingImage', value: string | File) => {
    setValidationError(null)

    setFormData(prev => {
      const updated = { ...prev } as any // Use any to allow dynamic property access

      if (value instanceof File) {
        // New file uploaded
        updated[field] = "" // Clear the URL since we have a new file
        updated[`${field}File`] = value
        updated[`removed${field.charAt(0).toUpperCase() + field.slice(1)}`] = false
      } else if (value === "") {
        // Image removed
        if (prev[field]) {
          // Had an existing image, mark for removal
          updated[`removed${field.charAt(0).toUpperCase() + field.slice(1)}`] = true
        }
        updated[field] = ""
        updated[`${field}File`] = undefined
      } else {
        // URL set (shouldn't happen in new system)
        updated[field] = value
      }

      return updated as EventFormData
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
      const next = filtered.length ? { ...prev, [sectionId]: filtered } : { ...prev }
      if (!filtered.length) {
        delete next[sectionId]
        return { ...next }
      }
      return next
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
    const updatedSections = sections.filter((_, i) => i !== index)
    setSections(updatedSections)
    const removedId = sections[index]?.id
    if (removedId) {
      setInvalidSectionTitles(prev => {
        const next = new Set(prev)
        next.delete(removedId)
        return next
      })
    }
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
      // Check for slug duplicates before saving
      if (formData.slug.trim()) {
        const slugExists = await checkSlugExists(formData.slug.trim())
        if (slugExists) {
          setValidationError("Slug đã tồn tại, vui lòng chọn slug khác.")
          setSaving(false)
          scrollToSlugError()
          return
        }
      }

      // Upload new images and delete old ones
      const imageFields: Array<{field: 'image' | 'venueMap' | 'pricingImage', fileField: 'imageFile' | 'venueMapFile' | 'pricingImageFile', removedField: 'removedImage' | 'removedVenueMap' | 'removedPricingImage'}> = [
        { field: 'image', fileField: 'imageFile', removedField: 'removedImage' },
        { field: 'venueMap', fileField: 'venueMapFile', removedField: 'removedVenueMap' },
        { field: 'pricingImage', fileField: 'pricingImageFile', removedField: 'removedPricingImage' }
      ]

      const updatedFormData = { ...formData }

      for (const { field, fileField, removedField } of imageFields) {
        const currentFile = updatedFormData[fileField]
        const originalValue = event?.[field]
        const isRemoved = updatedFormData[removedField]

        if (currentFile instanceof File) {
          // Upload new image
          const uploadedUrl = await uploadImage(currentFile)
          updatedFormData[field] = uploadedUrl

          // Delete old image if it exists
          if (originalValue && typeof originalValue === 'string') {
            try {
              const url = new URL(originalValue)
              const filename = url.pathname.split("/").filter(Boolean).pop()
              if (filename) {
                await deleteImage(filename)
              }
            } catch (deleteError) {
              console.warn("Failed to delete old image:", deleteError)
            }
          }
        } else if (isRemoved && originalValue && typeof originalValue === 'string') {
          // Image was removed, delete old image
          try {
            const url = new URL(originalValue)
            const filename = url.pathname.split("/").filter(Boolean).pop()
            if (filename) {
              await deleteImage(filename)
            }
          } catch (deleteError) {
            console.warn("Failed to delete old image:", deleteError)
          }
          updatedFormData[field] = ""
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
      
      await adminApi.updateEvent(id, payload)
      router.push("/admin/events")
    } catch (error) {
      console.error("Failed to save event:", error)
    } finally {
      setSaving(false)
    }
  }

  const updateStatus = async (targetStatus: "draft" | "published") => {
    if (!id) return

    setStatusUpdating(true)
    try {
      await adminApi.updateEventStatus(id, targetStatus)
      setFormData(prev => ({ ...prev, status: targetStatus }))
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setStatusUpdating(false)
    }
  }

  const handleStatusClick = () => {
    if (formData.status === "draft") {
      setStatusConfirmOpen(true)
      return
    }
    updateStatus("draft")
  }

  const confirmPublish = async () => {
    setStatusConfirmOpen(false)
    await updateStatus("published")
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!event) {
    return <div className="p-6">Event not found</div>
  }

  const previewEvent: Event = {
    ...formData,
    id: event.id,
    sections: sections,
    image: formData.imageFile ? "" : formData.image || undefined,
    venueMap: formData.venueMapFile ? "" : formData.venueMap || undefined,
    pricingImage: formData.pricingImageFile ? "" : formData.pricingImage || undefined,
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
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Chỉnh sửa sự kiện</h1>
            <p className="text-gray-600">Sửa thông tin sự kiện</p>
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
          <Button
            variant={formData.status === "draft" ? "default" : "outline"}
            onClick={handleStatusClick}
            disabled={statusUpdating}
            className={`cursor-pointer w-full sm:w-auto ${
              formData.status === "draft"
                ? "bg-green-600 text-white hover:bg-green-700"
                : ""
            }`}
          >
            {statusUpdating
              ? "Đang cập nhật..."
              : formData.status === "draft"
              ? "Đăng bản nháp"
              : "Chuyển thành nháp"}
          </Button>
          <Button onClick={saveEvent} disabled={saving} className="cursor-pointer w-full sm:w-auto">
            <Save className="h-4 w-4 mr-1" />
            {saving ? "Đang lưu..." : "Lưu"}
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
                ref={slugInputRef}
              />
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
            <SingleImageUpload
              value={formData.imageFile ? formData.imageFile : formData.image || undefined}
              onChange={(value) => handleImageChange("image", value || "")}
              label="Hình ảnh sự kiện"
              placeholder="Tải lên hình ảnh chính của sự kiện"
              size="lg"
            />
            <SingleImageUpload
              value={formData.venueMapFile ? formData.venueMapFile : formData.venueMap || undefined}
              onChange={(value) => handleImageChange("venueMap", value || "")}
              label="Sơ đồ địa điểm"
              placeholder="Tải lên sơ đồ địa điểm sự kiện"
              size="lg"
            />
            <SingleImageUpload
              value={formData.pricingImageFile ? formData.pricingImageFile : formData.pricingImage || undefined}
              onChange={(value) => handleImageChange("pricingImage", value || "")}
              label="Bảng giá"
              placeholder="Tải lên hình ảnh bảng giá"
              size="lg"
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

      {statusConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setStatusConfirmOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Đăng sự kiện?</h3>
              <p className="text-sm text-gray-600 mt-2">
                Sự kiện sẽ được hiển thị công khai cho người dùng. Bạn có chắc chắn muốn đăng bản nháp này?
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setStatusConfirmOpen(false)}
                className="cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                onClick={confirmPublish}
                disabled={statusUpdating}
                className="cursor-pointer bg-green-600 text-white hover:bg-green-700"
              >
                {statusUpdating ? "Đang đăng..." : "Đăng sự kiện"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
