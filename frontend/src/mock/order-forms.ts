import { Order } from '@/types';

export const orders: Order[] = [
  {
    id: "order-001",
    orderNumber: "DH20241109001",
    productId: 1,
    quantity: 2,
    fullName: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    notes: "Giao hàng buổi sáng",
    status: "pending",
    createdAt: "2024-11-09T10:30:00Z"
  },
  {
    id: "order-002",
    orderNumber: "DH20241109002",
    productId: 3,
    quantity: 1,
    fullName: "Trần Thị Bình",
    email: "tranthibinh@email.com",
    phone: "0987654321",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    notes: "Quà tặng sinh nhật",
    status: "confirmed",
    createdAt: "2024-11-08T14:20:00Z"
  },
  {
    id: "order-003",
    orderNumber: "DH20241109003",
    productId: 8,
    quantity: 3,
    fullName: "Lê Văn Cường",
    email: "levancuong@email.com",
    phone: "0912345678",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    status: "shipping",
    createdAt: "2024-11-07T09:15:00Z"
  },
  {
    id: "order-004",
    orderNumber: "DH20241109004",
    productId: 12,
    quantity: 5,
    fullName: "Phạm Thị Dung",
    email: "phamthidung@email.com",
    phone: "0976543210",
    address: "321 Đường GHI, Quận 4, TP.HCM",
    notes: "Giao hàng nhanh nhất có thể",
    status: "completed",
    createdAt: "2024-11-06T16:45:00Z"
  },
  {
    id: "order-005",
    orderNumber: "DH20241109005",
    productId: 4,
    quantity: 1,
    fullName: "Hoàng Văn Em",
    email: "hoangvanem@email.com",
    phone: "0932165498",
    address: "654 Đường JKL, Quận 5, TP.HCM",
    status: "cancelled",
    createdAt: "2024-11-05T11:30:00Z"
  }
];
