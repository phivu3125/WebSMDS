"use client"

import { useEffect, useState, useMemo } from "react"
import { ShoppingCart, Package, Truck, CheckCircle, XCircle, Clock, Download } from "lucide-react"
import { Order } from "@/types"
import { orders } from "@/mock/order-forms"
import { products } from "@/mock/products"

const statusConfig = {
  pending: { label: "Chờ xử lý", icon: Clock, color: "text-yellow-600 bg-yellow-50" },
  confirmed: { label: "Đã xác nhận", icon: CheckCircle, color: "text-blue-600 bg-blue-50" },
  shipping: { label: "Đang giao", icon: Truck, color: "text-purple-600 bg-purple-50" },
  completed: { label: "Hoàn thành", icon: CheckCircle, color: "text-green-600 bg-green-50" },
  cancelled: { label: "Đã hủy", icon: XCircle, color: "text-red-600 bg-red-50" },
}

export default function OrdersPage() {
  const [ordersData, setOrdersData] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      // TODO: Implement API call
      // const data = await adminApi.getOrders()
      // setOrdersData(data)
      setOrdersData(orders)
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

  const exportToCSV = () => {
    if (!filteredAndSortedOrders.length) return

    const headers = [
      "Mã đơn hàng",
      "Ngày tạo",
      "Trạng thái",
      "Tên khách hàng",
      "Email",
      "Số điện thoại",
      "Địa chỉ",
      "Sản phẩm",
      "Số lượng",
      "Đơn giá",
      "Tổng tiền",
      "Ghi chú",
    ]

    const rows = filteredAndSortedOrders.map((order) => {
      const product = products.find(p => p.id === order.productId)
      const totalAmount = product ? product.priceNum * order.quantity : 0
      const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending

      return [
        order.orderNumber,
        formatDate(order.createdAt),
        statusInfo.label,
        order.fullName,
        order.email,
        `\u200B${order.phone}`, // Add zero-width space to preserve leading zero
        order.address,
        product?.name || 'Sản phẩm không xác định',
        order.quantity,
        product?.priceNum || 0,
        totalAmount,
        order.notes || '',
      ]
    })

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n")

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    const currentDate = new Date().toISOString().split('T')[0]
    const statusText = statusFilter === "all" ? "tat-ca" : statusFilter
    link.download = `don-hang-${statusText}-${currentDate}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingStatusId(orderId)
      // TODO: Implement API call to update order status
      // await adminApi.updateOrderStatus(orderId, newStatus)

      // For now, update local state
      setOrdersData(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
    } catch (err) {
      console.error('Failed to update order status:', err)
      setError('Không thể cập nhật trạng thái đơn hàng')
    } finally {
      setUpdatingStatusId(null)
    }
  }

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = ordersData

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Sort by date
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortBy === "newest" ? dateB - dateA : dateA - dateB
    })

    return filtered
  }, [ordersData, statusFilter, sortBy])

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

      {/* Filters and Sort Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Lọc theo trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ xử lý</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipping">Đang giao</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>
          </div>

          <button
            onClick={exportToCSV}
            disabled={filteredAndSortedOrders.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-4 w-4" />
            Xuất CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {filteredAndSortedOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {ordersData.length === 0 ? "Chưa có đơn hàng" : "Không tìm thấy đơn hàng nào"}
          </h3>
          <p className="text-gray-600">
            {ordersData.length === 0
              ? "Các đơn hàng từ khách hàng sẽ hiển thị ở đây"
              : "Thử thay đổi bộ lọc để xem thêm đơn hàng"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedOrders.map((order) => {
            const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
            const StatusIcon = statusInfo.icon
            const product = products.find(p => p.id === order.productId)
            const totalAmount = product ? product.priceNum * order.quantity : 0

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
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      disabled={updatingStatusId === order.id}
                      className="bg-transparent border-none text-sm font-medium focus:outline-none disabled:bg-transparent"
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="shipping">Đang giao</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                    {updatingStatusId === order.id && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Khách hàng</p>
                    <p className="font-medium text-gray-900">{order.fullName}</p>
                    <p className="text-sm text-gray-600">{order.email}</p>
                    <p className="text-sm text-gray-600">{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tổng tiền</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Sản phẩm</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {product?.name || 'Sản phẩm không xác định'} x {order.quantity}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                  {order.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Ghi chú:</span> {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
