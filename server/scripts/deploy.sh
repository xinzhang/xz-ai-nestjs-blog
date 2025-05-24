#!/bin/bash

# Production deployment script
# This script deploys the NestJS Blogger App to production

set -e

echo "🚀 Deploying NestJS Blogger App to Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

# Configuration
APP_NAME="nestjs-blogger"
DOCKER_IMAGE="$APP_NAME:latest"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"

# Pre-deployment checks
print_header "Running pre-deployment checks..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install docker-compose."
    exit 1
fi

print_status "Docker and docker-compose are installed ✓"

# Create backup directory
print_status "Creating backup directory..."
mkdir -p "$BACKUP_DIR"

# Backup database if MySQL container is running
if docker-compose ps mysql | grep -q "Up"; then
    print_status "Backing up database..."
    docker-compose exec -T mysql mysqldump -u blogger_user -pblogger_password blogger_db > "$BACKUP_DIR/database_backup.sql"
    print_status "Database backup created: $BACKUP_DIR/database_backup.sql"
fi

# Pull latest code (if using git)
if [ -d ".git" ]; then
    print_status "Pulling latest code..."
    git pull origin main
fi

# Build new Docker image
print_header "Building Docker image..."
docker build -t "$DOCKER_IMAGE" .

# Run tests
print_header "Running tests..."
docker run --rm "$DOCKER_IMAGE" npm test || {
    print_error "Tests failed. Deployment aborted."
    exit 1
}

print_status "All tests passed ✓"

# Stop existing containers
print_header "Stopping existing containers..."
docker-compose down

# Start new containers
print_header "Starting new containers..."
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Health check
print_header "Running health checks..."
HEALTH_URL="http://localhost/health"

for i in {1..10}; do
    if curl -f "$HEALTH_URL" > /dev/null 2>&1; then
        print_status "Health check passed ✓"
        break
    fi
    
    if [ $i -eq 10 ]; then
        print_error "Health check failed. Rolling back..."
        
        # Rollback
        docker-compose down
        
        # Restore database if backup exists
        if [ -f "$BACKUP_DIR/database_backup.sql" ]; then
            docker-compose up -d mysql
            sleep 10
            docker-compose exec -T mysql mysql -u blogger_user -pblogger_password blogger_db < "$BACKUP_DIR/database_backup.sql"
        fi
        
        exit 1
    fi
    
    print_status "Waiting for services... ($i/10)"
    sleep 10
done

# Clean up old Docker images
print_status "Cleaning up old Docker images..."
docker image prune -f

# Show deployment summary
print_header "Deployment Summary"
echo "✅ Deployment completed successfully!"
echo "🔗 Application URL: http://localhost"
echo "📊 Health Check: $HEALTH_URL"
echo "💾 Backup Location: $BACKUP_DIR"
echo "🐳 Running Containers:"
docker-compose ps

print_status "Deployment completed at $(date)"
