# Workflow: Deploy Frontend

Deploy the frontend to Cloudflare Pages.

## Instructions

1. Ensure backend is deployed first
2. Set environment variables in Cloudflare Dashboard
3. Build and deploy
4. Verify deployment

## Prerequisites

- Backend must be deployed (for service binding)
- Production Supabase project ready

## Steps

### 1. Set Environment Variables

In Cloudflare Dashboard:
1. Go to Pages → your project → Settings → Environment variables
2. Add production variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-production-anon-key
```

### 2. Build Locally (Test)

```bash
cd web
pnpm run build
```

Ensure build succeeds with no errors.

### 3. Deploy

```bash
pnpm run deploy
```

This runs:
```bash
pnpm run build && wrangler pages deploy dist
```

### 4. Verify

Visit the deployed URL (shown in deploy output).

Check:
- [ ] Page loads
- [ ] Login works
- [ ] API calls succeed
- [ ] Auth redirects work

## First Deployment

On first deploy, Wrangler will:
1. Create the Pages project
2. Ask to link to existing project or create new
3. Deploy the `dist/` directory

## Service Binding

The service binding in `web/wrangler.toml` connects to the backend:

```toml
[[services]]
binding = "API"
service = "supaflare-api"
```

Backend must be deployed with the same name.

## Custom Domain

1. Go to Cloudflare Dashboard → Pages → your project
2. Click "Custom domains"
3. Add your domain
4. Update DNS as instructed

## Troubleshooting

### Service Binding Error
Ensure backend Worker exists with the correct name.

### Build Fails
Check TypeScript errors:
```bash
pnpm exec tsc --noEmit
```

### API Calls Fail
Verify:
- Backend is deployed and healthy
- Service binding name matches Worker name
- CORS is configured correctly

## Expected Inputs

- Frontend ready for deployment
- Backend already deployed
- Production environment variables

## Expected Outputs

- Frontend deployed to Cloudflare Pages
- Accessible at Pages URL or custom domain
