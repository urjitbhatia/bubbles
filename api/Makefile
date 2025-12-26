.PHONY: help install dev dev-remote local test test-cov lint format deploy clean db-push db-reset db-migrate

help:
	@echo "Available commands:"
	@echo "  make install     - Install project dependencies"
	@echo "  make dev         - Run dev server with Cloudflare Workers runtime (port 9990)"
	@echo "  make dev-remote  - Run dev server with remote resources"
	@echo "  make local       - Run local FastAPI server with uvicorn (port 8000)"
	@echo "  make test        - Run tests"
	@echo "  make test-cov    - Run tests with coverage report"
	@echo "  make lint        - Run linting checks"
	@echo "  make format      - Format code"
	@echo "  make deploy      - Deploy to Cloudflare Workers"
	@echo "  make clean       - Clean up cache and temporary files"
	@echo "  make db-push     - Push database migrations to Supabase"
	@echo "  make db-reset    - Reset database (local)"
	@echo "  make db-migrate  - Create new migration (name=xxx)"

install:
	uv sync
	pnpm install

# Development with Cloudflare Workers runtime (port 9990)
dev:
	uv run pywrangler dev --env dev

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
	uv run pytest --cov=src --cov-report=html --cov-report=term

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

# Clean up
clean:
	rm -rf .pytest_cache
	rm -rf .ruff_cache
	rm -rf htmlcov
	rm -rf .coverage
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
