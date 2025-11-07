# Backend API - Custom Build

Simple REST API với Express, Prisma, PostgreSQL cho WebSMDS.

## 🚀 Features

✅ **Authentication**: JWT-based auth với bcrypt password hashing  
✅ **News Management**: Full CRUD operations  
✅ **Image Upload**: Multer file upload  
✅ **PostgreSQL**: Prisma ORM  
✅ **TypeScript**: Full type safety  
✅ **Simple & Clean**: Không phụ thuộc CMS  

## 📦 Tech Stack

- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Multer (file uploads)
- TypeScript

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Update `.env` file:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/websmds
JWT_SECRET=your-jwt-secret-key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. Run Migrations

```bash
npx prisma migrate dev
```

### 4. Seed Database

```bash
npm run seed
```

Creates:
- Admin user: `admin@example.com` / `admin123`
- Sample news

### 5. Start Server

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

## 📡 API Endpoints

### Authentication

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "user": { "id", "email", "name", "role" },
  "token": "jwt-token"
}
```

**Register** (Create new user)
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password",
  "name": "User Name",
  "role": "editor"
}
```

**Get Current User**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### News

**Get All Published News** (Public)
```http
GET /api/news

Response: Array of news objects
```

**Get News by Slug** (Public)
```http
GET /api/news/khai-mac-trien-lam
```

**Get All News** (Including drafts - Auth required)
```http
GET /api/news/admin/all
Authorization: Bearer <token>
```

**Create News** (Auth required)
```http
POST /api/news
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tiêu đề",
  "slug": "tieu-de",
  "excerpt": "Mô tả ngắn",
  "content": "Nội dung đầy đủ",
  "category": "su-kien",
  "date": "2025-10-21",
  "status": "published",
  "image": "/uploads/image.jpg"
}
```

**Update News** (Auth required)
```http
PATCH /api/news/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tiêu đề mới",
  "status": "published"
}
```

**Delete News** (Auth required)
```http
DELETE /api/news/:id
Authorization: Bearer <token>
```

**Upload Image** (Auth required)
```http
POST /api/news/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form data:
  file: <image file>

Response:
{
  "filename": "123456-image.jpg",
  "url": "/uploads/123456-image.jpg"
}
```

## 🗄️ Database Schema

### User
```prisma
id        String   (UUID)
email     String   (unique)
password  String   (hashed)
name      String
role      String   (admin/editor)
createdAt DateTime
updatedAt DateTime
```

### News
```prisma
id        String   (UUID)
title     String
slug      String   (unique)
excerpt   Text
content   Text     (nullable)
image     String   (nullable)
category  String   (su-kien/hoat-dong/doi-tac)
date      DateTime
status    String   (draft/published)
createdAt DateTime
updatedAt DateTime
```

## 🔐 Security

- Passwords hashed với bcrypt
- JWT tokens expire sau 7 days
- Protected routes require authentication
- File upload validation (images only, max 5MB)

## 📝 Scripts

```bash
npm run dev          # Development server với hot reload
npm run build        # Build TypeScript
npm start            # Production server
npm run seed         # Seed database
npx prisma studio    # Open Prisma Studio (DB GUI)
npx prisma migrate dev  # Run migrations
```

## 🧪 Testing API

### Using curl

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Get News:**
```bash
curl http://localhost:5000/api/news
```

**Create News:**
```bash
TOKEN="your-jwt-token"

curl -X POST http://localhost:5000/api/news \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tin mới",
    "slug": "tin-moi",
    "excerpt": "Mô tả",
    "category": "su-kien",
    "date": "2025-10-21",
    "status": "published"
  }'
```

### Using PowerShell

**Login:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"admin@example.com","password":"admin123"}'

$token = $response.token
```

**Get News:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/news"
```

**Create News:**
```powershell
$headers = @{
  "Authorization" = "Bearer $token"
  "Content-Type" = "application/json"
}

$body = @{
  title = "Tin mới"
  slug = "tin-moi"
  excerpt = "Mô tả"
  category = "su-kien"
  date = "2025-10-21"
  status = "published"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/news" `
  -Method Post `
  -Headers $headers `
  -Body $body
```

## 🎯 Default Admin Account

```
Email: admin@example.com
Password: admin123
Role: admin
```

**⚠️ Change password in production!**

## 📚 Prisma Studio

Visual database browser:

```bash
npx prisma studio
```

Opens at: http://localhost:5555

## 🔄 Workflow

1. **Start backend**: `npm run dev`
2. **Login** via API để lấy token
3. **Create/Update news** với token
4. **Frontend** sẽ fetch từ `/api/news`
5. **Users see** tin tức published

## ⚡ Quick Test

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Test API
curl http://localhost:5000/api/news
```

Should return sample news!

---

**Simple, Clean, No CMS! 🎉**
