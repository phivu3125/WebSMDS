# HƯỚNG DẪN QUẢN LÝ SỰ KIỆN ĐÃ DIỄN RA (PAST EVENTS)

## 📋 TỔNG QUAN

Hệ thống quản lý Past Events được thiết kế với UI đẹp mắt và CMS linh hoạt, cho phép bạn tạo các trang chi tiết sự kiện đầy đủ với:

- **Hero Section**: Ảnh bìa, tiêu đề, phụ đề, quote
- **Giới thiệu**: Nội dung mở đầu với HTML formatting
- **Hoạt động**: Nhiều activities với icon, title, subtitle, content và ảnh
- **Thư viện ảnh**: Gallery masonry layout
- **Kết luận**: Phần kết thúc sự kiện

## 🎨 CẤU TRÚC DỮ LIỆU

### Database Schema (Prisma)

```prisma
model PastEvent {
  id            String   @id @default(uuid())
  title         String   // "SẮC HỘI TRĂNG THU 2025"
  slug          String   @unique // "sac-hoi-trang-thu-2025"
  subtitle      String?  // Phụ đề
  description   String?  // Mô tả ngắn
  heroImage     String?  // URL ảnh hero
  year          Int      // 2025
  
  heroTitle     String?  // Tiêu đề hero (optional)
  heroQuote     String?  // Quote nổi bật
  
  introContent  String?  @db.Text // Nội dung giới thiệu (HTML)
  
  activities    Json?    // Array các hoạt động
  // [{
  //   icon: "✅",
  //   title: "Chạm Sử Thu",
  //   subtitle: "HÀNH TRÌNH TRỞ VỀ...",
  //   content: "<p>HTML content</p>",
  //   images: ["url1", "url2"]
  // }]
  
  galleryImages String[] // Array URLs
  
  conclusion    String?  @db.Text // Kết luận (HTML)
  
  status        String   @default("draft") // draft, published
  featured      Boolean  @default(false)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## 🚀 HƯỚNG DẪN SỬ DỤNG

### 1. Truy cập Admin Panel

```
http://localhost:3000/admin/past-events
```

### 2. Tạo sự kiện mới

**Bước 1: Thông tin cơ bản**
- Tiêu đề: "SẮC MÀU DI SẢN – SẮC HỘI TRĂNG THU 2025"
- Slug: "sac-hoi-trang-thu-2025" (dùng cho URL)
- Năm: 2025
- Phụ đề: "Hành trình đưa di sản trở lại trong một mùa Trung thu hiện đại"
- Mô tả ngắn: Hiển thị trong danh sách
- Trạng thái: Draft/Published

**Bước 2: Hero Section**
- Upload ảnh hero (ảnh bìa lớn)
- Quote nổi bật: "Mỗi mùa là một sắc màu..."

**Bước 3: Giới thiệu**
- Nội dung HTML cho phần intro
- Ví dụ:
```html
<p>Trung thu – mùa của đoàn viên, sum vầy và ký ức...</p>
<p>Năm 2025, Santani tiếp tục đồng hành...</p>
```

**Bước 4: Thêm Hoạt động**
- Click "Thêm hoạt động"
- Điền:
  - Icon/Emoji: ✅
  - Tiêu đề: "Chạm Sử Thu"
  - Phụ đề: "HÀNH TRÌNH TRỞ VỀ VỚI KÝ ỨC TRUNG THU"
  - Nội dung (HTML):
  ```html
  <p>Tại Chạm Sử Thu, mọi người cùng nhau bước qua cánh cửa thời gian...</p>
  <p>Những màn giải đố Trung thu vui nhộn,</p>
  <p>Trò chơi "Đuổi hình bắt chữ" đầy thử thách...</p>
  ```
  - Upload ảnh cho activity (nếu có)

- Lặp lại cho các activities khác:
  - ✅ Chạm Hội Thu
  - ✅ Chạm Sắc Thu
  - ✅ Chạm Vị Thu

**Bước 5: Thư viện ảnh**
- Upload nhiều ảnh cho gallery
- Ảnh sẽ tự động xếp theo masonry layout

**Bước 6: Kết luận**
```html
<p>Chúng tôi tin rằng, khi những "mùa sắc" ấy tiếp nối nhau...</p>
<p>Được sống, được yêu, và được truyền tiếp.</p>
```

**Bước 7: Lưu**
- Click "Lưu sự kiện"
- Chọn "Published" để hiển thị công khai

### 3. Xem kết quả

**Homepage:**
```
http://localhost:3000/#past_events
```

**Trang chi tiết:**
```
http://localhost:3000/past-events/sac-hoi-trang-thu-2025
```

## 🎯 TEMPLATE CONTENT MẪU

### Ví dụ cho "Sắc Hội Trăng Thu 2025"

```javascript
{
  title: "SẮC MÀU DI SẢN – SẮC HỘI TRĂNG THU 2025",
  slug: "sac-hoi-trang-thu-2025",
  subtitle: "Hành trình đưa di sản trở lại trong một mùa Trung thu hiện đại",
  year: 2025,
  heroQuote: "Mỗi mùa là một sắc màu, mỗi sắc màu là một mảnh ghép của nét đẹp văn hóa Việt Nam.",
  
  introContent: `
    <p>Trung thu – mùa của đoàn viên, sum vầy và ký ức. Không chỉ là đêm trăng tròn rực rỡ, Trung thu còn là những câu chuyện tuổi thơ: ánh đèn ông sao, tiếng trống múa lân, những chiếc mặt nạ giấy bồi, hay bộ phỗng đất giản dị trên mâm cỗ.</p>
    <p>Năm 2025, Santani tiếp tục đồng hành cùng Trung tâm Lưu trữ Quốc gia II tổ chức sự kiện <strong>SẮC MÀU DI SẢN – Sắc Hội Trăng Thu</strong>, mang đến một không gian lễ hội Trung thu sống động...</p>
  `,
  
  activities: [
    {
      icon: "✅",
      title: "Chạm Sử Thu",
      subtitle: "HÀNH TRÌNH TRỞ VỀ VỚI KÝ ỨC TRUNG THU VÀ LỜI DẶN CỦA BÁC",
      content: `
        <p>Tại Chạm Sử Thu, mọi người cùng nhau bước qua cánh cửa thời gian — nơi ánh trăng xưa, những câu đố dân gian và thơ ca của Bác Hồ trở thành chiếc cầu nối giữa quá khứ – hiện tại – tương lai.</p>
        <ul>
          <li>Những màn giải đố Trung thu vui nhộn</li>
          <li>Trò chơi "Đuổi hình bắt chữ" đầy thử thách</li>
          <li>Và khoảnh khắc lắng đọng bên những vần thơ, bức thư Bác gửi thiếu nhi</li>
        </ul>
      `,
      images: ["/uploads/cham-su-thu-1.jpg", "/uploads/cham-su-thu-2.jpg"]
    },
    {
      icon: "✅",
      title: "Chạm Hội Thu",
      subtitle: "NƠI TRÒ CHƠI HÓA KÝ ỨC, VĂN HÓA HÓA DI SẢN",
      content: `
        <p>Tại Sắc Hội Trăng Thu, không gian "Chạm Hội Thu" mở ra hai thế giới đầy sắc màu:</p>
        <p>🎉 <strong>Trò chơi vận động:</strong> Từ nhảy bao bố, nhảy sạp, nhảy lò cò đến ném vòng, ném banh...</p>
        <p>🧩 <strong>Trò chơi trí tuệ:</strong> Với ô ăn quan, xăm hường, trí uẩn, cờ nấm...</p>
      `,
      images: ["/uploads/cham-hoi-thu.jpg"]
    }
  ],
  
  conclusion: `
    <p>Chúng tôi tin rằng, khi những "mùa sắc" ấy tiếp nối nhau, chúng sẽ tạo nên một <strong>hành trình không ngừng lan tỏa</strong> — nơi di sản không chỉ được lưu giữ, mà còn được chạm vào bằng những giác quan và cảm xúc, <em>được sống, được yêu, và được truyền tiếp.</em></p>
  `
}
```

## 📁 CẤU TRÚC FILE

```
backend/
├── prisma/
│   └── schema.prisma (✅ Updated)
├── src/
│   ├── controllers/
│   │   └── past-events.controller.ts (✅ New)
│   └── routes/
│       └── past-events.routes.ts (✅ New)
└── server.ts (✅ Updated)

