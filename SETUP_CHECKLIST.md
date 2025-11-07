# Setup Checklist

Checklist để đảm bảo setup thành công Payload CMS.

## ☑️ Prerequisites

- [ ] Node.js v18+ đã cài đặt
  ```bash
  node --version  # Kiểm tra version
  ```

- [ ] PostgreSQL v14+ đã cài đặt
  ```bash
  psql --version  # Kiểm tra version
  ```

- [ ] Git đã cài đặt (optional, để clone repo)

## ☑️ Database Setup

- [ ] PostgreSQL service đang chạy
  ```bash
  # Windows: Check services.msc
  # macOS: brew services list
  # Linux: sudo systemctl status postgresql
  ```

- [ ] Database `websmds` đã được tạo
  ```bash
  psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='websmds';"
  # Nếu chưa có: createdb websmds
  ```

- [ ] Test connection
  ```bash
  psql -U postgres -d websmds -c "SELECT version();"
  ```

## ☑️ Backend Setup

- [ ] Navigate to backend directory
  ```bash
  cd backend
  ```

- [ ] Dependencies đã cài đặt
  ```bash
  npm install
  ```

- [ ] File `.env` đã tạo và cấu hình đúng
  ```bash
  # Check file exists
  ls -la .env  # hoặc dir .env trên Windows
  
  # Verify content
  cat .env     # hoặc type .env trên Windows
  ```

- [ ] Environment variables đúng:
  - [ ] `DATABASE_URI` - Format: `postgresql://username:password@localhost:5432/websmds`
  - [ ] `PAYLOAD_SECRET` - Bất kỳ string ngẫu nhiên nào
  - [ ] `PORT` - Default: 5000
  - [ ] `FRONTEND_URL` - Default: http://localhost:3000

- [ ] Backend server chạy thành công
  ```bash
  npm run dev
  ```
  
  Expect output:
  ```
  Server running on port 5000
  Admin panel: http://localhost:5000/admin
  ```

- [ ] Test backend health
  ```bash
  # Trong terminal mới
  curl http://localhost:5000/api/hello
  ```
  
  Expect: `{"message":"Hello from Node.js backend with Payload CMS!"}`

## ☑️ Frontend Setup

- [ ] Navigate to frontend directory (terminal mới)
  ```bash
  cd frontend
  ```

- [ ] Dependencies đã cài đặt
  ```bash
  npm install
  ```

- [ ] File `.env.local` đã tạo
  ```bash
  ls -la .env.local  # hoặc dir .env.local trên Windows
  ```

- [ ] Environment variable đúng:
  - [ ] `NEXT_PUBLIC_API_URL=http://localhost:5000`

- [ ] Frontend server chạy thành công
  ```bash
  npm run dev
  ```
  
  Expect output:
  ```
  ▲ Next.js ...
  - Local:        http://localhost:3000
  ```

## ☑️ Admin Panel Setup

- [ ] Truy cập admin panel: http://localhost:5000/admin

- [ ] Trang "Create First User" hiển thị

- [ ] Tạo admin user thành công với:
  - [ ] Email (valid format)
  - [ ] Password (ít nhất 8 ký tự)
  - [ ] Name
  - [ ] Role: Admin

- [ ] Login thành công vào admin panel

- [ ] Dashboard hiển thị các collections:
  - [ ] News
  - [ ] Media
  - [ ] Users

## ☑️ Content Creation

- [ ] Navigate to **News** collection

- [ ] Click **Create New**

- [ ] Create tin tức mẫu #1:
  - [ ] Tiêu đề: "Khai Mạc Triển Lãm Sắc Màu Di Sản"
  - [ ] Slug: Auto-generated hoặc custom
  - [ ] Mô tả ngắn: Nhập text
  - [ ] Danh mục: "Sự Kiện"
  - [ ] Ngày đăng: Hôm nay
  - [ ] Trạng thái: **Đã xuất bản**
  - [ ] (Optional) Upload hình ảnh
  - [ ] Click **Save**

