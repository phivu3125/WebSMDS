"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { adminApi } from "@/lib/api"
import { EventEditor } from "@/components/admin/event-editor/EventEditor"

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

export default function CreateEventPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

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

  const handleSave = async (formData: EventFormData) => {
    // Validate slug format
    if (!formData.slug.trim()) {
      throw new Error("Slug không được để trống")
    }

    // Check for slug duplicates
    const slugExists = await checkSlugExists(formData.slug.trim())
    if (slugExists) {
      throw new Error("Slug đã tồn tại, vui lòng chọn slug khác.")
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
        slug: formData.slug,
        description: formData.description,
        fullDescription: formData.fullDescription,
        image: heroImageUrl, // Map heroImage to image field for backend compatibility
        location: formData.location,
        openingHours: formData.openingHours,
        dateDisplay: formData.dateDisplay,
        status: "draft",
        // Note: sections are handled differently in the new editor
        sections: [] // Empty sections array for now
      }

      await adminApi.createEvent(payload)
      router.push("/admin/events")
    } catch (error) {
      console.error("Failed to create event:", error)
      throw error // Re-throw to let EventEditor handle the error display
    } finally {
      setSaving(false)
    }
  }

  return (
    <EventEditor
      mode="create"
      onSave={handleSave}
      saving={saving}
    />
  )
}