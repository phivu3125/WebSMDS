#!/bin/bash

# WebSMDS Production Build Script
# This script builds the entire application for production deployment

set -e  # Exit on any error

echo "🚀 Starting WebSMDS Production Build..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    print_warning ".env.production file not found. Creating from template..."
    cp .env.production.example .env.production
    print_warning "Please edit .env.production file with your actual values before running this script again."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs
mkdir -p database-init
mkdir -p backups

# Stop any existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans || true

# Clean up old images (optional)
print_status "Cleaning up old Docker images..."
docker system prune -f || true

# Build the application
print_status "Building Docker images..."
docker-compose build --no-cache --parallel

# Run database migrations
print_status "Running database migrations..."
docker-compose run --rm backend npm run prisma:migrate || true

# Seed initial data (optional)
read -p "Do you want to seed initial data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Seeding initial data..."
    docker-compose run --rm backend npm run seed || true
fi

# Run health checks
print_status "Running health checks..."
docker-compose up -d

echo
print_status "Waiting for services to be healthy..."
sleep 30

# Check if services are healthy
print_status "Checking service health..."

# Check backend health
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_success "Backend is healthy ✓"
else
    print_error "Backend health check failed ✗"
fi

# Check frontend health
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is healthy ✓"
else
    print_error "Frontend health check failed ✗"
fi

# Check database connection
if docker-compose exec -T db pg_isready -U websmds_user -d websmds > /dev/null 2>&1; then
    print_success "Database is healthy ✓"
else
    print_error "Database health check failed ✗"
fi

echo
print_success "🎉 Build completed successfully!"
echo
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Database: localhost:5432"
echo
echo "🔧 Management Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo
echo "📊 Monitoring Commands:"
echo "   View running containers: docker-compose ps"
echo "   View resource usage: docker stats"
echo
print_status "To deploy to production, run: ./deploy.sh"