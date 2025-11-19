"use client"

import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Upload, X } from "lucide-react"
import SimpleRichEditor from "@/components/admin/simple-rich-editor"
import { PastEvent, PastEventFeatureItem, PastEventGalleryImage } from "@/types/PastEvent"
import { adminApiFetch } from "@/lib/api/admin/base"
import { uploadImage, deleteImage } from "@/lib/api/admin/uploads"
import { SingleImageUpload, AddImageButton } from "@/components/admin/reusable-image-upload"

type FeatureItem = PastEvent["featureList"]["items"][number]
type GalleryImage = PastEventGalleryImage

type PastEventFormState = {
    title: string
    slug: string
    subtitle?: string
    description?: string
    year: number
    thumbnailImage?: string
    thumbnailFile?: File
    removedThumbnail?: boolean
    hero: PastEvent["hero"] & { heroFile?: File; removedHero?: boolean }
    intro: PastEvent["intro"]
    featureList: PastEvent["featureList"] & {
        items: Array<PastEventFeatureItem & { newImages?: File[]; removedImages?: string[] }>
    }
    gallery: {
        images: Array<GalleryImage & { newFile?: File; removed?: boolean }>
    }
    conclusion: PastEvent["conclusion"]
}

type FormErrors = {
    title?: string
    slug?: string
    year?: string
    intro?: string
    conclusion?: string
    features?: { [key: number]: { title?: string; content?: string } }
}

type SanitizedPastEventPayload = Omit<PastEvent, "id" | "createdAt" | "updatedAt">

const FEATURE_IMAGE_LIMIT = 4
const GALLERY_IMAGE_LIMIT = 9

const sanitizeSlug = (input: string) => {
    if (!input) return ""

    return input
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
}

const isRichTextEmpty = (value: string): boolean => {
    if (!value) return true
    const plainText = value
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    return plainText.length === 0
}

const createDefaultFormState = (): PastEventFormState => ({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    year: new Date().getFullYear(),
    thumbnailImage: "",
    hero: {
        backgroundImage: "",
    },
    intro: {
        content: "",
        align: "start",
    },
    featureList: {
        items: [
            {
                title: "",
                subtitle: "",
                content: "",
                images: [],
            },
        ],
    },
    gallery: {
        images: [],
    },
    conclusion: {
        content: "",
    },
})

const normalizeEventData = (event: PastEvent): PastEventFormState => ({
    title: event.title ?? "",
    slug: event.slug ?? "",
    subtitle: event.subtitle ?? "",
    description: event.description ?? "",
    year: event.year ?? new Date().getFullYear(),
    thumbnailImage: event.thumbnailImage ?? "",
    hero: {
        backgroundImage: event.hero?.backgroundImage ?? "",
    },
    intro: {
        content: event.intro?.content ?? "",
        align: event.intro?.align ?? "start",
    },
    featureList: {
        items: event.featureList?.items?.length
            ? event.featureList.items.map((item) => ({
                title: item.title ?? "",
                subtitle: item.subtitle ?? "",
                content: item.content ?? "",
                images: item.images ?? [],
            }))
            : [
                {
                    title: "",
                    subtitle: "",
                    content: "",
                    images: [],
                },
            ],
    },
    gallery: {
        images: event.gallery?.images?.length
            ? event.gallery.images.map((image) => ({
                url: image.url,
                alt: image.alt ?? "",
            }))
            : [],
    },
    conclusion: {
        content: event.conclusion?.content ?? "",
    },
})

