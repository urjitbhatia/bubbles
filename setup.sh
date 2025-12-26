#!/bin/bash
# Quick setup script for the template
# Usage: ./setup.sh [project-name]

set -e

PROJECT_NAME=${1:-supaflare}

echo "Setting up project: $PROJECT_NAME"
echo ""

# Update project names in config files
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/supaflare-web/${PROJECT_NAME}-web/g" web/wrangler.toml
  sed -i '' "s/supaflare-api/${PROJECT_NAME}-api/g" web/wrangler.toml
  sed -i '' "s/supaflare-api/${PROJECT_NAME}-api/g" api/wrangler.jsonc
  sed -i '' "s/supaflare-storage/${PROJECT_NAME}-storage/g" api/wrangler.jsonc
  sed -i '' "s/\"name\": \"web\"/\"name\": \"${PROJECT_NAME}-web\"/g" web/package.json
  sed -i '' "s/name = \"supaflare-api\"/name = \"${PROJECT_NAME}-api\"/g" api/pyproject.toml
else
  # Linux
  sed -i "s/supaflare-web/${PROJECT_NAME}-web/g" web/wrangler.toml
  sed -i "s/supaflare-api/${PROJECT_NAME}-api/g" web/wrangler.toml
  sed -i "s/supaflare-api/${PROJECT_NAME}-api/g" api/wrangler.jsonc
  sed -i "s/supaflare-storage/${PROJECT_NAME}-storage/g" api/wrangler.jsonc
  sed -i "s/\"name\": \"web\"/\"name\": \"${PROJECT_NAME}-web\"/g" web/package.json
  sed -i "s/name = \"supaflare-api\"/name = \"${PROJECT_NAME}-api\"/g" api/pyproject.toml
fi

echo "Installing frontend dependencies..."
cd web && pnpm install && cd ..

echo ""
echo "Installing backend dependencies..."
cd api && uv sync && cd ..

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Start Supabase:  cd api && supabase start"
echo "  2. Copy env files:  cp web/.env.example web/.env.local"
echo "                      cp api/.dev.vars.example api/.dev.vars"
echo "  3. Update .env files with Supabase keys from step 1"
echo "  4. Start backend:   cd api && make dev"
echo "  5. Start frontend:  cd web && pnpm run dev:with-binding"
echo ""
echo "Happy coding!"
