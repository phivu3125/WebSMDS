# Hướng Dẫn Setup Payload CMS

Hướng dẫn từng bước để setup và test Payload CMS với PostgreSQL.

## Bước 1: Prerequisites

Đảm bảo bạn đã cài đặt:

- Node.js v18+ 
- PostgreSQL v14+
- npm hoặc yarn

## Bước 2: Setup PostgreSQL Database

### Option A: Sử dụng PostgreSQL đã có sẵn

Tạo database mới:

```bash
# Kết nối vào PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE websmds;

# Thoát
\q
```

### Option B: Cài đặt PostgreSQL mới

**Windows:**
1. Download từ https://www.postgresql.org/download/windows/
2. Cài đặt và nhớ password của user `postgres`
3. Tạo database như Option A

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
createdb websmds
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb websmds
```

## Bước 3: Cấu hình Backend

```bash
cd backend

# File .env đã được tạo, cập nhật thông tin PostgreSQL của bạn
# Mở file backend/.env và sửa dòng DATABASE_URI:
# DATABASE_URI=postgresql://your_username:your_password@localhost:5432/websmds

# Ví dụ:
# DATABASE_URI=postgresql://postgres:postgres@localhost:5432/websmds
```

## Bước 4: Chạy Backend Server

```bash
cd backend
npm run dev
```

Output mong đợi:
```
Server running on port 5000
Admin panel: http://localhost:5000/admin
Payload Admin URL: http://localhost:5000/admin
```

## Bước 5: Tạo Admin User

1. Mở trình duyệt và truy cập: `http://localhost:5000/admin`
2. Lần đầu tiên sẽ hiển thị form "Create First User"
3. Điền thông tin:
   - **Email**: admin@example.com (hoặc email bạn muốn)
   - **Password**: Chọn password mạnh (ít nhất 8 ký tự)
   - **Name**: Admin
   - **Role**: Admin
4. Click "Create"

## Bước 6: Tạo Tin Tức Mẫu

1. Sau khi login, click vào **News** trong sidebar
2. Click **Create New**
3. Điền thông tin:
   - **Tiêu đề**: "Khai Mạc Triển Lãm Sắc Màu Di Sản"
   - **Slug**: Sẽ tự động generate (hoặc tự nhập)
   - **Mô tả ngắn**: "Triển lãm quy tụ hơn 200 hiện vật quý giá..."
   - **Danh mục**: Chọn "Sự Kiện"
   - **Ngày đăng**: Chọn ngày hiện tại
   - **Trạng thái**: Chọn "Đã xuất bản" (published)
4. (Optional) Upload hình ảnh:
   - Scroll xuống field "Hình ảnh"
   - Click **Select** hoặc **Upload New**
   - Chọn hình ảnh từ máy tính
5. Click **Save**

Lặp lại để tạo thêm 2-3 tin tức khác.

## Bước 7: Test API

Kiểm tra API hoạt động:

```bash
# Test API lấy danh sách tin tức
curl http://localhost:5000/api/news

# Hoặc mở trình duyệt và truy cập:
# http://localhost:5000/api/news
```

Kết quả mong đợi: JSON array với các tin tức bạn vừa tạo.

## Bước 8: Chạy Frontend

Mở terminal mới:

```bash
cd frontend
npm run dev
```

## Bước 9: Test Toàn Bộ Hệ Thống

1. Mở trình duyệt: `http://localhost:3000`
2. Scroll xuống section "Tin Tức Mới Nhất"
3. Bạn sẽ thấy các tin tức vừa tạo từ admin panel

## Troubleshooting

### Lỗi: "Cannot connect to database"

**Nguyên nhân:** PostgreSQL chưa chạy hoặc thông tin kết nối sai

**Giải pháp:**
1. Kiểm tra PostgreSQL đang chạy:
   ```bash
   # Windows
   services.msc # Tìm "postgresql" service
   
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Kiểm tra thông tin trong `backend/.env`:
   - Username đúng chưa?
   - Password đúng chưa?
   - Database name đúng chưa?
   - Port đúng chưa? (mặc định: 5432)

### Lỗi: "Port 5000 already in use"

**Giải pháp:** Đổi port trong `backend/.env`:
```
PORT=5001
```

Sau đó cập nhật URL trong frontend fetch:
```typescript
// frontend/src/components/home/news-section.tsx
const res = await fetch('http://localhost:5001/api/news', ...)
```

### Frontend không hiển thị tin tức

**Kiểm tra:**

1. Backend đang chạy? (`http://localhost:5000/api/news` có trả về data?)
2. Tin tức có status "published"?
3. Kiểm tra console của trình duyệt có lỗi CORS không?

### CORS Error

Nếu gặp lỗi CORS, đảm bảo:
- `FRONTEND_URL` trong `backend/.env` đúng với URL frontend
- Cả backend và frontend đều đang chạy

## Các Tính Năng Chính

### Admin Panel (`http://localhost:5000/admin`)

- **Dashboard**: Tổng quan hệ thống
- **News**: Quản lý tin tức
  - Tạo, sửa, xóa tin tức
  - Upload hình ảnh
  - Rich text editor
  - Draft/Published status
- **Media**: Quản lý file uploads
  - Auto-generate thumbnails
  - Multiple image sizes
- **Users**: Quản lý admin users
  - Email/password authentication
  - Role-based access (Admin/Editor)

### API Endpoints

- `GET /api/news` - Lấy tất cả tin tức published
- `GET /api/news/:slug` - Lấy chi tiết tin tức theo slug
- `GET /uploads/*` - Serve media files

### Collections

#### News
- title (text, required)
- slug (text, unique, auto-generate)
- excerpt (textarea, required)
- content (richText, optional)
- image (upload, optional)
- category (select: Sự Kiện, Hoạt Động, Đối Tác)
- date (date, required)
- status (draft/published)

## Next Steps

Sau khi setup thành công:

1. **Thêm nhiều collections hơn**: Events, Products, Partners
2. **Tùy chỉnh admin UI**: Thay đổi logo, colors
3. **Setup authentication cho frontend**: Cho phép users bình thường login
4. **Deploy**: Chuẩn bị deploy lên production

## Liên Hệ

Nếu gặp vấn đề, kiểm tra:
- Backend logs trong terminal
- Browser console trong DevTools
- PostgreSQL logs

Happy coding! 🚀

