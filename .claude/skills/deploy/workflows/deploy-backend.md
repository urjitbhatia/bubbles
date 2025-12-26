# Workflow: Deploy Backend

Deploy the backend API to Cloudflare Workers.

## Instructions

1. Ensure secrets are configured
2. Run tests locally
3. Deploy to Cloudflare
4. Verify deployment

## Python Backend

### 1. Configure Secrets (First Time)

```bash
cd api
wrangler secret put SUPABASE_URL
# Enter your production Supabase URL

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Enter your production service role key

wrangler secret put SUPABASE_ANON_KEY
# Enter your production anon key
```

### 2. Test Locally

```bash
make test
make lint
```

### 3. Deploy

```bash
make deploy
```

### 4. Verify

```bash
curl https://your-worker.workers.dev/api/v1/health
```

## Rust Backend

### 1. Configure Secrets (First Time)

```bash
cd api-rust
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put SUPABASE_ANON_KEY
```

### 2. Build and Test

```bash
make build
make size  # Check binary size
```

### 3. Deploy

```bash
make deploy
```

### 4. Verify

```bash
curl https://your-worker.workers.dev/api/v1/health
```

## Custom Domain (Optional)

Edit wrangler config to add routes:

```json
"routes": [{
  "pattern": "api.yourdomain.com/*",
  "zone_name": "yourdomain.com",
  "custom_domain": true
}]
```

Then redeploy.

## Troubleshooting

### Secret Not Found
```bash
# List secrets
wrangler secret list

# Re-add missing secret
wrangler secret put SECRET_NAME
```

### Deployment Failed
Check build logs and fix errors before retrying.

## Expected Inputs

- Backend ready for deployment
- Production Supabase credentials

## Expected Outputs

- Backend deployed to Cloudflare Workers
- Health check passing
