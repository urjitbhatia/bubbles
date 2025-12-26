.PHONY: dev local test lint deploy

# Development with Cloudflare Workers runtime (port 9999)
dev:
	uv run pywrangler dev --env dev --persist-to .wrangler/state

# Development with remote resources
dev-remote:
	uv run pywrangler dev --env dev --remote

# Local FastAPI server (no Workers runtime)
local:
	uv run uvicorn src.httpserver:webapp --reload --host 0.0.0.0 --port 8000

# Run tests
test:
	uv run pytest -v

# Run tests with coverage
test-cov:
	uv run pytest --cov=src --cov-report=html

# Lint code
lint:
	uv run ruff check src tests
	uv run ruff format --check src tests

# Format code
format:
	uv run ruff check --fix src tests
	uv run ruff format src tests

# Deploy to Cloudflare Workers
deploy:
	uv run pywrangler deploy

# Supabase shortcuts
db-push:
	supabase db push

db-reset:
	supabase db reset

db-migrate:
	supabase migration new $(name)
