"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, X } from "lucide-react"
import { ContentEditor } from "@/components/admin/event-editor/ContentEditor"
import { SingleImageUpload } from "@/components/admin/reusable-image-upload"

interface PastEventFormData {
  // Hero section
  title: string
  subtitle: string
  slug: string
  year: number
  thumbnailImage: string | File

  // Content (single rich text)
  content: string

  // Additional metadata
  description: string
}

type EditableStringFields = 'title' | 'subtitle' | 'year' | 'slug'

export default function CreatePastEventPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState<boolean>(false)

  const [formData, setFormData] = useState<PastEventFormData>({
    title: "Tên sự kiện",
    subtitle: "Sự kiện văn hóa đặc sắc",
    slug: "",
    year: new Date().getFullYear(),
    thumbnailImage: "",
    content: "",
    description: ""
  })

  const [editingField, setEditingField] = useState<EditableStringFields | null>(null)
  const [tempValue, setTempValue] = useState("")

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !slugTouched) {
      const sanitized = sanitizeSlug(formData.title)
      if (sanitized && sanitized !== formData.slug) {
        setFormData(prev => ({ ...prev, slug: sanitized }))
      }
    }
  }, [formData.title, slugTouched])

  // Live update slug while editing title
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

      const res = await fetch(`/api/admin/past-events/check-slug?slug=${encodeURIComponent(sanitized)}`)
      const data = await res.json()
      return data.exists === true
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

    if (editingField === 'slug') {
      const sanitized = sanitizeSlug(tempValue)
      if (!sanitized) {
        setSlugError('Slug không được để trống')
        return
      }

      const exists = await checkSlugExists(sanitized)
      if (exists) {
        setSlugError('Slug đã tồn tại, vui lòng chọn slug khác.')
        return
      }

      setFormData(prev => ({ ...prev, slug: sanitized }))
      setSlugError(null)
      setSlugTouched(true)
      setEditingField(null)
      setTempValue("")
      return
    }

    if (editingField === 'year') {
      const year = parseInt(tempValue)
      if (year >= 1900 && year <= 2100) {
        setFormData(prev => ({ ...prev, year }))
      }
    } else {
      setFormData(prev => ({ ...prev, [editingField]: tempValue }))
    }

    setEditingField(null)
    setTempValue("")
  }

  const handleInlineCancel = () => {
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

    if (!formData.content.trim()) {
      setSubmitError("Vui lòng nhập nội dung sự kiện")
      return
    }

    const slugExists = await checkSlugExists(formData.slug.trim())
    if (slugExists) {
      setSubmitError("Slug đã tồn tại, vui lòng chọn slug khác.")
      return
    }

    setSaving(true)

    try {
      // Upload thumbnail image if it's a File
      let thumbnailUrl = typeof formData.thumbnailImage === 'string' ? formData.thumbnailImage : undefined

      if (formData.thumbnailImage instanceof File) {
        const formDataUpload = new FormData()
        formDataUpload.append('image', formData.thumbnailImage)

        const uploadResponse = await fetch('/api/admin/uploads', {
          method: 'POST',
          body: formDataUpload
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          thumbnailUrl = uploadData.url
        }
      }

      // Prepare payload for backend (mapping to existing schema)
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        slug: formData.slug,
        description: formData.description,
        year: formData.year,
        thumbnailImage: thumbnailUrl,
        intro: {
          content: formData.content,
          align: "start"
        },
        featureList: {
          items: []
        },
        gallery: {
          images: []
        },
        conclusion: {
          content: ""
        },
        hero: {
          backgroundImage: thumbnailUrl
        }
      }

      const response = await fetch('/api/admin/past-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setSubmitSuccess("Sự kiện đã được tạo thành công!")
        setTimeout(() => {
          router.push("/admin/past-events")
        }, 2000)
      } else {
        throw new Error("Không thể tạo sự kiện")
      }
    } catch (error: unknown) {
      console.error("Failed to create past-event:", error)
      const message = error instanceof Error ? error.message : "Không thể tạo sự kiện. Vui lòng thử lại."
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

    const displayValue = field === 'year' ? formData.year.toString() : formData[field]

    return (
      <span
        onDoubleClick={() => handleInlineEdit(field, displayValue)}
        className={`cursor-text ${field !== 'slug' ? 'hover:bg-white hover:text-purple-400' : 'hover:bg-purple-50'} rounded px-2 py-1 transition-colors ${className}`}
        title="Double-click to edit"
      >
        {displayValue || placeholder}
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
              href="/admin/past-events"
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
                <span className="text-sm font-medium">Đang tạo sự kiện quá khứ mới</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="inline-flex px-4 py-2 rounded-full font-bold text-sm"
                   style={{ backgroundColor: "#D4AF37", color: "white" }}>
                Sự kiện {renderEditableText("year", "text-white", new Date().getFullYear().toString())}
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
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Thumbnail Image Upload */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-serif font-bold mb-4" style={{ color: "#7342ba" }}>
                  Ảnh đại diện
                </h3>
                <div className="w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {formData.thumbnailImage ? (
                    <div className="relative w-full flex items-start justify-center">
                      <img
                        src={formData.thumbnailImage instanceof File ? URL.createObjectURL(formData.thumbnailImage) : formData.thumbnailImage}
                        alt={formData.title}
                        className="w-full h-auto max-h-[20rem] object-contain block"
                      />
                      <button
                        type="button"
                        className="absolute cursor-pointer top-2 right-2 z-10 h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                        onClick={() => setFormData(prev => ({ ...prev, thumbnailImage: "" }))}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full bg-gray-100 flex items-center justify-center py-8 min-h-[20rem]">
                      <SingleImageUpload
                        value={formData.thumbnailImage}
                        onChange={(file) => setFormData(prev => ({ ...prev, thumbnailImage: file || prev.thumbnailImage }))}
                        size="lg"
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-serif font-bold mb-6" style={{ color: "#7342ba" }}>
                  Nội dung sự kiện
                </h2>
                <div className="min-h-[400px]">
                  <ContentEditor
                    value={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    className="border-0 shadow-none"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Event Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-4" style={{ color: "#7342ba" }}>
                    Thông tin sự kiện
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Năm sự kiện</p>
                      <p className="font-semibold text-gray-800">{formData.year}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Nội dung</p>
                      <p className="font-semibold text-gray-800">
                        {formData.content ? "Đã có" : "Chưa có"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description Field */}
                <div className="bg-gray-50 rounded-lg p-4">
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
                      <span className="text-gray-500">/past-events/</span>
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