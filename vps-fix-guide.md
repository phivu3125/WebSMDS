# WebSMDS VPS Fix Guide - Docker Build Error

## 🐛 Issue Fixed
Created `next.config.js` with `output: 'standalone'` to fix Docker build error.

## 🚀 Steps to Rebuild on VPS

### Option 1: Pull Latest Changes (Recommended)

```bash
# SSH vào VPS
ssh root@your-vps-ip

# Switch to websmds user
su - websmds

# Go to project directory
cd /home/websmds/WebSMDS

# Pull latest changes (includes next.config.js)
git pull origin main

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### Option 2: Manual Fix on VPS

If git pull fails or you want to fix directly:

```bash
# SSH vào VPS
ssh root@your-vps-ip
su - websmds

# Create next.config.js directly
cd /home/websmds/WebSMDS/frontend

cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
EOF

# Rebuild
cd ..
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Option 3: Complete Re-deployment

```bash
# Full redeployment using deploy script
cd /home/websmds/WebSMDS
sudo ./deploy.sh
```

## 🔍 Verification Commands

```bash
# Check all containers
docker-compose ps

# Check frontend logs
docker-compose logs frontend

# Check backend logs
docker-compose logs backend

# Health checks
curl -f http://localhost:3000
curl -f http://localhost:5000/health

# Check resource usage
docker stats
```

## 🎯 Expected URLs After Fix

- **Frontend**: http://your-vps-ip:3000
- **Backend API**: http://your-vps-ip:5000/api
- **Health Check**: http://your-vps-ip:5000/health

## 📝 Troubleshooting

If still fails after fix:

```bash
# Clean Docker completely
docker system prune -a
docker volume prune

# Rebuild from scratch
cd /home/websmds/WebSMDS
rm -rf node_modules
npm install
docker-compose build --no-cache
docker-compose up -d
```

## 🔄 Push Changes to Git

On your local machine:

```bash
git add frontend/next.config.js
git commit -m "fix: add standalone output for Docker build"
git push origin main
```

Then on VPS:
```bash
cd /home/websmds/WebSMDS
git pull origin main
docker-compose build --no-cache
docker-compose up -d
```