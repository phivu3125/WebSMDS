# Quick Reference Guide

Tài liệu tham khảo nhanh cho các lệnh và URLs thường dùng.

## 🔗 URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Public website |
| Backend API | http://localhost:5000 | REST API |
| Admin Panel | http://localhost:5000/admin | Payload CMS admin |
| News API | http://localhost:5000/api/news | Public news endpoint |
| Uploads | http://localhost:5000/uploads/ | Static media files |

## 💻 Commands

### Backend

```bash
cd backend

# Development
npm run dev          # Start with hot reload

# Production
npm run build        # Compile TypeScript
npm start            # Run production server

# Payload CLI
npm run payload      # Access Payload CLI
```

### Frontend

```bash
cd frontend

# Development
npm run dev          # Start Next.js dev server

# Production
npm run build        # Build for production
npm start            # Run production server

# Utilities
npm run lint         # Run ESLint
```

### Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Connect to specific database
psql -U postgres -d websmds

# List databases
psql -U postgres -l

# Create database
createdb websmds

# Drop database (careful!)
dropdb websmds

# Check if database exists
psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='websmds';"
```

## 📁 Important Files

### Backend

```
backend/
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Template for .env
├── server.ts                     # Main server file
├── src/
│   ├── payload.config.ts         # Payload configuration
│   └── collections/
│       ├── News.ts               # News collection schema
│       ├── Media.ts              # Media collection schema
│       └── Users.ts              # Users collection schema
└── uploads/                      # Media storage (gitignored)
```

### Frontend

```
frontend/
├── .env.local                    # Environment variables (gitignored)
├── .env.local.example            # Template
└── src/
    ├── app/
    │   └── page.tsx              # Home page
    └── components/
        └── home/
            └── news-section.tsx  # News component (CMS connected)
```

## 🔑 Environment Variables

### Backend (.env)

```bash
PORT=5000
DATABASE_URI=postgresql://username:password@localhost:5432/websmds
PAYLOAD_SECRET=your-secret-key-change-this
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📊 Collections Schema

### News

```typescript
{
  title: string          // Required
  slug: string           // Required, unique, auto-generated
  excerpt: string        // Required
  content: RichText      // Optional
  image: Media           // Optional, relation to Media
  category: 'su-kien' | 'hoat-dong' | 'doi-tac'
  date: Date            // Required
  status: 'draft' | 'published'
  createdAt: Date
  updatedAt: Date
}
```

### Media

```typescript
{
  filename: string
  alt: string
  mimeType: string
  filesize: number
  width: number
  height: number
  sizes: {
    thumbnail: { url, width, height }
    card: { url, width, height }
    tablet: { url, width, height }
  }
}
```

### Users

```typescript
{
  email: string          // Required, unique
  password: string       // Required, hashed
  name: string          // Required
  role: 'admin' | 'editor'
}
```

## 🌐 API Endpoints

### Public Endpoints

```bash
# Get all published news
GET /api/news

# Get specific news by slug
GET /api/news/:slug

# Get media file
GET /uploads/:filename

# Health check
GET /api/hello
```

### Admin Endpoints (Require Auth)

```bash
# Login
POST /api/users/login
Body: { email: string, password: string }

# Get all news (including drafts)
GET /api/news
Headers: { Authorization: Bearer <token> }

# Create news
POST /api/news
Headers: { Authorization: Bearer <token> }
Body: { title, excerpt, category, date, status, ... }

# Update news
PATCH /api/news/:id
Headers: { Authorization: Bearer <token> }

# Delete news
DELETE /api/news/:id
Headers: { Authorization: Bearer <token> }
```

## 🎨 Category Values

| Category Value | Display Label |
|----------------|---------------|
| `su-kien` | Sự Kiện |
| `hoat-dong` | Hoạt Động |
| `doi-tac` | Đối Tác |

## 🔧 Common Tasks

### Reset Database

```bash
# Drop and recreate database
dropdb websmds
createdb websmds

# Restart backend - Payload will auto-create tables
cd backend
npm run dev
```

### Add New Admin User

1. Go to http://localhost:5000/admin
2. Login as existing admin
3. Navigate to Users collection
4. Click "Create New"
5. Fill in email, password, name, role
6. Save

### Change Admin Password

1. Login to admin panel
2. Click on your email (top right)
3. Click "Account"
4. Change password
5. Save

### Deploy News to Published

1. Go to News collection
2. Edit the news item
3. Change Status to "Đã xuất bản"
4. Save
5. Will appear on frontend within 60 seconds (ISR)

### Upload Multiple Images

1. Go to Media collection
2. Click "Create New"
3. Upload image
4. Add alt text
5. Save
6. Repeat for more images
7. Use in News via the Image field

## 🐛 Debug Tips

### Check Backend Logs

```bash
# Terminal where backend is running
# Will show all requests and errors
```

### Check Frontend Logs

```bash
# Browser DevTools Console (F12)
# Will show fetch errors, component errors
```

### Check Database

```bash
psql -U postgres -d websmds

# List tables
\dt

# Check news table
SELECT * FROM news;

# Check users
SELECT id, email, name, role FROM users;

# Exit
\q
```

### Test API Manually

```bash
# Using curl
curl http://localhost:5000/api/news

# Using browser
# Just open http://localhost:5000/api/news

# Using Postman/Insomnia
# Import API endpoints and test
```

## 📦 Package Versions

### Backend

- payload: ^3.60.0
- @payloadcms/db-postgres: ^3.60.0
- @payloadcms/richtext-lexical: ^3.60.0
- express: ^5.1.0
- pg: ^8.16.3
- typescript: ^5.9.3

### Frontend

- next: Latest
- react: Latest
- typescript: Latest
- tailwindcss: v4

## 🔄 Workflow

### Typical Content Update Flow

1. Admin logs in to `/admin`
2. Creates/edits news in News collection
3. Uploads images if needed
4. Sets status to "published"
5. Saves
6. Frontend automatically shows new content (within 60s)
7. Users see updated content

### Development Workflow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Make changes to code
4. Both auto-reload on save
5. Test in browser
6. Commit changes

## 🚀 Production Deployment

### Environment Setup

**Backend:**
- Set production `DATABASE_URI`
- Generate strong `PAYLOAD_SECRET`
- Set production `FRONTEND_URL`

**Frontend:**
- Set production `NEXT_PUBLIC_API_URL`

### Build Commands

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

---

**Need more help?** Check:
- `PAYLOAD_SETUP.md` - Setup guide
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `SETUP_CHECKLIST.md` - Step-by-step checklist

