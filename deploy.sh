#!/bin/bash

# WebSMDS Production Deployment Script for Hostinger VPS
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting WebSMDS Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="websmds"
DEPLOY_DIR="/var/www/$APP_NAME"
BACKUP_DIR="/var/backups/$APP_NAME"
SERVICE_NAME="$APP_NAME"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Function to backup current deployment
backup_deployment() {
    print_status "Creating backup of current deployment..."

    mkdir -p "$BACKUP_DIR"
    BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="$BACKUP_DIR/backup_$BACKUP_DATE"

    if [ -d "$DEPLOY_DIR" ]; then
        cp -r "$DEPLOY_DIR" "$BACKUP_PATH"

        # Backup database if exists
        if docker-compose -f "$DEPLOY_DIR/docker-compose.yml" ps db | grep -q "Up"; then
            mkdir -p "$BACKUP_PATH/database"
            docker-compose -f "$DEPLOY_DIR/docker-compose.yml" exec -T db pg_dump -U websmds_user websmds > "$BACKUP_PATH/database/backup_$BACKUP_DATE.sql"
        fi

        print_success "Backup created at $BACKUP_PATH"
    else
        print_warning "No existing deployment to backup"
    fi
}

# Function to update system packages
update_system() {
    print_status "Updating system packages..."
    apt update && apt upgrade -y
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing system dependencies..."

    # Install Docker if not present
    if ! command -v docker &> /dev/null; then
        print_status "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        systemctl enable docker
        systemctl start docker
    fi

    # Install Docker Compose if not present
    if ! command -v docker-compose &> /dev/null; then
        print_status "Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi

    # Install other utilities
    apt install -y curl wget git nginx certbot python3-certbot-nginx
}

# Function to setup application directory
setup_app_directory() {
    print_status "Setting up application directory..."

    mkdir -p "$DEPLOY_DIR"
    chown -R $SUDO_USER:$SUDO_USER "$DEPLOY_DIR"

    # Create logs directory
    mkdir -p "/var/log/$APP_NAME"
    chown -R $SUDO_USER:$SUDO_USER "/var/log/$APP_NAME"
}

# Function to clone or update repository
setup_repository() {
    print_status "Setting up application repository..."

    cd "$DEPLOY_DIR"

    if [ -d ".git" ]; then
        print_status "Pulling latest changes..."
        git pull origin main
    else
        print_status "Cloning repository..."
        # Replace with your actual repository URL
        read -p "Enter your Git repository URL: " REPO_URL
        git clone "$REPO_URL" .
    fi

    chown -R $SUDO_USER:$SUDO_USER "$DEPLOY_DIR"
}

# Function to setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."

    cd "$DEPLOY_DIR"

    if [ ! -f .env.production ]; then
        print_warning ".env.production not found. Creating from template..."
        cp .env.production.example .env.production

        print_warning "Please edit .env.production with your production values:"
        print_warning "  - Database credentials"
        print_warning "  - JWT secrets"
        print_warning "  - Domain names"

        read -p "Press Enter to continue after editing .env.production..."
    fi

    # Setup frontend environment
    cp frontend/.env.production.local.example frontend/.env.production.local 2>/dev/null || true
}

# Function to build and start services
build_and_start() {
    print_status "Building and starting application services..."

    cd "$DEPLOY_DIR"

    # Stop existing services
    docker-compose down --remove-orphans || true

    # Build and start services
    docker-compose build --no-cache
    docker-compose up -d

    print_status "Waiting for services to start..."
    sleep 30
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."

    cd "$DEPLOY_DIR"
    docker-compose run --rm backend npm run prisma:migrate

    # Optional: Seed initial data
    read -p "Do you want to seed initial data? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose run --rm backend npm run seed
    fi
}

# Function to setup SSL certificates
setup_ssl() {
    print_status "Setting up SSL certificates..."

    read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME

    if [ -n "$DOMAIN_NAME" ]; then
        # Setup Nginx configuration
        cat > "/etc/nginx/sites-available/$APP_NAME" << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

        ln -sf "/etc/nginx/sites-available/$APP_NAME" "/etc/nginx/sites-enabled/"
        nginx -t && systemctl reload nginx

        # Get SSL certificate
        certbot --nginx -d "$DOMAIN_NAME" -d "www.$DOMAIN_NAME" --non-interactive --agree-tos --email admin@"$DOMAIN_NAME" || {
            print_warning "SSL certificate setup failed. You can run this later:"
            print_warning "  certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
        }
    fi
}

# Function to setup auto-restart
setup_autorestart() {
    print_status "Setting up auto-restart..."

    # Create systemd service for Docker Compose
    cat > "/etc/systemd/system/$APP_NAME.service" << EOF
[Unit]
Description=WebSMDS Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$DEPLOY_DIR
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable "$APP_NAME"
}

# Function to verify deployment
verify_deployment() {
    print_status "Verifying deployment..."

    sleep 10

    # Check if services are running
    if docker-compose -f "$DEPLOY_DIR/docker-compose.yml" ps | grep -q "Up"; then
        print_success "Services are running ✓"
    else
        print_error "Some services are not running ✗"
        docker-compose -f "$DEPLOY_DIR/docker-compose.yml" ps
    fi

    # Check health endpoints
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        print_success "Backend health check passed ✓"
    else
        print_error "Backend health check failed ✗"
    fi

    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend health check passed ✓"
    else
        print_error "Frontend health check failed ✗"
    fi
}

# Main deployment function
main() {
    print_status "Starting WebSMDS deployment to Hostinger VPS..."

    # Run deployment steps
    backup_deployment
    update_system
    install_dependencies
    setup_app_directory
    setup_repository
    setup_environment
    build_and_start
    run_migrations
    setup_ssl
    setup_autorestart
    verify_deployment

    echo
    print_success "🎉 Deployment completed successfully!"
    echo
    echo "🌐 Application Information:"
    echo "   Deployment Directory: $DEPLOY_DIR"
    echo "   Logs Directory: /var/log/$APP_NAME"
    echo "   Backup Directory: $BACKUP_DIR"
    echo
    echo "🔧 Management Commands:"
    echo "   View logs: docker-compose -f $DEPLOY_DIR/docker-compose.yml logs -f"
    echo "   Restart app: systemctl restart $APP_NAME"
    echo "   Stop app: systemctl stop $APP_NAME"
    echo "   Update app: cd $DEPLOY_DIR && git pull && docker-compose build && docker-compose up -d"
    echo
    echo "📊 Monitoring:"
    echo "   Check status: docker-compose -f $DEPLOY_DIR/docker-compose.yml ps"
    echo "   View resources: docker stats"
    echo
    print_success "Your WebSMDS application is now live! 🚀"
}

# Run the deployment
main "$@"