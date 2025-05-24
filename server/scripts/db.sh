#!/bin/bash

# Database management script
# This script helps with database operations

set -e

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
    echo -e "${BLUE}[DB]${NC} $1"
}

# Load environment variables
if [ -f .env ]; then
    source .env
else
    print_error ".env file not found. Please create it first."
    exit 1
fi

# Database connection details
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_USERNAME=${DB_USERNAME:-root}
DB_PASSWORD=${DB_PASSWORD:-password}
DB_DATABASE=${DB_DATABASE:-blogger_db}

# Function to execute MySQL commands
execute_mysql() {
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" "$@"
}

# Function to execute MySQL commands on specific database
execute_mysql_db() {
    execute_mysql "$DB_DATABASE" "$@"
}

# Function to check if database exists
database_exists() {
    execute_mysql -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='$DB_DATABASE'" | grep -q "$DB_DATABASE"
}

# Function to create database
create_database() {
    print_header "Creating database '$DB_DATABASE'..."
    execute_mysql -e "CREATE DATABASE IF NOT EXISTS $DB_DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    print_status "Database '$DB_DATABASE' created successfully ✓"
}

# Function to drop database
drop_database() {
    print_warning "This will permanently delete the database '$DB_DATABASE' and all its data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_header "Dropping database '$DB_DATABASE'..."
        execute_mysql -e "DROP DATABASE IF EXISTS $DB_DATABASE;"
        print_status "Database '$DB_DATABASE' dropped successfully ✓"
    else
        print_status "Operation cancelled."
    fi
}

# Function to reset database
reset_database() {
    print_warning "This will drop and recreate the database '$DB_DATABASE'!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        drop_database
        create_database
        seed_database
    else
        print_status "Operation cancelled."
    fi
}

# Function to backup database
backup_database() {
    BACKUP_FILE="backup_${DB_DATABASE}_$(date +%Y%m%d_%H%M%S).sql"
    print_header "Creating backup of database '$DB_DATABASE'..."
    
    mkdir -p ./backups
    mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" > "./backups/$BACKUP_FILE"
    
    print_status "Database backup created: ./backups/$BACKUP_FILE ✓"
}

# Function to restore database from backup
restore_database() {
    if [ -z "$1" ]; then
        print_error "Please specify backup file: $0 restore <backup_file>"
        exit 1
    fi
    
    BACKUP_FILE="$1"
    
    if [ ! -f "$BACKUP_FILE" ]; then
        print_error "Backup file '$BACKUP_FILE' not found."
        exit 1
    fi
    
    print_header "Restoring database from '$BACKUP_FILE'..."
    print_warning "This will overwrite the current database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        execute_mysql_db < "$BACKUP_FILE"
        print_status "Database restored successfully ✓"
    else
        print_status "Operation cancelled."
    fi
}

# Function to seed database
seed_database() {
    print_header "Seeding database with initial data..."
    
    if [ -f "./database/schema.sql" ]; then
        execute_mysql_db < "./database/schema.sql"
        print_status "Database seeded successfully ✓"
    else
        print_warning "Schema file not found. Skipping seed."
    fi
}

# Function to show database status
show_status() {
    print_header "Database Status"
    echo "Host: $DB_HOST:$DB_PORT"
    echo "Database: $DB_DATABASE"
    echo "Username: $DB_USERNAME"
    echo ""
    
    if database_exists; then
        print_status "Database '$DB_DATABASE' exists ✓"
        
        # Show table count
        TABLE_COUNT=$(execute_mysql_db -e "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = '$DB_DATABASE'" | tail -1)
        echo "Tables: $TABLE_COUNT"
        
        # Show table sizes
        echo ""
        print_header "Table Information"
        execute_mysql_db -e "
            SELECT 
                table_name AS 'Table',
                table_rows AS 'Rows',
                ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
            FROM information_schema.tables 
            WHERE table_schema = '$DB_DATABASE'
            ORDER BY (data_length + index_length) DESC;
        "
    else
        print_warning "Database '$DB_DATABASE' does not exist"
    fi
}

# Function to show help
show_help() {
    echo "Database Management Script"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  create          Create the database"
    echo "  drop            Drop the database"
    echo "  reset           Drop and recreate the database"
    echo "  backup          Create a backup of the database"
    echo "  restore <file>  Restore database from backup file"
    echo "  seed            Seed database with initial data"
    echo "  status          Show database status and information"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 create"
    echo "  $0 backup"
    echo "  $0 restore ./backups/backup_blogger_db_20240115_120000.sql"
    echo "  $0 status"
}

# Main script logic
case "$1" in
    "create")
        create_database
        ;;
    "drop")
        drop_database
        ;;
    "reset")
        reset_database
        ;;
    "backup")
        backup_database
        ;;
    "restore")
        restore_database "$2"
        ;;
    "seed")
        seed_database
        ;;
    "status")
        show_status
        ;;
    "help"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
