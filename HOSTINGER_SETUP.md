# WebSMDS Hostinger VPS Setup Guide

This guide provides specific instructions for deploying WebSMDS on Hostinger VPS.

## 🏗️ Hostinger VPS Setup

### 1. Purchase and Configure VPS

1. **Log in to Hostinger Dashboard**
2. **Navigate to VPS section**
3. **Choose a VPS plan** (minimum 2GB RAM, 2 CPU cores recommended)
4. **Select Ubuntu 20.04 or 22.04** as operating system
5. **Complete purchase** and wait for VPS provisioning

### 2. Initial VPS Configuration

#### Access Your VPS
```bash
# SSH into your VPS using provided credentials
ssh root@your-vps-ip-address

# Or use Hostinger's browser-based terminal
```

#### Update System
```bash
apt update && apt upgrade -y
```

#### Create Non-Root User (Recommended)
```bash
# Create new user
adduser websmds

# Give sudo privileges
usermod -aG sudo websmds

# Switch to new user
su - websmds
```

### 3. Hostinger-Specific Configurations

#### Firewall Configuration
Hostinger may have pre-configured firewall rules:

```bash
# Check current firewall status
ufw status

# Allow essential ports
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

#### Hostinger Control Panel Integration

If using Hostinger's control panel:

1. **Domain Management**: Point your domain to VPS IP
2. **DNS Settings**: Configure A records for your domain
3. **SSL Certificates**: Use Hostinger's free SSL or Let's Encrypt

---

## 🚀 Deployment on Hostinger

### Option 1: Using Hostinger's Auto-Deploy Script

Hostinger provides one-click deployment for popular applications:

1. **Navigate to VPS Dashboard**
2. **Go to "Auto-Deploy" section**
3. **Upload your project files**
4. **Configure environment variables**
5. **Click "Deploy"**

### Option 2: Manual Docker Deployment (Recommended)

#### Step 1: Prepare VPS
```bash
# Install Docker on Hostinger Ubuntu VPS
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable docker
sudo systemctl start docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Step 2: Clone and Deploy
```bash
# Clone your repository
git clone <your-github-repository-url>
cd WebSMDS

# Make deploy script executable
chmod +x deploy.sh

# Run deployment
sudo ./deploy.sh
```

---

## 🌐 Domain Configuration with Hostinger

### Using Hostinger Domain

1. **Navigate to Domains section** in Hostinger dashboard
2. **Click "Manage"** on your domain
3. **Go to DNS Settings**
4. **Add/Update A records**:
   ```
   Type: A
   Name: @
   TTL: 3600
   Points to: your-vps-ip

   Type: A
   Name: www
   TTL: 3600
   Points to: your-vps-ip
   ```

### Using External Domain

1. **Log in to your domain registrar**
2. **Go to DNS management**
3. **Update nameservers** to Hostinger's nameservers:
   ```
   ns1.hostinger.com
   ns2.hostinger.com
   ns3.hostinger.com
   ns4.hostinger.com
   ```

---

## 🔒 SSL Certificate Setup

### Option 1: Hostinger Free SSL

1. **Go to Hostinger Dashboard**
2. **Navigate to SSL Certificates**
3. **Select your domain**
4. **Install free Let's Encrypt certificate**

### Option 2: Manual Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 3: Cloudflare SSL (Recommended for Performance)

1. **Sign up for Cloudflare free account**
2. **Add your website**
3. **Update nameservers to Cloudflare**
4. **Enable "Full SSL" in Crypto settings**
5. **Enable "Always HTTPS"**

---

## 📊 Hostinger Monitoring

### Hostinger Built-in Monitoring

1. **VPS Dashboard**: Monitor CPU, RAM, and disk usage
2. **Uptime Monitoring**: Basic uptime checks
3. **Bandwidth Tracking**: Monitor data transfer

### Enhanced Monitoring Setup

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Create monitoring script
cat > /usr/local/bin/websmds-monitor.sh << 'EOF'
#!/bin/bash
echo "=== WebSMDS System Status ==="
echo "Time: $(date)"
echo ""
echo "Docker Containers:"
docker-compose ps
echo ""
echo "Resource Usage:"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')"
echo "Memory: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 " used)"}')"
echo ""
echo "Service Health:"
curl -s http://localhost:5000/health > /dev/null && echo "Backend: ✓ Healthy" || echo "Backend: ✗ Unhealthy"
curl -s http://localhost:3000 > /dev/null && echo "Frontend: ✓ Healthy" || echo "Frontend: ✗ Unhealthy"
EOF

