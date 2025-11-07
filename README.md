# WebSMDS - Sắc Màu Di Sản

Website quản lý và giới thiệu về di sản văn hóa Việt Nam với Payload CMS.

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework với App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Shadcn/ui** - UI components

### Backend
- **Node.js + Express** - Server framework
- **Payload CMS v3** - Headless CMS
- **PostgreSQL** - Database
- **TypeScript** - Type safety

## 📁 Project Structure

```
WebSMDS/
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# React components
│   │   └── lib/       # Utilities
│   └── package.json
│
├── backend/           # Express + Payload CMS
│   ├── src/
│   │   ├── collections/  # Payload collections
│   │   ├── config/       # Configuration files
│   │   └── payload.config.ts
│   ├── server.ts      # Express server
│   └── package.json
│
├── PAYLOAD_SETUP.md          # Setup guide
└── IMPLEMENTATION_SUMMARY.md # Technical details
```

## 🎯 Features

### Admin Panel (Payload CMS)
- ✅ Quản lý tin tức (News)
- ✅ Upload và quản lý media
- ✅ Authentication & Authorization
- ✅ Role-based access control (Admin/Editor)
- ✅ Rich text editor
- ✅ Auto-generate slugs
- ✅ Draft/Published workflow

### Public Website
- ✅ Trang chủ với các sections
- ✅ Hiển thị tin tức từ CMS
- ✅ Responsive design
- ✅ Modern UI/UX

## 🛠️ Setup & Installation

### Prerequisites

- Node.js v18+
- PostgreSQL v14+
- npm hoặc yarn

### Quick Start

1. **Clone repository**
```bash
git clone <repository-url>
cd WebSMDS
```

2. **Setup Backend**
```bash
cd backend
npm install

# Tạo PostgreSQL database
createdb websmds

# Tạo file .env từ template
cp .env.example .env
# Cập nhật DATABASE_URI trong .env

# Chạy development server
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5000`
Admin panel: `http://localhost:5000/admin`

3. **Setup Frontend**
```bash
cd frontend
npm install

# Tạo file .env.local
cp .env.local.example .env.local

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### Hướng Dẫn Chi Tiết

Xem file [`PAYLOAD_SETUP.md`](./PAYLOAD_SETUP.md) để biết hướng dẫn setup từng bước chi tiết.

## 📚 Documentation

- [`PAYLOAD_SETUP.md`](./PAYLOAD_SETUP.md) - Hướng dẫn setup và test
- [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md) - Chi tiết kỹ thuật
- [`backend/README.md`](./backend/README.md) - Backend documentation

## 🔌 API Endpoints

### Public APIs

```
GET /api/news              # Lấy tất cả tin tức published
GET /api/news/:slug        # Lấy tin tức theo slug
GET /uploads/*             # Static media files
```

### Admin APIs

```
POST /api/users/login      # Admin login
GET  /admin                # Admin panel
```

## 🗄️ Database Collections

### News
Quản lý tin tức và bài viết
- Title, Slug, Excerpt, Content (Rich Text)
- Image, Category, Date, Status

### Media
Quản lý hình ảnh và files
- Auto-generate thumbnails
- Multiple image sizes

### Users
Quản lý admin users
- Email/Password authentication
- Role-based access

## 🔐 Security

- JWT-based authentication
- Role-based authorization
- CORS protection
- CSRF protection
- Bcrypt password hashing
- SQL injection protection (Payload ORM)

## 🎨 Frontend Components

### Home Page Sections
- Navigation
- Hero Section
- Events Section
- About Section
- Mission Statement
- Journeys Section
- Products Section
- **News Section** (Connected to CMS)
- Partners Section
- Footer

## 🚀 Deployment

### Backend
Có thể deploy lên:
- Railway
- Render
- DigitalOcean App Platform
- Heroku

### Frontend
Có thể deploy lên:
- Vercel (Recommended)
- Netlify
- Cloudflare Pages

### Database
- Neon (Serverless PostgreSQL)
- Supabase
- Railway PostgreSQL
- AWS RDS

## 📝 Scripts

### Backend
```bash
npm run dev      # Development server with hot reload
npm run build    # Build TypeScript
npm start        # Production server
npm run payload  # Payload CLI
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # Run ESLint
```

## 🐛 Troubleshooting

Xem section Troubleshooting trong [`PAYLOAD_SETUP.md`](./PAYLOAD_SETUP.md)

## 📈 Next Steps

- [ ] Thêm Events collection
- [ ] Thêm Products collection
- [ ] Thêm Partners collection
- [ ] News detail page
- [ ] Search functionality
- [ ] Pagination
- [ ] SEO optimization
- [ ] Multi-language (i18n)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name

## 🙏 Acknowledgments

- [Payload CMS](https://payloadcms.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)

---

**Status**: ✅ MVP Complete with CMS Integration
**Last Updated**: October 21, 2025

