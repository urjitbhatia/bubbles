---
name: deploy
description: Cloudflare deployment for frontend (Pages) and backend (Workers). Covers secrets, environment variables, custom domains, and production configuration.
---

# Skill: Deploy

Deployment to Cloudflare Workers and Pages.

## Routing Logic

Analyze the user's intent and route to the appropriate workflow:

**Deploy Backend** → `workflows/deploy-backend.md`
- "Deploy the backend"
- "Deploy Python API"
- "Deploy Rust API"
- "Push backend to production"

**Deploy Frontend** → `workflows/deploy-frontend.md`
- "Deploy the frontend"
- "Deploy to Cloudflare Pages"
- "Push web to production"

**Manage Secrets** → `workflows/secrets.md`
- "Set production secrets"
- "Add environment variable"
- "Configure Supabase keys"

**Custom Domain** → `workflows/custom-domain.md`
- "Add custom domain"
- "Configure domain for API"
- "Set up DNS"

**Configuration Questions** → `context/config.md`
- "What's the deploy command?"
- "Where do I set secrets?"

## Workflows

- `workflows/deploy-backend.md` - Deploy backend to Workers
- `workflows/deploy-frontend.md` - Deploy frontend to Pages
- `workflows/secrets.md` - Manage secrets and env vars
- `workflows/custom-domain.md` - Configure custom domains

## Context

- `context/config.md` - Deployment configuration
- `context/checklist.md` - Pre-deployment checklist
