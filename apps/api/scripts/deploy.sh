#!/bin/bash

# Deployment script
set -e

echo "Starting deployment..."

# Build the application
echo "Building application..."
pnpm build

# Run database migrations
echo "Running database migrations..."
pnpm migrate

# Start the server
echo "Starting server..."
pnpm start
