"use client"

import { useEffect, useState } from "react"
import { ShoppingCart, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  totalAmount: number
  status: string
  createdAt: string
  orderItems: {
    id: string
    quantity: number
    price: number
    product: {
      name: string
    }
  }[]
}

const statusConfig = {
  pending: { label: "Chờ xử lý", icon: Clock, color: "text-yellow-600 bg-yellow-50" },
  confirmed: { label: "Đã xác nhận", icon: CheckCircle, color: "text-blue-600 bg-blue-50" },
  shipping: { label: "Đang giao", icon: Truck, color: "text-purple-600 bg-purple-50" },
  completed: { label: "Hoàn thành", icon: CheckCircle, color: "text-green-600 bg-green-50" },
  cancelled: { label: "Đã hủy", icon: XCircle, color: "text-red-600 bg-red-50" },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      // TODO: Implement API call
      // const data = await adminApi.getOrders()
      // setOrders(data)
      setOrders([])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
        </div>
        <p className="text-gray-600">Theo dõi và quản lý các đơn hàng từ khách hàng</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đơn hàng</h3>
          <p className="text-gray-600">Các đơn hàng từ khách hàng sẽ hiển thị ở đây</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
            const StatusIcon = statusInfo.icon

            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{statusInfo.label}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Khách hàng</p>
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.customerEmail}</p>
                    <p className="text-sm text-gray-600">{order.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tổng tiền</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Sản phẩm</p>
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product.name} x {item.quantity}
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
