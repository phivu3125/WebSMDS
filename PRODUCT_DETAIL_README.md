# Trang Chi Tiết Sản Phẩm

## Tổng quan
Trang chi tiết sản phẩm với form đặt hàng cho phép khách hàng:
- Xem thông tin chi tiết sản phẩm
- Chọn số lượng mua
- Điền thông tin liên hệ để đặt hàng

## Cấu trúc Files

### 1. Types (`frontend/src/types/index.ts`)
Định nghĩa các interface:
- `Product`: Thông tin sản phẩm
- `OrderFormData`: Dữ liệu form đặt hàng
- `NewsletterSubscription`: Đăng ký nhận tin

### 2. Trang Chi Tiết Sản Phẩm (`frontend/src/app/products/[id]/page.tsx`)
Trang chi tiết với các tính năng:
- **Hiển thị thông tin sản phẩm**: Hình ảnh, tên, giá, mô tả chi tiết
- **Gallery hình ảnh**: Multiple images với thumbnail selector
- **Chọn số lượng**: Tăng/giảm số lượng với nút +/-
- **Form đặt hàng**: Modal popup với thông tin liên hệ
- **Validation**: Kiểm tra thông tin đầu vào
- **Responsive**: Hoạt động tốt trên mọi thiết bị

### 3. Trang Danh Sách Sản Phẩm (`frontend/src/app/products/page.tsx`)
- Đã cập nhật để có link đến trang chi tiết
- Click vào card sản phẩm để xem chi tiết

### 4. Products Section (`frontend/src/components/home/products-section.tsx`)
- Component trong trang chủ
- Link đến trang chi tiết khi click vào sản phẩm

## Tính năng chính

### 1. Xem Chi Tiết Sản Phẩm
```typescript
// URL: /products/[id]
// Ví dụ: /products/1 (Áo Dài Truyền Thống)
```

### 2. Chọn Số Lượng
- Tăng/giảm bằng nút +/-
- Nhập trực tiếp vào ô input
- Giới hạn: 1-99 sản phẩm
- Tự động tính tổng tiền

### 3. Form Đặt Hàng
Các trường thông tin:
- **Họ và tên** (bắt buộc)
- **Số điện thoại** (bắt buộc, format: 10-11 số)
- **Email** (bắt buộc, format email hợp lệ)
- **Địa chỉ nhận hàng** (bắt buộc)
- **Ghi chú** (tùy chọn)

### 4. Validation
- Kiểm tra các trường bắt buộc
- Validate format email
- Validate format số điện thoại (10-11 chữ số)
- Hiển thị thông báo lỗi khi cần

### 5. UI/UX
- **Animation**: Smooth transitions với Framer Motion
- **Hover Effects**: Interactive hover states
- **Loading States**: Hiển thị loading khi submit
- **Success Message**: Thông báo thành công sau khi đặt hàng
- **Responsive Design**: Tối ưu cho mobile, tablet, desktop

## Mock Data

Data sản phẩm mẫu bao gồm:
1. Áo Dài Truyền Thống - 2.500.000đ
2. Tranh Sơn Mài - 5.000.000đ
3. Gốm Sứ Bát Tràng - 1.200.000đ
4. Nón Lá Thủ Công - 350.000đ
5. Túi Thổ Cẩm - 450.000đ (Hết hàng)

## Cách sử dụng

### Xem chi tiết sản phẩm:
1. Từ trang chủ hoặc trang sản phẩm
2. Click vào sản phẩm bất kỳ
3. Sẽ chuyển đến `/products/[id]`

### Đặt hàng:
1. Chọn số lượng mong muốn
2. Click "ĐẶT HÀNG NGAY"
3. Điền đầy đủ thông tin
4. Click "Xác nhận đặt hàng"
5. Nhận thông báo thành công

## Tích hợp Backend (Tương lai)

### API Endpoints cần implement:
```typescript
// GET /api/products/:id - Lấy thông tin chi tiết sản phẩm
// POST /api/orders - Tạo đơn hàng mới

interface OrderRequest {
  productId: number
  productName: string
  quantity: number
  fullName: string
  email: string
  phone: string
  address: string
  notes?: string
}

interface OrderResponse {
  success: boolean
  orderId?: string
  message: string
}
```

### Cập nhật code để gọi API:
```typescript
// Trong handleSubmitOrder:
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
const result = await response.json()
```

## Màu sắc & Branding
- **Primary Gold**: #D4AF37
- **Primary Purple**: #B668A1
- **Deep Purple**: #5b21b6
- **Success Green**: text-green-600
- **Error Red**: text-red-500

## Dependencies
- `framer-motion`: Animations
- `lucide-react`: Icons
- `next/image`: Optimized images
- `next/link`: Client-side routing

## Testing

### Test Cases:
1. ✅ Hiển thị đúng thông tin sản phẩm
2. ✅ Tăng/giảm số lượng hoạt động
3. ✅ Tính tổng tiền chính xác
4. ✅ Validate form đúng
5. ✅ Submit form thành công
6. ✅ Hiển thị loading state
7. ✅ Hiển thị success message
8. ✅ Reset form sau khi submit
9. ✅ Responsive trên các thiết bị
10. ✅ Handle sản phẩm hết hàng

## Notes
- Mock data hiện tại nằm trong component
- Cần di chuyển sang API khi backend sẵn sàng
- Form hiện tại chỉ log console, cần tích hợp API thực
- Images sử dụng placeholder, cần thay bằng hình thật
