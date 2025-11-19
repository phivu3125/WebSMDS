# WebSMDS Deployment Guide

This guide will help you deploy the WebSMDS application to production using Docker containers on Hostinger VPS or any other cloud provider.

## 🚀 Quick Start

### Prerequisites

- **Server**: Linux VPS (Ubuntu 20.04+ recommended)
- **Domain**: Optional, but recommended for SSL
- **Git**: Repository URL for your project
- **SSH**: Access to your VPS

### One-Click Deployment

1. **Connect to your VPS:**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Clone and setup:**
   ```bash
   git clone <your-repository-url>
   cd WebSMDS
   chmod +x deploy.sh
   sudo ./deploy.sh
   ```

That's it! The script will handle everything automatically.

---

## 📋 Detailed Deployment Steps

### 1. Server Setup

#### Install System Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx
```

#### Install Docker & Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable docker
sudo systemctl start docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Application Setup

#### Clone Repository
```bash
# Create application directory
sudo mkdir -p /var/www/websmds
sudo chown $USER:$USER /var/www/websmds

# Clone your project
git clone <your-repository-url> /var/www/websmds
cd /var/www/websmds
```

#### Configure Environment Variables
```bash
# Copy environment templates
cp .env.production.example .env.production
cp backend/.env.production backend/.env
cp frontend/.env.production.local frontend/.env.local

# Edit production environment
nano .env.production
```

**Important environment variables to configure:**
- `DB_PASSWORD`: Secure database password
- `JWT_SECRET`: Strong JWT secret (32+ characters)
- `FRONTEND_URL`: Your domain (e.g., https://yourdomain.com)
- `NEXT_PUBLIC_API_URL`: Your API URL (e.g., https://yourdomain.com/api)

### 3. Build and Deploy

#### Option A: Automated Deployment
```bash
# Make script executable and run
chmod +x deploy.sh
sudo ./deploy.sh
```

#### Option B: Manual Deployment
```bash
# Build containers
docker-compose build --no-cache

# Start services
docker-compose up -d

# Run database migrations
docker-compose run --rm backend npm run prisma:migrate

# Optional: Seed initial data
docker-compose run --rm backend npm run seed
```

### 4. SSL Certificate Setup

#### With Domain (Recommended)
```bash
# Replace with your actual domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Without Domain (Local Testing)
Skip SSL setup - you can access via:
- Frontend: `http://your-vps-ip:3000`
- Backend: `http://your-vps-ip:5000`

---

## 🔧 Management Commands

### Application Management
```bash
# View running services
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Update application
git pull
docker-compose build --no-cache
docker-compose up -d
```

### Database Management
```bash
# Run migrations
docker-compose run --rm backend npm run prisma:migrate

# Access database
docker-compose exec db psql -U websmds_user -d websmds

# Backup database
docker-compose exec db pg_dump -U websmds_user websmds > backup.sql

# Restore database
docker-compose exec -T db psql -U websmds_user websmds < backup.sql
```

### Monitoring
```bash
# Check resource usage
docker stats

# View system logs
sudo journalctl -u websmds

# Check disk space
df -h
```

---

## 📁 Directory Structure

After deployment, your application structure:

```
/var/www/websmds/
├── backend/
│   ├── Dockerfile
│   ├── dist/          # Compiled TypeScript
│   └── uploads/       # User uploaded files
├── frontend/
│   ├── Dockerfile
│   └── .next/         # Next.js build output
├── docker-compose.yml
├── .env.production
└── logs/              # Application logs

/var/log/websmds/      # System logs
/var/backups/websmds/  # Database backups
```

---

## 🔒 Security Considerations

### Firewall Setup
```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Security Best Practices
1. **Strong Passwords**: Use secure database and JWT secrets
2. **Regular Updates**: Keep system and Docker images updated
3. **Backups**: Set up automated database backups
4. **SSL**: Always use HTTPS in production
5. **Monitoring**: Monitor logs and system resources

### Auto-Updates Setup
```bash
# Create backup script
cat > /usr/local/bin/websmds-backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p /var/backups/websmds
docker-compose exec -T db pg_dump -U websmds_user websmds > /var/backups/websmds/backup_$DATE.sql
# Keep only last 7 days of backups
find /var/backups/websmds -name "*.sql" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/websmds-backup.sh

# Add to crontab for daily backups at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/websmds-backup.sh") | crontab -
```

---

## 🚨 Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Check container status
docker-compose ps

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### Database Connection Issues
```bash
# Check database status
docker-compose exec db pg_isready -U websmds_user -d websmds

# Reset database (WARNING: Deletes all data)
docker-compose down -v
docker-compose up -d db
docker-compose run --rm backend npm run prisma:migrate
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test nginx configuration
sudo nginx -t
sudo systemctl reload nginx
```

#### Performance Issues
```bash
# Check resource usage
docker stats
free -h
df -h

# Clear Docker cache
docker system prune -a
```

### Getting Help

1. **Check logs**: Always check application logs first
2. **Verify configuration**: Ensure environment variables are correct
3. **Check resources**: Monitor CPU, memory, and disk usage
4. **Network issues**: Verify firewall and port configurations

---

## 🔄 Updating Your Application

### Simple Update
```bash
cd /var/www/websmds
git pull
docker-compose build --no-cache
docker-compose up -d
```

### Zero-Downtime Update (Advanced)
```bash
# Pull latest changes
git pull

# Build new images
docker-compose build

# Start new services alongside existing ones
docker-compose up -d --no-deps backend frontend

# Verify new deployment
curl -f http://localhost:5000/health
curl -f http://localhost:3000

# If successful, remove old containers
docker-compose up -d
```

---

## 📊 Monitoring and Maintenance

### Health Checks
The application includes built-in health checks:
- **Backend**: `GET /health`
- **Frontend**: `GET /` (root)

### Monitoring Tools
Consider setting up:
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry (for frontend errors)
- **Performance monitoring**: New Relic, DataDog

### Backup Strategy
1. **Database**: Daily automated backups
2. **User uploads**: Sync to cloud storage
3. **Configuration**: Version control all config files

---

## 🎯 Next Steps

1. **Domain Setup**: Point your domain to the VPS
2. **SSL Certificate**: Install SSL with certbot
3. **Monitoring**: Set up monitoring and alerts
4. **Backups**: Verify backup automation
5. **Performance**: Optimize for your traffic

---

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting section](#-troubleshooting)
2. Review application logs: `docker-compose logs -f`
3. Verify environment configuration
4. Check system resources and networking

Your WebSMDS application is now running in production! 🎉