const sanitizeFormData = (data: PastEventFormState): SanitizedPastEventPayload => {
    const title = data.title.trim()
    const slug = sanitizeSlug(data.slug.trim())

    const subtitle = data.subtitle?.trim()
    const description = data.description?.trim()
    const thumbnailImage = data.thumbnailImage?.trim()
    const heroBackground = data.hero.backgroundImage?.trim()

    const items: FeatureItem[] = data.featureList.items
        .map((item) => ({
            title: item.title.trim(),
            subtitle: item.subtitle?.trim(),
            content: item.content,
            images: (item.images ?? []).filter((url) => Boolean(url)),
        }))
        .filter((item) => Boolean(item.title) && !isRichTextEmpty(item.content))

    const galleryImages: GalleryImage[] = data.gallery.images
        .filter((image) => Boolean(image.url))
        .map((image) => ({
            url: image.url,
            ...(image.alt?.trim() ? { alt: image.alt.trim() } : {}),
        }))

    return {
        title,
        slug,
        subtitle: subtitle || undefined,
        description: description || undefined,
        year: data.year,
        thumbnailImage: thumbnailImage || undefined,
        hero: heroBackground ? { backgroundImage: heroBackground } : {},
        intro: {
            content: data.intro.content,
            align: data.intro.align,
        },
        featureList: {
            items,
        },
        gallery: {
            images: galleryImages,
        },
        conclusion: data.conclusion ? {
            content: data.conclusion.content,
        } : undefined,
    }
}

interface PastEventFormProps {
    eventId?: string
}

