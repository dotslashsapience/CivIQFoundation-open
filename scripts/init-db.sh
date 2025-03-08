#!/bin/bash

# CivIQ - A civic discourse platform
# Copyright (c) 2025 CivIQ Foundation
# 
# This software is licensed under the CivIQ Ethical Licensing Agreement,
# based on the Hippocratic License with additional provisions.
# See LICENSE.md and TERMS_OF_USE.md for full details.
# 
# By using this software, you agree to uphold CivIQ's mission of fostering
# meaningful, evidence-based discussions and combating misinformation.

# This script initializes the PostgreSQL database for CivIQ

set -e

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Default values
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-civiq}
DB_USER=${DB_USER:-postgres}
DB_PASS=${DB_PASS:-postgres}

# Check if database exists
echo "Checking if database exists..."
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
  read -p "Database $DB_NAME already exists. Do you want to drop it and recreate? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Dropping database $DB_NAME..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "DROP DATABASE $DB_NAME;"
  else
    echo "Exiting without making changes."
    exit 0
  fi
fi

# Create the database
echo "Creating database $DB_NAME..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

# Create extensions
echo "Creating extensions..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"

# Run schema script
echo "Applying database schema..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f src/backend/src/db/schema.sql

# Create admin user (for development environments)
if [ "$NODE_ENV" = "development" ]; then
  echo "Creating admin user for development..."
  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
    INSERT INTO users (email, username, password_hash, is_verified, is_admin) 
    VALUES ('admin@civiq.us', 'admin', crypt('admin123', gen_salt('bf')), true, true);
    
    INSERT INTO user_profiles (id, bio, reputation)
    VALUES ((SELECT id FROM users WHERE username = 'admin'), 'CivIQ Administrator', 1000);
  "
fi

echo "Database initialization complete!"