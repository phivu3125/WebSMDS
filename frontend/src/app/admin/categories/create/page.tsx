"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import Link from "next/link"
import { uploadImage } from "@/lib/api/admin/uploads"

export default function CreateCategoryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    imageFile: undefined as File | undefined,
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    })
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create preview URL for display
    const previewUrl = URL.createObjectURL(file)
    setFormData((prev) => ({
      ...prev,
      image: previewUrl,
      imageFile: file
    }))
    event.target.value = ""
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
      imageFile: undefined
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setSaving(true)
    setUploading(true)

    try {
      // Upload image if exists
      if (formData.imageFile) {
        const imageUrl = await uploadImage(formData.imageFile)
        formData.image = imageUrl
        delete formData.imageFile
      }

      // TODO: Implement API call to create category
      // await adminApi.createCategory(formData)

      // For mock data, just show success
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert("Tạo danh mục thành công!")
      router.push("/admin/categories")
    } catch (error) {
      console.error("Failed to create category:", error)
      alert("Có lỗi xảy ra khi tạo danh mục")
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/categories">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thêm danh mục mới</h1>
            <p className="text-gray-600 mt-2">Tạo danh mục sản phẩm</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin danh mục</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Tên danh mục *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="slug-tu-dong"
              />
              <p className="text-sm text-gray-500 mt-1">
                Slug được tạo tự động từ tên danh mục
              </p>
            </div>

            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label>Hình ảnh</Label>
              <div className="mt-2">
                {formData.image ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.image}
                      alt="Category image"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="category-image-upload"
                      />
                      <Label htmlFor="category-image-upload" className="cursor-pointer">
                        <span className="text-sm text-gray-600">Chọn hình ảnh</span>
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/admin/categories">
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </Link>
              <Button type="submit" disabled={saving || uploading}>
                <Save className="h-4 w-4 mr-1" />
                {uploading ? "Đang upload..." : saving ? "Đang lưu..." : "Tạo danh mục"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
