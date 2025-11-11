"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, DollarSign, Package, CheckCircle, XCircle, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Product } from "@/types"
import { products as mockProducts } from "@/mock/products"
import { categories } from "@/mock/categories"
import { orders } from "@/mock/order-forms"
import { uploadImage } from "@/lib/api/admin/uploads"
import { SingleImageUpload } from "@/components/admin/reusable-image-upload"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [brandModalOpen, setBrandModalOpen] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  // Form states
  const [brandForm, setBrandForm] = useState({
    name: "",
    description: "",
    logo: "",
    logoFile: undefined as File | undefined,
    website: ""
  })

  const [categoryForm, setCategoryForm] = useState({
    name: ""
  })

  const [savingBrand, setSavingBrand] = useState(false)
  const [savingCategory, setSavingCategory] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setProducts(mockProducts)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    // For mock data, just show alert that delete is not available
    alert("Tính năng xóa chưa được implement cho mock data")
  }

  const getAvailableStock = (productId: number) => {
    const product = mockProducts.find(p => p.id === productId)
    if (!product) return 0

    // TODO: This logic should be moved to backend API
    // Backend should calculate available stock based on completed orders
    // Frontend should just display the availableStock field from API response
    const completedOrdersQuantity = orders
      .filter(order => order.productId === productId && order.status === 'completed')
      .reduce((total, order) => total + order.quantity, 0)

    return Math.max(0, product.stock - completedOrdersQuantity)
  }

  const getSoldQuantity = (productId: number) => {
    // Calculate total quantity sold from completed orders
    return orders
      .filter(order => order.productId === productId && order.status === 'completed')
      .reduce((total, order) => total + order.quantity, 0)
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ'
  }

  const handleCreateBrand = async () => {
    if (!brandForm.name.trim()) return

    setSavingBrand(true)
    try {
      // Upload logo if exists
      if (brandForm.logoFile) {
        const logoUrl = await uploadImage(brandForm.logoFile)
        brandForm.logo = logoUrl
        delete brandForm.logoFile
      }

      // TODO: Implement API call to create brand
      // await adminApi.createBrand(brandForm)

      // For mock data, just show success
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert("Tạo thương hiệu thành công!")

      // Reset form and close modal
      setBrandForm({ name: "", description: "", logo: "", logoFile: undefined, website: "" })
      setBrandModalOpen(false)
    } catch (error) {
      console.error("Failed to create brand:", error)
      alert("Có lỗi xảy ra khi tạo thương hiệu")
    } finally {
      setSavingBrand(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) return

    setSavingCategory(true)
    try {
      // TODO: Implement API call to create category
      // await adminApi.createCategory(categoryForm)

      // For mock data, just show success
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert("Tạo danh mục thành công!")

      // Reset form and close modal
      setCategoryForm({ name: "" })
      setCategoryModalOpen(false)
    } catch (error) {
      console.error("Failed to create category:", error)
      alert("Có lỗi xảy ra khi tạo danh mục")
    } finally {
      setSavingCategory(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Sản Phẩm</h1>
          <p className="text-gray-600 mt-2">Quản lý sản phẩm và danh mục</p>
        </div>
        <Link href="/admin/products/create">
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Thêm sản phẩm
          </Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-900">Quản lý danh mục và thương hiệu</h3>
            <p className="text-sm text-blue-700 mt-1">
              Tạo danh mục hoặc thương hiệu mới nếu chưa có trong danh sách
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Tạo danh mục
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Tạo danh mục mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category-name">Tên danh mục *</Label>
                    <Input
                      id="category-name"
                      className="mt-2"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="Nhập tên danh mục"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCategoryModalOpen(false)}>
                      Hủy
                    </Button>
                    <Button onClick={handleCreateCategory} disabled={savingCategory || !categoryForm.name.trim()}>
                      {savingCategory ? "Đang tạo..." : "Tạo danh mục"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={brandModalOpen} onOpenChange={setBrandModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Tạo thương hiệu
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Tạo thương hiệu mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="brand-name">Tên thương hiệu *</Label>
                    <Input
                      id="brand-name"
                      className="mt-2"
                      value={brandForm.name}
                      onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                      placeholder="Nhập tên thương hiệu"
                    />
                  </div>
                  <div>
                    <Label>Logo</Label>
                    <div className="mt-2">
                      <SingleImageUpload
                        value={brandForm.logoFile ? brandForm.logoFile : brandForm.logo || undefined}
                        onChange={(value) => {
                          if (value instanceof File) {
                            const previewUrl = URL.createObjectURL(value)
                            setBrandForm({ ...brandForm, logo: previewUrl, logoFile: value })
                          } else if (value === undefined) {
                            setBrandForm({ ...brandForm, logo: "", logoFile: undefined })
                          } else {
                            setBrandForm({ ...brandForm, logo: value })
                          }
                        }}
                        label=""
                        placeholder="Chọn logo thương hiệu"
                        size="md"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setBrandModalOpen(false)}>
                      Hủy
                    </Button>
                    <Button onClick={handleCreateBrand} disabled={savingBrand || !brandForm.name.trim()}>
                      {savingBrand ? "Đang tạo..." : "Tạo thương hiệu"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((product) => {
          const category = categories.find(c => c.id === product.categoryId)
          return (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      {category && (
                        <Badge variant="outline" className="text-xs">
                          {category.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant={getAvailableStock(product.id) > 0 ? "default" : "destructive"}>
                      {getAvailableStock(product.id) > 0 ? "Còn hàng" : "Hết hàng"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-gray-900">
                          {formatPrice(product.priceNum)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>Tồn kho: <span className="font-semibold">{getAvailableStock(product.id)}</span></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Đã bán: <span className="font-semibold">{getSoldQuantity(product.id)}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Sửa
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteProduct(product.id.toString())}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        
        {products.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Chưa có sản phẩm nào</p>
              <Link href="/admin/products/create" className="mt-4 inline-block">
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm sản phẩm đầu tiên
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
