#!/bin/bash

# Setup script for NestJS Blogger App
# This script sets up the development environment

set -e

echo "🚀 Setting up NestJS Blogger App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 16 or higher."
    exit 1
fi

print_status "Node.js version: $NODE_VERSION ✓"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_status "npm version: $(npm -v) ✓"

# Install dependencies
print_status "Installing dependencies..."
npm install

# Check if MySQL is running
if command -v mysql &> /dev/null; then
    if mysql -e "SELECT 1" &> /dev/null; then
        print_status "MySQL is running ✓"
    else
        print_warning "MySQL is installed but not running. Please start MySQL service."
    fi
else
    print_warning "MySQL is not installed. Please install MySQL 8.0 or use Docker."
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file..."
    cp .env .env.example 2>/dev/null || true
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
    print_status "Created .env file. Please update database credentials."
else
    print_status ".env file already exists ✓"
fi

# Create database if MySQL is available
if command -v mysql &> /dev/null && mysql -e "SELECT 1" &> /dev/null; then
    print_status "Creating database..."
    mysql -e "CREATE DATABASE IF NOT EXISTS blogger_db;" 2>/dev/null || print_warning "Could not create database. Please create it manually."
fi

# Build the application
print_status "Building the application..."
npm run build

print_status "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update database credentials in .env file"
echo "2. Create the database: CREATE DATABASE blogger_db;"
echo "3. Run the application: npm run start:dev"
echo "4. Visit http://localhost:3000"
echo ""
echo "For Docker setup, run: docker-compose -f docker-compose.dev.yml up"
