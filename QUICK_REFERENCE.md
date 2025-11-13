# Quick Reference Guide

Tài liệu tham khảo nhanh cho các lệnh và URLs thường dùng.

## 🔗 URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Public website |
| Backend API | http://localhost:5000 | REST API |
| Admin Panel | http://localhost:3000/admin | Custom admin dashboard |
| Health Check | http://localhost:5000/health | API health status |
| Uploads | http://localhost:5000/uploads/ | Static media files |

## 💻 Commands

### Backend (Express + Prisma)

```bash
cd backend

# Development
npm run dev              # Start with hot reload (tsx watch)

# Production
npm run build            # Compile TypeScript
npm start                # Run production server

# Database Operations
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (http://localhost:5555)
npm run seed             # Seed database with initial data

# Data Management
npm run import-data      # Import data from scripts
npm run dump-data        # Export data to backup file
```

### Frontend (Next.js 15)

```bash
cd frontend

# Development with Turbopack
npm run dev              # Start Next.js dev server

# Production
npm run build            # Build for production
npm start                # Run production server

# Utilities
npm run lint             # Run ESLint
```

### Database (PostgreSQL)

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
├── server.ts                     # Main Express server file
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed script
├── src/
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client
│   │   └── auth.ts               # Auth utilities
│   ├── middleware/
│   │   └── auth.ts               # JWT auth middleware
│   ├── controllers/              # Business logic
│   └── routes/                   # API routes
└── uploads/                      # Media storage (gitignored)
```

### Frontend

```
frontend/
├── .env.local                    # Environment variables (gitignored)
└── src/
    ├── app/
    │   ├── admin/                # Admin dashboard routes
    │   └── page.tsx              # Home page
    └── components/
        ├── home/                 # Homepage components
        └── admin/                # Admin UI components
```

## 🔑 Environment Variables

### Backend (.env)

```bash
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/websmds
JWT_SECRET=your-jwt-secret-key-change-this
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📊 Database Schema

### Core Models

**Users:**
```typescript
{
  id: string        // UUID
  email: string     // Unique
  password: string  // Hashed with bcrypt
  name: string
  role: string      // "admin" | "user" | "editor"
  createdAt: Date
  updatedAt: Date
}
```

**Events:**
```typescript
{
  id: string
  title: string
  slug: string      // Unique
  description: string
  fullDescription: string
  image: string
  location: string
  status: string    // "draft" | "published"
  dateDisplay: string
  // ... other fields
}
```

**Products:**
```typescript
{
  id: string
  name: string
  slug: string      // Unique
  description: string
  price: number
  image: string
  images: string[]  // Array of image URLs
  categoryId: string
  stock: number
  inStock: boolean
  // ... other fields
}
```

## 🌐 API Endpoints

### Authentication

```bash
# Login
POST /api/auth/login
Body: { email: string, password: string }

# Get current user
GET /api/auth/me
Headers: { Authorization: Bearer <token> }
```

### Public Endpoints

```bash
# News
GET /api/press                    # Get all published news
GET /api/press/:slug              # Get news by slug

# Events
GET /api/events                   # Get published events
GET /api/events/:slug             # Get event by slug

# Products
GET /api/products                 # Get all products
GET /api/products/:id             # Get product by ID

# Past Events
GET /api/past-events              # Get all past events
GET /api/past-events/:slug        # Get past event by slug
GET /api/past-events/years        # Get years with event counts

# Health Check
GET /health                       # API health status
```

### Admin Endpoints (Require Auth)

```bash
# Press/News Management
GET /api/press/admin/all          # Get all news (including drafts)
POST /api/press                   # Create news
PATCH /api/press/:id              # Update news
DELETE /api/press/:id             # Delete news

# Events Management
GET /api/events/admin/all         # Get all events (including drafts)
POST /api/events                  # Create event
PATCH /api/events/:id             # Update event
DELETE /api/events/:id            # Delete event

# Products Management
GET /api/products/admin/all       # Get all products
POST /api/products                # Create product
PATCH /api/products/:id           # Update product
DELETE /api/products/:id          # Delete product

# Past Events Management
GET /api/past-events/admin/all    # Get all past events
POST /api/past-events             # Create past event
PATCH /api/past-events/:id        # Update past event
DELETE /api/past-events/:id       # Delete past event

# File Upload
POST /api/uploads                 # Upload image/file
Headers: { Authorization: Bearer <token> }
Content-Type: multipart/form-data
```

## 🔧 Common Tasks

### Reset Database

```bash
# Drop and recreate database
dropdb websmds
createdb websmds

# Run migrations
cd backend
npm run prisma:migrate

# Seed data
npm run seed
```

### Add New Admin User

```bash
# Method 1: Via API
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Method 2: Via Prisma Studio
npm run prisma:studio
# Navigate to Users table and add record
```

### Database Operations

```bash
# View all tables
psql -U postgres -d websmds -c "\dt"

# Check specific table
psql -U postgres -d websmds -c "SELECT * FROM users LIMIT 5;"

# Reset sequence
psql -U postgres -d websmds -c "ALTER SEQUENCE users_id_seq RESTART WITH 1;"
```

### File Uploads

```bash
# Upload directory location
backend/uploads/

# File size limit (from .env)
MAX_FILE_SIZE=10485760  # 10MB

# Access uploaded files
http://localhost:5000/uploads/filename.jpg
```

## 🐛 Debug Tips

### Check Backend Logs

```bash
# Terminal where backend is running
# Shows all API requests, errors, and database queries
```

### Check Frontend Logs

```bash
# Browser DevTools Console (F12)
# Shows fetch errors, component errors, and warnings
```

### Database Debugging

```bash
# Open Prisma Studio for visual database management
cd backend && npm run prisma:studio
# Opens at: http://localhost:5555

# Direct database queries
psql -U postgres -d websmds
```

### Test API Endpoints

```bash
# Using curl
curl http://localhost:5000/api/press

# With authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/press/admin/all

# Using Postman/Insomnia
# Import collection and test endpoints
```

## 📦 Package Versions

### Backend

```json
{
  "express": "^5.1.0",
  "@prisma/client": "^6.17.1",
  "prisma": "^6.17.1",
  "bcryptjs": "^3.0.2",
  "jsonwebtoken": "^9.0.2",
  "multer": "^2.0.2",
  "sharp": "^0.34.4",
  "tsx": "^4.20.6"
}
```

### Frontend

```json
{
  "next": "15.5.5",
  "react": "19.1.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "@tiptap/react": "^3.10.5",
  "framer-motion": "^12.23.24"
}
```

## 🔄 Workflow

### Development Workflow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Make Changes**: Both auto-reload on save
4. **Test**: Check both frontend and backend
5. **Database Changes**: Update schema, run migrations
6. **Commit**: Git commit with meaningful messages

### Content Management Flow

1. **Login**: Use admin credentials via API
2. **Create Content**: POST to appropriate endpoint
3. **Upload Images**: Use `/api/uploads` endpoint
4. **Publish**: Set status to "published"
5. **Verify**: Check frontend display
6. **Update**: Use PATCH endpoint for edits

## 🚀 Production Deployment

### Environment Setup

**Backend (.env):**
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=strong-random-string
FRONTEND_URL=https://yourdomain.com
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Build & Deploy

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
- `CLAUDE.md` - Development guidance
- `REBUILD_SUMMARY.md` - Architecture overview
- `PAST_EVENTS_GUIDE.md` - Past events feature documentation