#!/bin/bash

# PostgreSQL Database Setup Script for Blogger App

set -e

echo "🚀 Setting up PostgreSQL database for Blogger App..."

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

# Load environment variables
if [ -f .env ]; then
    source .env
else
    print_error ".env file not found!"
    exit 1
fi

print_header "Database Setup"
echo "Database URL: $DATABASE_URL"
echo "Host: $DB_HOST:$DB_PORT"
echo "Database: $DB_DATABASE"
echo "Username: $DB_USERNAME"
echo ""

# Install dependencies
print_status "Installing dependencies..."
npm install

# Generate Prisma client
print_status "Generating Prisma client..."
npm run prisma:generate

# Push database schema
print_status "Creating database schema..."
npm run db:push

# Seed the database
print_status "Seeding database with initial data..."
npm run prisma:seed

print_header "✅ Database setup complete!"
echo ""
echo "🎉 Your database is ready!"
echo ""
echo "📊 You can view your database with:"
echo "  npm run db:studio"
echo ""
echo "🚀 Start the server with:"
echo "  npm run start:dev"
echo ""
echo "👤 Demo user credentials:"
echo "  Username: admin"
echo "  Password: password123"
echo ""