frontend/
├── src/
│   ├── app/
│   │   ├── past-events/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx (✅ New)
│   │   │       └── past-event-client.tsx (✅ New)
│   │   └── admin/
│   │       └── past-events/
│   │           ├── page.tsx (✅ New - List)
│   │           ├── create/
│   │           │   └── page.tsx (✅ New)
│   │           ├── edit/[id]/
│   │           │   └── page.tsx (✅ New)
│   │           └── past-event-form.tsx (✅ New)
│   ├── components/
│   │   └── home/
│   │       └── past-events-section.tsx (✅ Updated)
│   ├── lib/
│   │   └── api/
│   │       └── past-events.ts (✅ New)
│   └── types/
│       └── past-event.ts (✅ New)
```

## 🎨 TÍNH NĂNG UI

### Trang chi tiết sự kiện:

1. **Hero Section**: 
   - Full-width hero image với gradient overlay
   - Title, subtitle overlay trên ảnh
   - Year badge

2. **Introduction**: 
   - Card trắng với border vàng
   - Quote nổi bật với font chữ đẹp
   - Divider decorative

3. **Activities Section**:
   - Alternating layout (trái-phải)
   - Icon + title + subtitle
   - HTML content support
   - Multi-image grid cho mỗi activity

4. **Gallery**:
   - Masonry layout tự động
   - Responsive (1-3 cột)
   - Hover effects

5. **Conclusion**:
   - Gradient background (purple-amber)
   - Decorative SVG elements
   - Center-aligned

### Admin Panel:

1. **List Page**:
   - Grid cards với preview
   - Filter theo năm
   - Quick actions (View, Edit, Delete)

2. **Form**:
   - Sections rõ ràng
   - Image upload với preview
   - Dynamic activities (Add/Remove)
   - HTML textarea cho rich content
   - Gallery management

## 🔧 API ENDPOINTS

```
GET    /api/past-events              # List all (published)
GET    /api/past-events/years        # Get years with count
GET    /api/past-events/:slug        # Get by slug
POST   /api/past-events              # Create (admin)
PUT    /api/past-events/:id          # Update (admin)
DELETE /api/past-events/:id          # Delete (admin)
```

## 💡 TIPS & BEST PRACTICES

### HTML Content Tips:

```html
<!-- Paragraph -->
<p>Nội dung thường</p>

