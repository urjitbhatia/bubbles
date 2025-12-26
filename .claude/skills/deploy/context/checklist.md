# Pre-Deployment Checklist

## Before First Deploy

- [ ] Cloudflare account set up
- [ ] Logged in: `wrangler login`
- [ ] Supabase production project created
- [ ] Production database migrated
- [ ] Production environment variables ready

## Before Each Deploy

### Backend
- [ ] Tests passing: `make test`
- [ ] No lint errors: `make lint`
- [ ] Secrets configured in Cloudflare

### Frontend
- [ ] TypeScript compiles: `pnpm exec tsc --noEmit`
- [ ] Build succeeds: `pnpm run build`
- [ ] Types up-to-date: `pnpm run generate-types`
- [ ] Environment variables set in dashboard

## After Deploy

- [ ] Health check passes: `curl https://api.yourdomain.com/api/v1/health`
- [ ] Frontend loads correctly
- [ ] Auth flow works
- [ ] API calls succeed

## Rollback

### Backend
```bash
# List deployments
wrangler deployments list

# Rollback to previous
wrangler rollback
```

### Frontend
Rollback via Cloudflare Dashboard:
Pages → Deployments → Select previous → Rollback

## Monitoring

- Cloudflare Dashboard → Workers → Analytics
- Cloudflare Dashboard → Pages → Functions
- Check for errors in real-time logs
