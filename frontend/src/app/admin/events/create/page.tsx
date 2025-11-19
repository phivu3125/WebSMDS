"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, X } from "lucide-react"
import { adminApi } from "@/lib/api"
import { ContentEditor } from "@/components/admin/event-editor/ContentEditor"
import { SingleImageUpload } from "@/components/admin/reusable-image-upload"

interface EventFormData {
  title: string
  subtitle: string
  slug: string
  description: string
  eventIntro: string // "Về sự kiện" content
  eventDetails: string // "Chi tiết sự kiện" content
  heroImage: string | File
  location: string
  dateDisplay: string
  openingHours: string
}

type EditableStringFields = 'title' | 'subtitle' | 'dateDisplay' | 'location' | 'openingHours' | 'slug'

export default function CreateEventPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState<boolean>(false)

  const [formData, setFormData] = useState<EventFormData>({
    title: "Tên sự kiện",
    subtitle: "Nơi Sáng Tạo Văn Hóa Giao Thoa Công Nghệ",
    slug: "",
    description: "",
    eventIntro: "",
    eventDetails: "",
    heroImage: "",
    location: "Địa điểm sự kiện",
    dateDisplay: "Ngày – tháng/2025",
    openingHours: "8h00 – 17h00 hàng ngày"
  })

  const [editingField, setEditingField] = useState<EditableStringFields | null>(null)
  const [tempValue, setTempValue] = useState("")

  // Auto-generate slug from title (when title changes and slug not touched)
  useEffect(() => {
    if (formData.title && !slugTouched) {
      const sanitized = sanitizeSlug(formData.title)
      if (sanitized && sanitized !== formData.slug) {
        setFormData(prev => ({ ...prev, slug: sanitized }))
      }
    }
  }, [formData.title, slugTouched])

  // Live update slug while editing the title input if slug not touched
  useEffect(() => {
    if (editingField === 'title' && !slugTouched && tempValue) {
      const sanitized = sanitizeSlug(tempValue)
      if (sanitized && sanitized !== formData.slug) {
        setFormData(prev => ({ ...prev, slug: sanitized }))
      }
    }
  }, [editingField, tempValue, slugTouched])

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

      const res = await adminApi.checkEventSlug(sanitized)
      return res.exists === true
    } catch (error) {
      console.error("Lỗi khi kiểm tra slug:", error)
      return false
    }
  }

  const handleInlineEdit = (field: EditableStringFields, value: string) => {
    setEditingField(field)
    if (field === 'slug') {
      setTempValue(sanitizeSlug(value))
      setSlugError(null)
      setSlugTouched(true)
    } else {
      setTempValue(value)
    }
  }

  const handleInlineSave = async () => {
    if (!editingField) return

    // When saving slug, sanitize and validate uniqueness
    if (editingField === 'slug') {
      const sanitized = sanitizeSlug(tempValue)
      if (!sanitized) {
        setSlugError('Slug không được để trống')
        return
      }

      // Check for duplicate slug
      try {
        const exists = await checkSlugExists(sanitized)
        if (exists) {
          setSlugError('Slug đã tồn tại, vui lòng chọn slug khác.')
          return
        }
      } catch (err) {
        // If the API fails, allow saving but clear error
        console.error('Error checking slug availability', err)
      }

      setFormData(prev => ({ ...prev, slug: sanitized }))
      setSlugError(null)
      setSlugTouched(true)
      setEditingField(null)
      setTempValue("")
      return
    }

    // Fallback for other fields
    setFormData(prev => ({ ...prev, [editingField]: tempValue }))
    setEditingField(null)
    setTempValue("")
  }

  const handleInlineCancel = () => {
    // If user cancels slug editing and left it blank, we should not mark it touched
    if (editingField === 'slug' && !formData.slug) setSlugTouched(false)
    setEditingField(null)
    setTempValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleInlineSave()
    } else if (e.key === 'Escape') {
      handleInlineCancel()
    }
  }

  const handleSave = async () => {
    setSubmitError(null)
    setSubmitSuccess(null)

    // Validate required fields
    if (!formData.title.trim() || formData.title === "Tên sự kiện") {
      setSubmitError("Vui lòng nhập tên sự kiện")
      return
    }

    if (!formData.slug.trim()) {
      setSubmitError("Slug không được để trống")
      return
    }

    if (!formData.description.trim()) {
      setSubmitError("Vui lòng nhập mô tả sự kiện")
      return
    }

    // Check for slug duplicates
    const slugExists = await checkSlugExists(formData.slug.trim())
    if (slugExists) {
      setSubmitError("Slug đã tồn tại, vui lòng chọn slug khác.")
      return
    }

    setSaving(true)

    try {
      // Upload hero image if it's a File
      let heroImageUrl = typeof formData.heroImage === 'string' ? formData.heroImage : undefined

      if (formData.heroImage instanceof File) {
        heroImageUrl = await adminApi.uploadImage(formData.heroImage)
      }

        // Prepare payload for backend
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        slug: formData.slug,
        description: formData.description,
        eventIntro: formData.eventIntro,
        eventDetails: formData.eventDetails,
        image: heroImageUrl, // Map heroImage to image field for backend compatibility
        location: formData.location,
        openingHours: formData.openingHours,
        dateDisplay: formData.dateDisplay,
        status: "draft"
      }

      await adminApi.createEvent(payload)
      setSubmitSuccess("Sự kiện đã được tạo thành công!")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/events")
      }, 2000)
    } catch (error: any) {
      console.error("Failed to create event:", error)
      const message = error?.message || "Không thể tạo sự kiện. Vui lòng thử lại."
      setSubmitError(message)
    } finally {
      setSaving(false)
    }
  }

  const renderEditableText = (field: EditableStringFields, className: string = "", placeholder: string = "") => {
    if (editingField === field) {
      return (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleInlineSave}
          onKeyDown={handleKeyDown}
          className={`w-full px-2 py-1 border-2 border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 ${className}`}
          autoFocus
        />
      )
    }

    return (
      <span
        onDoubleClick={() => handleInlineEdit(field, formData[field])}
        className={`cursor-text ${field !== 'slug' ? 'hover:bg-white hover:text-purple-400' : 'hover:bg-purple-50'} rounded px-2 py-1 transition-colors ${className}`}
        title="Double-click to edit"
      >
        {formData[field] || placeholder}
      </span>
    )
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FAF9F6]">
      {/* Hero Section */}
      <section
        className="relative w-full pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgb(115, 66, 186) 0%, #B668A1 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-2 text-white hover:gap-3 transition-all duration-300 cursor-pointer group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Quay lại</span>
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full cursor-pointer text-purple-900 font-semibold bg-yellow-300 hover:bg-yellow-200 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {saving ? "Đang lưu..." : "Lưu sự kiện"}
              </button>
            </div>
          </div>

          <div className="text-white">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm font-medium">Đang tạo sự kiện mới</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
              <span className="block bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                {renderEditableText("title", "inline-block", "Tên sự kiện")}
              </span>
            </h1>

            <p className="text-xl sm:text-2xl font-serif italic mb-8 text-purple-200">
              {renderEditableText("subtitle", "inline-block", "Phụ đề sự kiện")}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-70">Thời gian</p>
                  <p className="font-semibold">{renderEditableText("dateDisplay", "text-purple-100", "Ngày – tháng/2025")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-70">Địa điểm</p>
                  <p className="font-semibold">{renderEditableText("location", "text-purple-100", "Địa điểm sự kiện")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-70">Giờ mở cửa</p>
                  <p className="font-semibold">{renderEditableText("openingHours", "text-purple-100", "8h00 – 17h00")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Hero Image Upload */}
              <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8 flex items-center justify-center bg-gray-100">
                {formData.heroImage ? (
                  <div className="relative w-full flex items-start justify-center">
                    <img
                      src={formData.heroImage instanceof File ? URL.createObjectURL(formData.heroImage) : formData.heroImage}
                      alt={formData.title}
                      className="w-full h-auto max-h-[28rem] object-contain block"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex items-center justify-center h-full min-h-[280px] bg-gray-100">
                              <div class="text-center p-8">
                                <svg class="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p class="text-gray-600 font-medium">${formData.title}</p>
                                <p class="text-gray-500 text-sm mt-2">Hình ảnh đang cập nhật</p>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="absolute cursor-pointer top-2 right-2 z-10 h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      onClick={() => setFormData(prev => ({ ...prev, heroImage: "" }))}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full bg-gray-100 flex items-center justify-center py-8 min-h-[28rem]">
                    <SingleImageUpload
                      value={formData.heroImage}
                      onChange={(file) => setFormData(prev => ({ ...prev, heroImage: file || prev.heroImage }))}
                      size="lg"
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>

              {/* Event Intro Section */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2
                  className="text-3xl font-serif font-bold mb-4"
                  style={{ color: "#7342ba" }}
                >
                  Về sự kiện
                </h2>
                <div className="min-h-[200px]">
                  <ContentEditor
                    value={formData.eventIntro}
                    onChange={(content) => setFormData(prev => ({ ...prev, eventIntro: content }))}
                    className="border-0 shadow-none"
                  />
                </div>
              </div>

              {/* Event Details Section */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="min-h-[200px]">
                  <ContentEditor
                    value={formData.eventDetails}
                    onChange={(content) => setFormData(prev => ({ ...prev, eventDetails: content }))}
                    className="border-0 shadow-none"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Event Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3
                    className="text-xl font-serif font-bold mb-4"
                    style={{ color: "#7342ba" }}
                  >
                    Thông tin sự kiện
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Thời gian</p>
                      <p className="font-semibold text-gray-800">
                        {formData.dateDisplay || "Đang cập nhật"}
                      </p>
                    </div>
                    {formData.openingHours && (
                      <div>
                        <p className="text-gray-600 mb-1">Giờ mở cửa</p>
                        <p className="font-semibold text-gray-800">{formData.openingHours}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600 mb-1">Địa điểm</p>
                      <p className="font-semibold text-gray-800">{formData.location}</p>
                    </div>
                  </div>
                </div>

                {/* Registration Card */}
                <div
                  className="bg-white rounded-lg shadow-md p-6 mb-6"
                  style={{ borderTop: "4px solid #7342ba" }}
                >
                  <h3
                    className="text-2xl font-serif font-bold mb-3"
                    style={{ color: "#7342ba" }}
                  >
                    Đăng ký tham gia
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Để lại thông tin liên hệ, chúng tôi sẽ gửi lịch chi tiết và các quyền lợi tham dự.
                  </p>
                  <button
                    className="w-full px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:shadow-lg cursor-pointer"
                    style={{ backgroundColor: "#fcd34d" }}
                  >
                    Đăng ký ngay
                  </button>
                </div>

                {/* Description Field */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <label className="block text-xs text-gray-500 mb-2">Mô tả sự kiện *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
                    rows={3}
                    placeholder="Nhập mô tả ngắn về sự kiện..."
                  />
                </div>

                {/* Slug Display */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Slug (đường dẫn)</p>
                  <div>
                    <p className="text-sm font-mono text-gray-700 flex items-center gap-1">
                      <span className="text-gray-500">/events/</span>
                      {renderEditableText('slug', 'text-sm font-mono text-gray-700', 'ten-su-kien')}
                    </p>
                    {slugError && <p className="text-xs text-red-600 mt-2">{slugError}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success/Error Messages */}
      {submitError && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm rounded-xl border border-red-200 bg-white p-4 shadow-lg">
          <div className="text-sm font-semibold text-red-700">
            {submitError}
          </div>
          <button
            onClick={() => setSubmitError(null)}
            className="mt-3 text-xs font-medium text-red-600 hover:text-red-800"
          >
            Đóng
          </button>
        </div>
      )}

      {submitSuccess && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm rounded-xl border border-green-200 bg-white p-4 shadow-lg">
          <div className="text-sm font-semibold text-green-700">
            {submitSuccess}
          </div>
          <button
            onClick={() => setSubmitSuccess(null)}
            className="mt-3 text-xs font-medium text-green-600 hover:text-green-800"
          >
            Đóng
          </button>
        </div>
      )}
    </main>
  )
}