#!/bin/bash

# Health check script
set -e

# Check if server is running
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✓ Server is healthy"
    exit 0
else
    echo "✗ Server is not responding"
    exit 1
fi
