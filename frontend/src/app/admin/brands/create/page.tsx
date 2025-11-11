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

export default function CreateBrandPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    logoFile: undefined as File | undefined,
    website: ""
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create preview URL for display
    const previewUrl = URL.createObjectURL(file)
    setFormData((prev) => ({
      ...prev,
      logo: previewUrl,
      logoFile: file
    }))
    event.target.value = ""
  }

  const handleRemoveLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logo: "",
      logoFile: undefined
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setSaving(true)
    setUploading(true)

    try {
      // Upload logo if exists
      if (formData.logoFile) {
        const logoUrl = await uploadImage(formData.logoFile)
        formData.logo = logoUrl
        delete formData.logoFile
      }

      // TODO: Implement API call to create brand
      // await adminApi.createBrand(formData)

      // For mock data, just show success
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert("Tạo thương hiệu thành công!")
      router.push("/admin/brands")
    } catch (error) {
      console.error("Failed to create brand:", error)
      alert("Có lỗi xảy ra khi tạo thương hiệu")
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/brands">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thêm thương hiệu mới</h1>
            <p className="text-gray-600 mt-2">Tạo thương hiệu sản phẩm</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin thương hiệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Tên thương hiệu *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
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
              <Label>Logo</Label>
              <div className="mt-2">
                {formData.logo ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.logo}
                      alt="Brand logo"
                      className="w-32 h-32 object-contain rounded-lg border bg-white"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={handleRemoveLogo}
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
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="brand-logo-upload"
                      />
                      <Label htmlFor="brand-logo-upload" className="cursor-pointer">
                        <span className="text-sm text-gray-600">Chọn logo</span>
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/admin/brands">
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </Link>
              <Button type="submit" disabled={saving || uploading}>
                <Save className="h-4 w-4 mr-1" />
                {uploading ? "Đang upload..." : saving ? "Đang lưu..." : "Tạo thương hiệu"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