chmod +x /usr/local/bin/websmds-monitor.sh
```

---

## 🔧 Hostinger-Specific Optimizations

### Performance Optimization

1. **VPS Resources**: Monitor and upgrade if needed
2. **CDN Integration**: Consider Cloudflare CDN
3. **Database Optimization**: Regular maintenance and backups

### Backup Strategy

```bash
# Hostinger backup integration
cat > /usr/local/bin/hostinger-backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/tmp/websmds-backup-$DATE"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database
docker-compose exec -T db pg_dump -U websmds_user websmds > "$BACKUP_DIR/database.sql"

# Backup uploads
cp -r /var/www/websmds/backend/uploads "$BACKUP_DIR/"

# Backup configuration
cp /var/www/websmds/.env.production "$BACKUP_DIR/"

# Create compressed backup
tar -czf "/tmp/websmds-backup-$DATE.tar.gz" -C /tmp "websmds-backup-$DATE"

# Upload to Hostinger's backup storage (if available) or external service
# Example: scp to remote server or use rclone for cloud storage

# Cleanup
rm -rf "$BACKUP_DIR"
echo "Backup completed: /tmp/websmds-backup-$DATE.tar.gz"
EOF

chmod +x /usr/local/bin/hostinger-backup.sh

# Add to crontab for automatic backups
(crontab -l 2>/dev/null; echo "0 3 * * * /usr/local/bin/hostinger-backup.sh") | crontab -
```

---

## 🚨 Hostinger Troubleshooting

### Common Hostinger Issues

#### VPS Performance Issues
```bash
# Check VPS resources
free -h
df -h
top

# Restart services if needed
sudo systemctl restart docker
docker-compose restart
```

#### Network Issues
```bash
# Check if ports are open
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# Test DNS resolution
nslookup yourdomain.com
```

#### SSL Certificate Issues
```bash
# Check SSL status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Check nginx configuration
sudo nginx -t
```

### Hostinger Support Integration

If you encounter Hostinger-specific issues:

1. **Check Hostinger Knowledge Base**
2. **Submit support ticket** through Hostinger dashboard
3. **Include error logs**: `/var/log/websmds/`
4. **Provide VPS details**: IP address, plan, OS version

---

## 💡 Hostinger Best Practices

### Security
1. **Regular Updates**: Keep system and Docker images updated
2. **SSH Security**: Use SSH keys, disable password authentication
3. **Firewall**: Configure UFW firewall properly
4. **Monitoring**: Set up alerts for unusual activity

### Performance
1. **Resource Monitoring**: Regularly check CPU, RAM, and disk usage
2. **CDN Usage**: Use Cloudflare for better performance
3. **Database Optimization**: Regular maintenance and indexing
4. **Caching**: Implement Redis caching if needed

### Cost Optimization
1. **Resource Usage**: Monitor and optimize resource consumption
2. **Backups**: Use efficient backup strategies
3. **Scaling**: Upgrade VPS plan as traffic grows

---

## 📞 Hostinger Support Resources

- **Documentation**: https://support.hostinger.com/
- **Community**: https://community.hostinger.com/
- **Tutorials**: Available in Hostinger dashboard
- **24/7 Support**: Through hosting dashboard

Your WebSMDS application is now optimized for Hostinger VPS! 🎉

---

## 🔄 Maintenance Schedule

### Daily
- Check application health
- Monitor resource usage
- Review logs for errors

### Weekly
- Update Docker images
- Check SSL certificate status
- Review backup logs

### Monthly
- System updates
- Security audit
- Performance review
- Backup restoration testing

---

## 🚀 Next Steps

1. **Domain Setup**: Configure your domain with Hostinger
2. **SSL Certificate**: Install SSL certificate
3. **Monitoring**: Set up monitoring and alerts
4. **Backups**: Verify backup automation
5. **Performance**: Optimize based on your traffic patterns

---

**Note**: This guide is specifically tailored for Hostinger VPS. For general deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).