- [ ] Create tin tức mẫu #2:
  - [ ] Tiêu đề: "Workshop Nghệ Thuật Sơn Mài"
  - [ ] Category: "Hoạt Động"
  - [ ] Status: **Đã xuất bản**
  - [ ] Save

- [ ] Create tin tức mẫu #3:
  - [ ] Tiêu đề: "Hợp Tác Với Làng Nghề Bát Tràng"
  - [ ] Category: "Đối Tác"
  - [ ] Status: **Đã xuất bản**
  - [ ] Save

## ☑️ API Testing

- [ ] Test news API
  ```bash
  curl http://localhost:5000/api/news
  ```
  
  Expect: JSON array với 3 tin tức

- [ ] Test specific news
  ```bash
  curl http://localhost:5000/api/news/khai-mac-trien-lam-sac-mau-di-san
  ```
  
  Expect: JSON object của tin tức đó

- [ ] Test uploads (nếu đã upload hình)
  - [ ] Truy cập: http://localhost:5000/uploads/filename.jpg

## ☑️ Frontend Testing

- [ ] Truy cập: http://localhost:3000

- [ ] Homepage load thành công

- [ ] Scroll đến section "Tin Tức Mới Nhất"

- [ ] Verify tin tức hiển thị:
  - [ ] Thấy 3 tin tức đã tạo
  - [ ] Tiêu đề đúng
  - [ ] Mô tả ngắn đúng
  - [ ] Category badge đúng (tiếng Việt)
  - [ ] Ngày đăng format đúng (tiếng Việt)
  - [ ] Hình ảnh hiển thị (nếu có)

- [ ] Hover effects hoạt động

- [ ] Responsive design:
  - [ ] Desktop (> 1024px): 3 columns
  - [ ] Tablet (768-1023px): 2 columns
  - [ ] Mobile (< 768px): 1 column

## ☑️ Error Handling

- [ ] Test empty state:
  - [ ] Xóa tất cả tin tức (hoặc set tất cả = draft)
  - [ ] Reload frontend
  - [ ] Verify message: "Chưa có tin tức nào..."

- [ ] Test với backend tắt:
  - [ ] Stop backend server
  - [ ] Reload frontend
  - [ ] Verify không crash (hiển thị empty state)

- [ ] Restart backend và verify hoạt động lại

## ☑️ Final Verification

- [ ] Cả backend và frontend đang chạy đồng thời

- [ ] Có thể tạo tin tức mới từ admin panel

- [ ] Tin tức mới tự động hiển thị trên frontend (trong 60 giây do ISR)

- [ ] Upload hình ảnh hoạt động

- [ ] Images hiển thị đúng trên frontend

- [ ] No console errors trong browser DevTools

- [ ] No errors trong backend terminal

## ☑️ Documentation Review

- [ ] Đã đọc `PAYLOAD_SETUP.md`

- [ ] Đã đọc `IMPLEMENTATION_SUMMARY.md`

- [ ] Đã đọc `backend/README.md`

- [ ] Hiểu cách hoạt động của hệ thống

## 🎉 Success Criteria

Nếu tất cả checkboxes trên đã được check:

✅ **SETUP HOÀN TẤT!**

Bạn đã có:
- ✅ Payload CMS admin panel hoạt động
- ✅ PostgreSQL database connected
- ✅ Backend API serving data
- ✅ Frontend displaying CMS content
- ✅ Full CRUD operations on News
- ✅ Media upload working

## 🚀 Next Actions

1. Explore Payload admin panel
2. Tạo thêm collections (Events, Products, Partners)
3. Customize admin UI
4. Deploy to production

## 🐛 If Something Failed

1. Đọc error message carefully
2. Check troubleshooting section in `PAYLOAD_SETUP.md`
3. Verify environment variables
4. Check PostgreSQL is running
5. Check ports 3000 và 5000 không bị sử dụng

---

**Good luck! 🎊**