<!-- Bold -->
<p>Đây là <strong>text đậm</strong></p>

<!-- Italic -->
<p>Đây là <em>text nghiêng</em></p>

<!-- Line break -->
<p>Dòng 1<br />Dòng 2</p>

<!-- List -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

### Slug Best Practices:
- Chỉ dùng chữ thường: `a-z`
- Dùng dấu gạch ngang: `-`
- Không dấu: `sac-hoi-trang-thu-2025`
- Ngắn gọn, dễ nhớ

### Image Tips:
- Hero image: 1920x1080px (16:9)
- Activity images: 1200x800px
- Gallery: Mix portrait/landscape
- Format: JPG (tối ưu dung lượng)

### Content Structure:
1. Hook (giới thiệu ngắn)
2. Main content (3-5 activities)
3. Gallery (8-12 ảnh)
4. Conclusion (kết thúc đẹp)

## 🐛 TROUBLESHOOTING

### Lỗi thường gặp:

**1. Không upload được ảnh:**
- Check API URL trong `.env`
- Check folder `backend/uploads` có quyền ghi
- Check token authentication

**2. Không hiển thị events:**
- Check status = "published"
- Check API endpoint hoạt động
- Check console errors

**3. HTML không render đúng:**
- Dùng `dangerouslySetInnerHTML`
- Check HTML syntax valid
- Avoid inline styles (dùng Tailwind)

## 📝 MIGRATION DATABASE

Nếu cần reset database:

```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
```

## 🎉 KẾT QUẢ

Bạn sẽ có:
- ✅ Trang danh sách events đẹp mắt với filter
- ✅ Trang chi tiết đầy đủ với sections chuyên nghiệp
- ✅ Admin CMS dễ dùng
- ✅ Responsive mobile-friendly
- ✅ Smooth animations
- ✅ SEO-friendly URLs

Chúc bạn thành công! 🚀
