# Workflow: Manage Secrets

Configure production secrets and environment variables.

## Instructions

1. Identify required secrets
2. Set them using wrangler or dashboard
3. Verify they're configured

## Backend Secrets (Workers)

### Using Wrangler CLI

```bash
cd api  # or api-rust

# Set each secret interactively
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put SUPABASE_ANON_KEY

# Add any additional secrets
wrangler secret put OPENAI_API_KEY
wrangler secret put SLACK_BOT_TOKEN
```

### List Secrets

```bash
wrangler secret list
```

### Delete Secret

```bash
wrangler secret delete SECRET_NAME
```

### Bulk Set (from file)

Create `.prod.vars`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key
SUPABASE_ANON_KEY=your-anon-key
```

```bash
# Set each line as secret
while IFS='=' read -r key value; do
  echo "$value" | wrangler secret put "$key"
done < .prod.vars
```

## Frontend Environment Variables (Pages)

### Via Cloudflare Dashboard

1. Go to Cloudflare Dashboard
2. Select Pages → your project
3. Go to Settings → Environment variables
4. Add variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Production vs Preview

You can set different values for:
- **Production**: Used for main branch deployments
- **Preview**: Used for PR/branch deployments

## Required Secrets by Service

### Backend (Required)
| Secret | Description |
|--------|-------------|
| `SUPABASE_URL` | Production Supabase API URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS) |
| `SUPABASE_ANON_KEY` | Anon/public key |

### Backend (Optional)
| Secret | Description |
|--------|-------------|
| `OPENAI_API_KEY` | For AI features |
| `SLACK_BOT_TOKEN` | For Slack integration |

### Frontend (Required)
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Production Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Anon/public key only |

**Never put service role key in frontend!**

## Expected Inputs

- Secret name and value
- Which environment (prod/preview)

## Expected Outputs

- Secrets configured in Cloudflare
- Verified with secret list
