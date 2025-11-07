"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, DollarSign, Package, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { adminApi } from "@/lib/api"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  inStock: boolean
  status: string
  category?: {
    name: string
  }
  createdAt: string
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await adminApi.getAllProducts()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await adminApi.deleteProduct(id)
        fetchProducts()
      } catch (error) {
        console.error("Failed to delete product:", error)
      }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
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

      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    {product.category && (
                      <Badge variant="outline" className="text-xs">
                        {product.category.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant={product.status === "published" ? "default" : "secondary"}>
                    {product.status === "published" ? "Đã xuất bản" : "Nháp"}
                  </Badge>
                  <Badge variant={product.inStock ? "default" : "destructive"}>
                    {product.inStock ? "Còn hàng" : "Hết hàng"}
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
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>Slug: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{product.slug}</code></span>
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
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
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
