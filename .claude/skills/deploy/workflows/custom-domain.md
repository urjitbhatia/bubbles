# Workflow: Custom Domain

Configure custom domains for frontend and backend.

## Instructions

1. Add domain to Cloudflare (if not already)
2. Configure in wrangler config or dashboard
3. Update DNS records
4. Verify SSL/TLS

## Backend Custom Domain (Worker)

### Option 1: Via wrangler.jsonc

Edit `api/wrangler.jsonc`:

```json
{
  "routes": [
    {
      "pattern": "api.yourdomain.com/*",
      "zone_name": "yourdomain.com",
      "custom_domain": true
    }
  ]
}
```

Then redeploy:
```bash
make deploy
```

### Option 2: Via Dashboard

1. Go to Workers & Pages → your worker
2. Click "Triggers" tab
3. Add Custom Domain
4. Enter domain (e.g., `api.yourdomain.com`)
5. Cloudflare auto-configures DNS

## Frontend Custom Domain (Pages)

### Via Dashboard

1. Go to Pages → your project
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Enter domain (e.g., `app.yourdomain.com`)
5. Follow DNS instructions

### DNS Records

Cloudflare typically adds:
```
Type: CNAME
Name: app
Content: your-project.pages.dev
```

## Apex Domain (No Subdomain)

For `yourdomain.com` (no `www` or subdomain):

1. Domain must be on Cloudflare DNS
2. Add as custom domain in Pages
3. Cloudflare uses CNAME flattening

## SSL/TLS

Cloudflare provides free SSL automatically:
- Full (strict) mode recommended
- Certificate provisioned automatically

## Redirect www to apex

In Cloudflare Dashboard:
1. Go to Rules → Redirect Rules
2. Create rule:
   - If hostname equals `www.yourdomain.com`
   - Redirect to `https://yourdomain.com`

## Verify Setup

```bash
# Check backend
curl https://api.yourdomain.com/api/v1/health

# Check frontend
curl -I https://yourdomain.com
```

## Expected Inputs

- Domain name
- Whether apex or subdomain
- Frontend or backend

## Expected Outputs

- Custom domain configured
- SSL certificate active
- DNS properly configured