export default function PastEventForm({ eventId }: PastEventFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState<PastEventFormState>(() => createDefaultFormState())
    const [errors, setErrors] = useState<FormErrors>({})
    const [event, setEvent] = useState<PastEvent | null>(null)
    const [slugTouched, setSlugTouched] = useState(false)

    const slugInputRef = useRef<HTMLInputElement>(null)


    useEffect(() => {
        if (eventId) {
            void fetchEvent()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId])

    useEffect(() => {
        // Cleanup function to revoke blob URLs when component unmounts
        return () => {
            // Cleanup thumbnail
            if (formData.thumbnailImage?.startsWith('blob:')) {
                URL.revokeObjectURL(formData.thumbnailImage)
            }

            // Cleanup hero background
            if (formData.hero.backgroundImage?.startsWith('blob:')) {
                URL.revokeObjectURL(formData.hero.backgroundImage)
            }

            // Cleanup feature images
            formData.featureList.items.forEach(item => {
                (item.images ?? []).forEach((img: string) => {
                    if (img?.startsWith('blob:')) {
                        URL.revokeObjectURL(img)
                    }
                })
            })

            // Cleanup gallery images
            formData.gallery.images.forEach(img => {
                if (img.url?.startsWith('blob:')) {
                    URL.revokeObjectURL(img.url)
                }
            })
        }
    }, [formData])

    const fetchEvent = async () => {
        try {
            const res = await adminApiFetch(`past-events/${eventId}`)
            const data: PastEvent = await res.json()
            if (!res.ok) {
                throw new Error("Failed to fetch event")
            }
            setEvent(data)
            const normalized = normalizeEventData(data)
            setFormData(normalized)

            const currentSlug = normalized.slug?.trim() ?? ""
            const autoSlug = sanitizeSlug(normalized.title)
            const isCustomSlug = Boolean(currentSlug) && currentSlug !== autoSlug
            setSlugTouched(isCustomSlug)
        } catch (error) {
            console.error("Error fetching event:", error)
            alert("Không thể tải dữ liệu sự kiện")
        }
    }

    const checkSlugExists = async (slug: string): Promise<boolean> => {
        try {
            const sanitized = sanitizeSlug(slug)
            if (!sanitized) return false

            const params = new URLSearchParams({ slug: sanitized })
            if (eventId) {
                params.append("excludeId", eventId)
            }

            const res = await adminApiFetch(`past-events/check-slug?${params.toString()}`)
            const data = await res.json()
            return data.exists === true
        } catch (error) {
            console.error("Lỗi khi kiểm tra slug:", error)
            // Return false instead of throwing so form submission can continue
            return false
        }
    }


    const handleThumbnailUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            alert("Chỉ cho phép file hình ảnh có định dạng: JPG, PNG, WebP")
            event.target.value = ""
            return
        }

        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            alert("Kích thước file không được vượt quá 5MB")
            event.target.value = ""
            return
        }

        // Create preview URL for display
        const previewUrl = URL.createObjectURL(file)
        setFormData((prev) => ({
            ...prev,
            thumbnailImage: previewUrl,
            thumbnailFile: file
        }))
        event.target.value = ""
    }

    const handleHeroBackgroundUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            alert("Chỉ cho phép file hình ảnh có định dạng: JPG, PNG, WebP")
            event.target.value = ""
            return
        }

        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            alert("Kích thước file không được vượt quá 5MB")
            event.target.value = ""
            return
        }

        // Create preview URL for display
        const previewUrl = URL.createObjectURL(file)
        setFormData((prev) => ({
            ...prev,
            hero: {
                ...prev.hero,
                backgroundImage: previewUrl,
                heroFile: file,
            },
        }))
        event.target.value = ""
    }

    const handleIntroAlignChange = (align: PastEvent["intro"]["align"]) => {
        setFormData((prev) => ({
            ...prev,
            intro: {
                ...prev.intro,
                align,
            },
        }))
    }

    const handleIntroContentChange = (content: string) => {
        setFormData((prev) => ({
            ...prev,
            intro: {
                ...prev.intro,
                content,
            },
        }))
    }

    const updateFeatureItem = (index: number, patch: Partial<FeatureItem>) => {
        setFormData((prev) => {
            const items = [...prev.featureList.items]
            items[index] = { ...items[index], ...patch }
            return {
                ...prev,
                featureList: {
                    items,
                },
            }
        })
    }

    const addFeatureItem = () => {
        setFormData((prev) => ({
            ...prev,
            featureList: {
                items: [
                    ...prev.featureList.items,
                    { title: "", subtitle: "", content: "", images: [] },
                ],
            },
        }))
    }

    const removeFeatureItem = (index: number) => {
        setFormData((prev) => {
            const items = prev.featureList.items.filter((_, idx) => idx !== index)
            return {
                ...prev,
                featureList: {
                    items: items.length ? items : [{ title: "", subtitle: "", content: "", images: [] }],
                },
            }
        })
    }

    const handleFeatureImageUpload = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            alert("Chỉ cho phép file hình ảnh có định dạng: JPG, PNG, WebP")
            event.target.value = ""
            return
        }

        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            alert("Kích thước file không được vượt quá 5MB")
            event.target.value = ""
            return
        }

        const currentImages = formData.featureList.items[index].images ?? []
        const currentNewImages = formData.featureList.items[index].newImages ?? []

        if (currentImages.length >= FEATURE_IMAGE_LIMIT) {
            alert(`Tối đa ${FEATURE_IMAGE_LIMIT} ảnh cho mỗi hoạt động`)
            event.target.value = ""
            return
        }

        // Create preview URL for display
        const previewUrl = URL.createObjectURL(file)
        setFormData((prev) => {
            const items = [...prev.featureList.items]
            const newImages = [...(items[index].newImages ?? []), file]
            items[index] = {
                ...items[index],
                images: [...(items[index].images ?? []), previewUrl],
                newImages,
            }

            return {
                ...prev,
                featureList: {
                    items,
                },
            }
        })
        event.target.value = ""
    }

    const removeFeatureImage = (itemIndex: number, imageIndex: number) => {
        setFormData((prev) => {
            const items = [...prev.featureList.items]
            const item = items[itemIndex]
            const imageToRemove = item.images?.[imageIndex]

            if (!imageToRemove) return prev

            // Check if this is a new file or existing server image
            const newImages = item.newImages ?? []
            const existingImageCount = (item.images?.length ?? 0) - newImages.length
            const removedImages = item.removedImages ?? []

            if (imageIndex >= existingImageCount) {
                // This is a new file, remove from newImages array
                const newImageIndex = imageIndex - existingImageCount
                newImages.splice(newImageIndex, 1)
            } else {
                // This is an existing server image, add to removedImages
                removedImages.push(imageToRemove)
            }

            const nextImages = (item.images ?? []).filter((_: string, idx: number) => idx !== imageIndex)
            items[itemIndex] = {
                ...item,
                images: nextImages,
                newImages,
                removedImages: removedImages
            }

            return {
                ...prev,
                featureList: {
                    items,
                },
            }
        })
    }

    const handleAddGalleryImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            alert("Chỉ cho phép file hình ảnh có định dạng: JPG, PNG, WebP")
            event.target.value = ""
            return
        }

        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            alert("Kích thước file không được vượt quá 5MB")
            event.target.value = ""
            return
        }

        const currentImages = formData.gallery.images
        const currentNewImages = currentImages.filter(img => img.newFile)

        if (currentImages.length >= GALLERY_IMAGE_LIMIT) {
            alert(`Tối đa ${GALLERY_IMAGE_LIMIT} ảnh trong thư viện`)
            event.target.value = ""
            return
        }

        // Create preview URL for display
        const previewUrl = URL.createObjectURL(file)
        setFormData((prev) => ({
            ...prev,
            gallery: {
                images: [...prev.gallery.images, { url: previewUrl, alt: "", newFile: file }],
            },
        }))
        event.target.value = ""
    }

    const updateGalleryImageAlt = (index: number, alt: string) => {
        setFormData((prev) => {
            const images = [...prev.gallery.images]
            images[index] = { ...images[index], alt }
            return {
                ...prev,
                gallery: { images },
            }
        })
    }

    const removeGalleryImage = (index: number) => {
        setFormData((prev) => {
            const images = [...prev.gallery.images]
            const imageToRemove = images[index]

            if (imageToRemove.newFile) {
                // This is a new file, just remove it from the array
                images.splice(index, 1)
            } else {
                // This is an existing server image, mark as removed
                images[index] = { ...imageToRemove, removed: true }
            }

            return {
                ...prev,
                gallery: {
                    images: images.filter(img => !img.removed),
                },
            }
        })
    }

    const handleConclusionChange = (content: string) => {
        setFormData((prev) => ({
            ...prev,
            conclusion: {
                content,
            },
        }))
    }

    const clearAllErrors = () => {
        setErrors({})
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

    const uploadAllFiles = async (formData: PastEventFormState): Promise<PastEventFormState> => {
        const updatedData = { ...formData }

        // Upload thumbnail and delete old one if exists
        if (updatedData.thumbnailFile) {
            try {
                // Delete old thumbnail if exists and is different
                if (eventId && event?.thumbnailImage && !updatedData.removedThumbnail) {
                    try {
                        const url = new URL(event.thumbnailImage)
                        const filename = url.pathname.split("/").filter(Boolean).pop()
                        if (filename) {
                            await deleteImage(filename)
                        }
                    } catch (deleteError) {
                        console.warn("Failed to delete old thumbnail:", deleteError)
                    }
                }

                const thumbnailUrl = await uploadImage(updatedData.thumbnailFile)
                updatedData.thumbnailImage = thumbnailUrl
                delete updatedData.thumbnailFile
                delete updatedData.removedThumbnail
            } catch (error) {
                throw new Error("Failed to upload thumbnail image")
            }
        } else if (updatedData.removedThumbnail && eventId && event?.thumbnailImage) {
            // Only removed, delete old thumbnail
            try {
                const url = new URL(event.thumbnailImage)
                const filename = url.pathname.split("/").filter(Boolean).pop()
                if (filename) {
                    await deleteImage(filename)
                }
            } catch (deleteError) {
                console.warn("Failed to delete old thumbnail:", deleteError)
            }
            updatedData.thumbnailImage = undefined
            delete updatedData.removedThumbnail
        }

        // Upload hero background and delete old one if exists
        if (updatedData.hero.heroFile) {
            try {
                // Delete old hero image if exists
                if (eventId && event?.hero?.backgroundImage && !updatedData.hero.removedHero) {
                    try {
                        const url = new URL(event.hero.backgroundImage)
                        const filename = url.pathname.split("/").filter(Boolean).pop()
                        if (filename) {
                            await deleteImage(filename)
                        }
                    } catch (deleteError) {
                        console.warn("Failed to delete old hero image:", deleteError)
                    }
                }

                const heroUrl = await uploadImage(updatedData.hero.heroFile)
                updatedData.hero.backgroundImage = heroUrl
                delete updatedData.hero.heroFile
                delete updatedData.hero.removedHero
            } catch (error) {
                throw new Error("Failed to upload hero background image")
            }
        } else if (updatedData.hero.removedHero && eventId && event?.hero?.backgroundImage) {
            // Only removed, delete old hero image
            try {
                const url = new URL(event.hero.backgroundImage)
                const filename = url.pathname.split("/").filter(Boolean).pop()
                if (filename) {
                    await deleteImage(filename)
                }
            } catch (deleteError) {
                console.warn("Failed to delete old hero image:", deleteError)
            }
            updatedData.hero.backgroundImage = ""
            delete updatedData.hero.removedHero
        }

        // Delete removed feature images first
        for (let i = 0; i < updatedData.featureList.items.length; i++) {
            const item = updatedData.featureList.items[i]
            const removedImages = item.removedImages ?? []

            if (removedImages.length > 0) {
                await Promise.all(
                    removedImages.map(async (url: string) => {
                        try {
                            const urlObj = new URL(url)
                            const filename = urlObj.pathname.split("/").filter(Boolean).pop()
                            if (filename) {
                                await deleteImage(filename)
                            }
                        } catch (deleteError) {
                            console.warn("Failed to delete feature image:", deleteError)
                        }
                    })
                )
                delete item.removedImages
            }
        }

        // Upload feature images
        for (let i = 0; i < updatedData.featureList.items.length; i++) {
            const item = updatedData.featureList.items[i]
            const newImages = item.newImages ?? []

            if (newImages.length > 0) {
                try {
                    const uploadedUrls = await Promise.all(
                        newImages.map((file: File) => uploadImage(file))
                    )

                    // Replace blob URLs with uploaded URLs
                    const currentImages = item.images ?? []
                    const existingImageCount = currentImages.length - newImages.length

                    item.images = currentImages.map((img: string, index: number) => {
                        if (index >= existingImageCount) {
                            const newImageIndex = index - existingImageCount
                            return uploadedUrls[newImageIndex]
                        }
                        return img
                    })

                    delete item.newImages
                } catch (error) {
                    throw new Error(`Failed to upload images for feature #${i + 1}`)
                }
            }
        }

        // Delete removed gallery images
        const removedGalleryImages = updatedData.gallery.images.filter(img => img.removed && !img.newFile)
        if (removedGalleryImages.length > 0) {
            await Promise.all(
                removedGalleryImages.map(async (img) => {
                    try {
                        const urlObj = new URL(img.url)
                        const filename = urlObj.pathname.split("/").filter(Boolean).pop()
                        if (filename) {
                            await deleteImage(filename)
                        }
                    } catch (deleteError) {
                        console.warn("Failed to delete gallery image:", deleteError)
                    }
                })
            )
        }

        // Upload gallery images
        const newGalleryImages = updatedData.gallery.images.filter(img => img.newFile && !img.removed)
        if (newGalleryImages.length > 0) {
            try {
                const uploadedUrls = await Promise.all(
                    newGalleryImages.map(img => uploadImage(img.newFile!))
                )

                let urlIndex = 0
                updatedData.gallery.images = updatedData.gallery.images
                    .filter(img => !img.removed)
                    .map(img => {
                        if (img.newFile) {
                            const newImg = { ...img, url: uploadedUrls[urlIndex++] }
                            delete newImg.newFile
                            return newImg
                        }
                        return img
                    })
            } catch (error) {
                throw new Error("Failed to upload gallery images")
            }
        } else {
            // Just filter out removed images
            updatedData.gallery.images = updatedData.gallery.images.filter(img => !img.removed)
        }

        return updatedData
    }

    const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
        submitEvent.preventDefault()
        setLoading(true)
        clearAllErrors()

        try {
            const sanitizedSlug = sanitizeSlug(formData.slug.trim())
            const newErrors: FormErrors = {}

            // Validate title
            if (!formData.title.trim()) {
                newErrors.title = "Vui lòng nhập tiêu đề"
            }

            // Validate slug
            if (!sanitizedSlug) {
                newErrors.slug = "Vui lòng nhập slug"
            }

            // Validate year
            if (!formData.year || formData.year < 1900 || formData.year > 2100) {
                newErrors.year = "Vui lòng nhập năm hợp lệ"
            }

            // Validate intro content
            if (isRichTextEmpty(formData.intro.content)) {
                newErrors.intro = "Vui lòng nhập nội dung giới thiệu"
            }

            // Validate conclusion content
            if (formData.conclusion && isRichTextEmpty(formData.conclusion.content)) {
                newErrors.conclusion = "Vui lòng nhập nội dung kết luận"
            }

            // Validate features
            const featureErrors: { [key: number]: { title?: string; content?: string } } = {}
            let hasValidFeature = false

            formData.featureList.items.forEach((item, index) => {
                const itemErrors: { title?: string; content?: string } = {}

                if (!item.title.trim()) {
                    itemErrors.title = "Vui lòng nhập tiêu đề hoạt động"
                }

                if (isRichTextEmpty(item.content)) {
                    itemErrors.content = "Vui lòng nhập nội dung hoạt động"
                }

                if (itemErrors.title || itemErrors.content) {
                    featureErrors[index] = itemErrors
                } else {
                    hasValidFeature = true
                }
            })

            if (!hasValidFeature) {
                newErrors.features = featureErrors
            } else if (Object.keys(featureErrors).length > 0) {
                newErrors.features = featureErrors
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors)
                setLoading(false)

                // Scroll to slug error if present
                if (newErrors.slug) {
                    scrollToSlugError()
                }

                return
            }

            if (sanitizedSlug) {
                const slugExists = await checkSlugExists(sanitizedSlug)
                const currentSlug = event?.slug ? sanitizeSlug(event.slug) : ""

                if (slugExists && currentSlug !== sanitizedSlug) {
                    setErrors((prev) => ({ ...prev, slug: "Slug đã tồn tại, vui lòng chọn slug khác." }))
                    setLoading(false)
                    scrollToSlugError()
                    return
                }
            }

            // Upload all files first
            setUploading(true)
            const uploadedData = await uploadAllFiles(formData)

            // Clean the data for API submission
            const payload = sanitizeFormData(uploadedData)
            const res = await adminApiFetch(eventId ? `past-events/${eventId}` : "past-events", {
                method: eventId ? "PUT" : "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!res.ok) {
                const error = await res.json().catch(() => null)
                if (res.status === 409 || error?.error?.toLowerCase?.().includes("slug")) {
                    setErrors((prev) => ({ ...prev, slug: "Slug đã tồn tại, vui lòng chọn slug khác." }))
                    setLoading(false)
                    setUploading(false)
                    scrollToSlugError()
                    return
                }
                throw new Error(error?.error || "Failed to save event")
            }

            alert("Lưu thành công!")
            window.location.href = "/admin/past-events"
        } catch (error) {
            console.error("Error saving event:", error)
            alert("Có lỗi xảy ra khi lưu sự kiện")
        } finally {
            setLoading(false)
            setUploading(false)
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/past-events" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {eventId ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}
                    </h1>
                    <p className="text-gray-600 mt-1">Điền đầy đủ thông tin sự kiện</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin cơ bản</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(event) => {
                                    const { value } = event.target
                                    setFormData((prev) => {
                                        const shouldUpdateSlug = !slugTouched || !prev.slug.trim()
                                        const nextSlug = shouldUpdateSlug ? sanitizeSlug(value) : prev.slug
                                        return { ...prev, title: value, slug: nextSlug }
                                    })
                                    if (errors.title) {
                                        setErrors(prev => ({ ...prev, title: undefined }))
                                    }
                                }}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL) *</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                ref={slugInputRef}
                                onChange={(event) => {
                                    const { value } = event.target
                                    setFormData((prev) => {
                                        // Nếu đang chỉnh sửa slug, cập nhật giá trị mới
                                        // Nếu đang chỉnh sửa tiêu đề, generate slug mới nếu chưa chỉnh sửa slug
                                        const shouldUpdateSlug = !slugTouched || !prev.slug.trim()
                                        const nextSlug = shouldUpdateSlug ? sanitizeSlug(prev.title) : value.toLowerCase()
                                        return { ...prev, slug: nextSlug }
                                    })
                                    setSlugTouched(true)
                                    if (errors.slug) {
                                        setErrors(prev => ({ ...prev, slug: undefined }))
                                    }
                                }}
                                onBlur={(event) => {
                                    // Chỉ áp dụng sanitize khi blur
                                    const sanitized = sanitizeSlug(event.target.value)
                                    setFormData(prev => ({ ...prev, slug: sanitized }))
                                }}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.slug ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="sac-hoi-trang-thu-2025"
                            />
                            {errors.slug && (
                                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Năm *</label>
                            <input
                                type="number"
                                required
                                value={formData.year}
                                onChange={(event) => {
                                    setFormData((prev) => ({ ...prev, year: Number(event.target.value) || 0 }))
                                    if (errors.year) {
                                        setErrors(prev => ({ ...prev, year: undefined }))
                                    }
                                }}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.year ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.year && (
                                <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phụ đề</label>
                            <input
                                type="text"
                                value={formData.subtitle ?? ""}
                                onChange={(event) =>
                                    setFormData((prev) => ({ ...prev, subtitle: event.target.value }))
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Hành trình đưa di sản trở lại..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</label>
                            <textarea
                                value={formData.description ?? ""}
                                onChange={(event) =>
                                    setFormData((prev) => ({ ...prev, description: event.target.value }))
                                }
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus-border-transparent"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Ảnh đại diện</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Ảnh này dùng cho danh sách sự kiện và các vị trí hiển thị dạng thumbnail.
                    </p>
                    <SingleImageUpload
                        value={formData.thumbnailImage}
                        onChange={(value) => {
                            if (value === undefined) {
                                setFormData(prev => ({
                                    ...prev,
                                    thumbnailImage: "",
                                    thumbnailFile: undefined,
                                    removedThumbnail: true
                                }))
                            } else if (value instanceof File) {
                                const previewUrl = URL.createObjectURL(value)
                                setFormData(prev => ({
                                    ...prev,
                                    thumbnailImage: previewUrl,
                                    thumbnailFile: value,
                                    removedThumbnail: false
                                }))
                            } else {
                                setFormData(prev => ({ ...prev, thumbnailImage: value }))
                            }
                        }}
                        label=""
                        placeholder="Click để upload ảnh"
                        size="lg"
                    />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Hero</h2>
                    <p className="text-sm text-gray-500 mb-4">Ảnh nền lớn ở đầu trang chi tiết sự kiện.</p>
                    <SingleImageUpload
                        value={formData.hero.backgroundImage}
                        onChange={(value) => {
                            if (value === undefined) {
                                setFormData(prev => ({
                                    ...prev,
                                    hero: {
                                        ...prev.hero,
                                        backgroundImage: "",
                                        heroFile: undefined,
                                        removedHero: true
                                    }
                                }))
                            } else if (value instanceof File) {
                                const previewUrl = URL.createObjectURL(value)
                                setFormData(prev => ({
                                    ...prev,
                                    hero: {
                                        ...prev.hero,
                                        backgroundImage: previewUrl,
                                        heroFile: value,
                                        removedHero: false
                                    }
                                }))
                            } else {
                                setFormData(prev => ({
                                    ...prev,
                                    hero: {
                                        ...prev.hero,
                                        backgroundImage: value
                                    }
                                }))
                            }
                        }}
                        label=""
                        placeholder="Click để upload ảnh"
                        size="lg"
                    />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Giới thiệu</h2>
                        <select
                            value={formData.intro.align}
                            onChange={(event) => handleIntroAlignChange(event.target.value as PastEvent["intro"]["align"])}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="start">Canh trái</option>
                            <option value="center">Canh giữa</option>
                        </select>
                    </div>
                    <SimpleRichEditor
                        value={formData.intro.content}
                        onChange={(value) => {
                            handleIntroContentChange(value)
                            if (errors.intro) {
                                setErrors(prev => ({ ...prev, intro: undefined }))
                            }
                        }}
                        rows={8}
                        placeholder="<p>Nội dung giới thiệu...</p>"
                    />
                    {errors.intro && (
                        <p className="text-sm text-red-600">{errors.intro}</p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Hoạt động nổi bật</h2>
                        <button
                            type="button"
                            onClick={addFeatureItem}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            <Plus size={18} /> Thêm hoạt động
                        </button>
                    </div>

                    {formData.featureList.items.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-5 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-gray-700">Hoạt động #{index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeFeatureItem(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:text-gray-300 disabled:hover:bg-transparent"
                                    disabled={formData.featureList.items.length === 1}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(event) => {
                                            updateFeatureItem(index, { title: event.target.value })
                                            if (errors.features?.[index]?.title) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    features: {
                                                        ...prev.features,
                                                        [index]: {
                                                            ...prev.features?.[index],
                                                            title: undefined
                                                        }
                                                    }
                                                }))
                                            }
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg ${errors.features?.[index]?.title ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {errors.features?.[index]?.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.features[index].title}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phụ đề</label>
                                    <input
                                        type="text"
                                        value={item.subtitle ?? ""}
                                        onChange={(event) => updateFeatureItem(index, { subtitle: event.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                                <SimpleRichEditor
                                    value={item.content}
                                    onChange={(value) => {
                                        updateFeatureItem(index, { content: value })
                                        if (errors.features?.[index]?.content) {
                                            setErrors(prev => ({
                                                ...prev,
                                                features: {
                                                    ...prev.features,
                                                    [index]: {
                                                        ...prev.features?.[index],
                                                        content: undefined
                                                    }
                                                }
                                            }))
                                        }
                                    }}
                                    rows={6}
                                    placeholder="<p>Mô tả hoạt động...</p>"
                                />
                                {errors.features?.[index]?.content && (
                                    <p className="mt-1 text-sm text-red-600">{errors.features[index].content}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Hình ảnh minh họa (tối đa {FEATURE_IMAGE_LIMIT} ảnh)
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(item.images ?? []).map((imageUrl, imageIndex) => (
                                        <div key={imageIndex} className="relative aspect-square rounded-lg overflow-hidden">
                                            <img
                                                src={imageUrl}
                                                alt={`${item.title || "Hoạt động"} ${imageIndex + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFeatureImage(index, imageIndex)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {(item.images?.length ?? 0) < FEATURE_IMAGE_LIMIT && (
                                        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center">
                                            <Upload size={24} className="text-gray-400 mb-1" />
                                            <span className="text-xs text-gray-500">Thêm ảnh</span>
                                            <span className="text-xs text-gray-500 mt-0.5">JPG, PNG, WebP ≤5MB</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(event) => handleFeatureImageUpload(index, event)}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                        </label>
                                    )}
                                </div>
                                {(item.images?.length ?? 0) >= FEATURE_IMAGE_LIMIT && (
                                    <p className="text-sm text-amber-600 mt-2">
                                        Đã đạt giới hạn {FEATURE_IMAGE_LIMIT} ảnh cho hoạt động này
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Khoảnh khắc</h2>
                            <p className="text-sm text-gray-500">
                                Đã thêm {formData.gallery.images.length}/{GALLERY_IMAGE_LIMIT} ảnh
                            </p>
                        </div>
                        <AddImageButton
                            onAdd={(file) => {
                                const previewUrl = URL.createObjectURL(file)
                                setFormData((prev) => ({
                                    ...prev,
                                    gallery: {
                                        images: [...prev.gallery.images, { url: previewUrl, alt: "", newFile: file }],
                                    },
                                }))
                            }}
                            maxImages={GALLERY_IMAGE_LIMIT}
                            currentCount={formData.gallery.images.length}
                            disabled={uploading}
                            label="Thêm ảnh"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.gallery.images.map((image, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-3">
                                <div className="relative h-40 rounded-md overflow-hidden">
                                    <img
                                        src={image.url}
                                        alt={image.alt || `Khoảnh khắc ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(index)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={image.alt ?? ""}
                                    onChange={(event) => updateGalleryImageAlt(index, event.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="Mô tả ảnh"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Kết luận</h2>
                    <SimpleRichEditor
                        value={formData.conclusion?.content || ""}
                        onChange={(value) => {
                            handleConclusionChange(value)
                            if (errors.conclusion) {
                                setErrors(prev => ({ ...prev, conclusion: undefined }))
                            }
                        }}
                        rows={6}
                        placeholder="<p>Nội dung kết luận...</p>"
                    />
                    {errors.conclusion && (
                        <p className="text-sm text-red-600">{errors.conclusion}</p>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <Link
                        href="/admin/past-events"
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Đang lưu..." : "Lưu sự kiện"}
                    </button>
                </div>
            </form>
        </div>
    )
}
