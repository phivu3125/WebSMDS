"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Upload, X } from "lucide-react"
import Link from "next/link"
import { products as mockProducts } from "@/mock/products"
import { categories } from "@/mock/categories"
import { brands } from "@/mock/brands"
import { uploadImage, deleteImage } from "@/lib/api/admin/uploads"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    details: "",
    priceNum: 0,
    categoryId: 0,
    brandId: 0,
    image: "",
    imageFile: undefined as File | undefined,
    removedImage: false,
    featured: false,
    inStock: true,
    stock: 0,
    specifications: [{ label: "", value: "" }],
    images: [""],
    newImages: [] as File[],
    removedImages: [] as string[]
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const product = mockProducts.find(p => p.id === parseInt(productId))
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        details: product.details || "",
        priceNum: product.priceNum,
        categoryId: product.categoryId,
        brandId: product.brandId || 0,
        image: product.image,
        imageFile: undefined,
        removedImage: false,
        featured: product.featured,
        inStock: product.inStock,
        stock: product.stock,
        specifications: product.specifications || [{ label: "", value: "" }],
        images: product.images || [""],
        newImages: [],
        removedImages: []
      })
    }
    setLoading(false)
  }, [productId])

  // Cleanup function to revoke blob URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup main image
      if (formData.image?.startsWith('blob:')) {
        URL.revokeObjectURL(formData.image)
      }

      // Cleanup additional images
      formData.images.forEach((img: string) => {
        if (img?.startsWith('blob:')) {
          URL.revokeObjectURL(img)
        }
      })
    }
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setUploading(true)

    try {
      // Upload main image and delete old one if exists
      if (formData.imageFile) {
        try {
          const product = mockProducts.find(p => p.id === parseInt(productId))
          // Delete old main image if exists and is different
          if (product?.image && !formData.removedImage) {
            try {
              const url = new URL(product.image)
              const filename = url.pathname.split("/").filter(Boolean).pop()
              if (filename) {
                await deleteImage(filename)
              }
            } catch (deleteError) {
              console.warn("Failed to delete old main image:", deleteError)
            }
          }

          const imageUrl = await uploadImage(formData.imageFile)
          formData.image = imageUrl
          delete (formData as any).imageFile
          delete (formData as any).removedImage
        } catch (error) {
          throw new Error("Failed to upload main image")
        }
      } else if (formData.removedImage) {
        // Only removed, delete old main image
        const product = mockProducts.find(p => p.id === parseInt(productId))
        if (product?.image) {
          try {
            const url = new URL(product.image)
            const filename = url.pathname.split("/").filter(Boolean).pop()
            if (filename) {
              await deleteImage(filename)
            }
          } catch (deleteError) {
            console.warn("Failed to delete old main image:", deleteError)
          }
        }
        formData.image = ""
        delete (formData as any).removedImage
      }

      // Delete removed additional images
      if (formData.removedImages.length > 0) {
        await Promise.all(
          formData.removedImages.map(async (url) => {
            try {
              const urlObj = new URL(url)
              const filename = urlObj.pathname.split("/").filter(Boolean).pop()
              if (filename) {
                await deleteImage(filename)
              }
            } catch (deleteError) {
              console.warn("Failed to delete additional image:", deleteError)
            }
          })
        )
        delete (formData as any).removedImages
      }

      // Upload new additional images
      if (formData.newImages.length > 0) {
        try {
          const uploadedUrls = await Promise.all(
            formData.newImages.map(file => uploadImage(file))
          )

          // Replace blob URLs with uploaded URLs
          const currentImages = formData.images
          const existingImageCount = currentImages.length - formData.newImages.length

          formData.images = currentImages.map((img: string, index: number) => {
            if (index >= existingImageCount) {
              const newImageIndex = index - existingImageCount
              return uploadedUrls[newImageIndex]
            }
            return img
          })

          delete (formData as any).newImages
        } catch (error) {
          throw new Error("Failed to upload additional images")
        }
      }

      // TODO: Implement API call to update product
      // await adminApi.updateProduct(productId, formData)

      // For mock data, just show success
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert("Cập nhật sản phẩm thành công!")
      router.push("/admin/products")
    } catch (error) {
      console.error("Failed to update product:", error)
      alert("Có lỗi xảy ra khi cập nhật sản phẩm")
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      image: previewUrl,
      imageFile: file,
      removedImage: false
    }))
    event.target.value = ""
  }

  const handleRemoveMainImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
      imageFile: undefined,
      removedImage: true
    }))
  }

  const handleAdditionalImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      images: [...prev.images, previewUrl],
      newImages: [...prev.newImages, file]
    }))
    event.target.value = ""
  }

  const handleRemoveAdditionalImage = (index: number) => {
    setFormData((prev) => {
      const imageToRemove = prev.images[index]

      // Check if this is a new file or existing server image
      const newImages = prev.newImages
      const existingImageCount = prev.images.length - newImages.length

      if (index >= existingImageCount) {
        // This is a new file, remove from newImages array
        const newImageIndex = index - existingImageCount
        newImages.splice(newImageIndex, 1)
      } else {
        // This is an existing server image, add to removedImages
        const removedImages = prev.removedImages || []
        removedImages.push(imageToRemove)
        prev.removedImages = removedImages
      }

      const nextImages = prev.images.filter((_: string, idx: number) => idx !== index)
      return {
        ...prev,
        images: nextImages,
        newImages,
      }
    })
  }

  const handleSpecificationChange = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecs = [...formData.specifications]
    newSpecs[index][field] = value
    setFormData({ ...formData, specifications: newSpecs })
  }

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { label: "", value: "" }]
    })
  }

  const removeSpecification = (index: number) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index)
    setFormData({ ...formData, specifications: newSpecs })
  }

  if (loading) {
    return <div className="p-6">Đang tải...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
            <p className="text-gray-600 mt-2">Cập nhật thông tin sản phẩm</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Tên sản phẩm *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Mô tả ngắn *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="details">Chi tiết sản phẩm</Label>
                <Textarea
                  id="details"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priceNum">Giá (VNĐ) *</Label>
                  <Input
                    id="priceNum"
                    type="number"
                    value={formData.priceNum}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, priceNum: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Tồn kho *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Danh mục *</Label>
                  <Select
                    value={formData.categoryId.toString()}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="brand">Thương hiệu</Label>
                  <Select
                    value={formData.brandId.toString()}
                    onValueChange={(value) => setFormData({ ...formData, brandId: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thương hiệu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Không có</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked: boolean | "indeterminate") => setFormData({ ...formData, featured: !!checked })}
                  />
                  <Label htmlFor="featured">Sản phẩm nổi bật</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked: boolean | "indeterminate") => setFormData({ ...formData, inStock: !!checked })}
                  />
                  <Label htmlFor="inStock">Còn hàng</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image">Hình ảnh chính *</Label>
                <div className="mt-2">
                  {formData.image ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.image}
                        alt="Main product image"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={handleRemoveMainImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageUpload}
                          className="hidden"
                          id="main-image-upload"
                        />
                        <Label htmlFor="main-image-upload" className="cursor-pointer">
                          <span className="text-sm text-gray-600">Chọn hình ảnh</span>
                          <span className="text-xs text-gray-500 block">JPG, PNG, WebP ≤5MB</span>
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Hình ảnh bổ sung</Label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    image && (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => handleRemoveAdditionalImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )
                  ))}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAdditionalImageUpload}
                      className="hidden"
                      id="additional-image-upload"
                    />
                    <Label htmlFor="additional-image-upload" className="cursor-pointer flex flex-col items-center">
                      <Plus className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Thêm ảnh</span>
                      <span className="text-xs text-gray-400">JPG, PNG, WebP ≤5MB</span>
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Thông số kỹ thuật</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Tên thông số"
                  value={spec.label}
                  onChange={(e) => handleSpecificationChange(index, 'label', e.target.value)}
                />
                <Input
                  placeholder="Giá trị"
                  value={spec.value}
                  onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                />
                {formData.specifications.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSpecification(index)}
                  >
                    Xóa
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSpecification}
            >
              <Plus className="h-4 w-4 mr-1" />
              Thêm thông số
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </Link>
          <Button type="submit" disabled={saving || uploading}>
            <Save className="h-4 w-4 mr-1" />
            {uploading ? "Đang upload..." : saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  )
}
