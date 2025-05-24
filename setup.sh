#!/bin/bash

# Full Stack Blogger App Setup Script
# This script sets up both backend and frontend

set -e

echo "🚀 Setting up Full Stack Blogger App..."

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
    echo -e "${BLUE}[SETUP]${NC} $1"
}

# Check prerequisites
print_header "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
print_status "Node.js version: $NODE_VERSION ✓"

# Setup Backend
print_header "Setting up Backend (NestJS)..."
cd server

print_status "Installing backend dependencies..."
npm install

if [ ! -f .env ]; then
    print_status "Creating backend .env file..."
    cat > .env << EOF
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=blogger_db

# JWT
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# App
PORT=3000
NODE_ENV=development
EOF
    print_status "Created .env file with secure JWT secret ✓"
else
    print_status "Backend .env file already exists ✓"
fi

print_status "Building backend..."
npm run build

cd ..

# Setup Frontend
print_header "Setting up Frontend (React + Vite)..."
cd web

print_status "Installing frontend dependencies..."
npm install

print_status "Building frontend..."
npm run build

cd ..

# Database setup instructions
print_header "Database Setup Instructions"
echo ""
echo "Please set up your MySQL database:"
echo "1. Install MySQL 8.0 if not already installed"
echo "2. Create the database:"
echo "   mysql -u root -p"
echo "   CREATE DATABASE blogger_db;"
echo ""
echo "3. Update database credentials in server/.env file"
echo ""

# Docker setup
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    print_header "Docker Setup Available"
    echo ""
    echo "You can also run the entire stack with Docker:"
    echo "  docker-compose -f docker-compose.dev.yml up"
    echo ""
    print_status "This will start:"
    echo "  • Backend API: http://localhost:3000"
    echo "  • Frontend: http://localhost:3001"
    echo "  • Database: MySQL on port 3306"
    echo "  • Adminer: http://localhost:8080"
    echo ""
fi

# Final instructions
print_header "Setup Complete! 🎉"
echo ""
echo "To start development:"
echo ""
echo "📦 Backend (Terminal 1):"
echo "  cd server"
echo "  npm run start:dev"
echo ""
echo "🌐 Frontend (Terminal 2):"
echo "  cd web"
echo "  npm run dev"
echo ""
echo "🐳 Or use Docker:"
echo "  docker-compose -f docker-compose.dev.yml up"
echo ""
echo "📍 Access Points:"
echo "  • Frontend: http://localhost:3001"
echo "  • Backend API: http://localhost:3000"
echo "  • API Health: http://localhost:3000/health"
echo ""
echo "👤 Demo Credentials:"
echo "  • Username: admin"
echo "  • Password: password123"
echo ""
echo "📚 Documentation:"
echo "  • API Docs: http://localhost:3000/docs (when implemented)"
echo "  • Database Schema: server/database/ERD.md"
echo "  • README: README.md"
echo ""
print_status "Happy coding! 🚀"
