#!/bin/bash
# Development script that runs frontend with service binding to backend
# Backend must be running at port 9999

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "Starting frontend development server with backend binding..."

# Check if backend is running
if curl -s http://localhost:9999/api/v1/health > /dev/null 2>&1; then
  echo -e "${GREEN}Backend is running at http://localhost:9999${NC}"
else
  echo -e "${RED}Warning: Backend not responding at http://localhost:9999${NC}"
  echo "Start the backend first: cd ../api && make dev"
  echo ""
  echo "Continuing anyway (Vite will proxy /api/* to backend)..."
fi

# Run Vite development server
# The proxy configuration in vite.config.ts will handle /api/* requests
exec pnpm exec vite --port 5174
