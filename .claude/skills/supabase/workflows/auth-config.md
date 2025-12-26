# Workflow: Auth Configuration

Configure Supabase authentication providers and settings.

## Instructions

1. Edit `api/supabase/config.toml`
2. Configure providers and settings
3. Restart Supabase: `supabase stop && supabase start`

## Configuration File

Location: `api/supabase/config.toml`

### Email Auth

```toml
[auth]
enabled = true
site_url = "http://localhost:5174"
additional_redirect_urls = ["http://127.0.0.1:5174"]

[auth.email]
enable_signup = true
double_confirm_changes = true
enable_confirmations = false  # Set true for production
```

### Google OAuth

```toml
[auth.external.google]
enabled = true
client_id = "your-google-client-id.apps.googleusercontent.com"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET)"
skip_nonce_check = true  # For local dev only
```

Set the secret:
```bash
# For local dev, add to api/.env or config
export SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET="your-secret"

# For production
supabase secrets set SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET="your-secret"
```

### GitHub OAuth

```toml
[auth.external.github]
enabled = true
client_id = "your-github-client-id"
secret = "env(SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET)"
```

### Email Templates

```toml
[auth.email.template.invite]
subject = "You've been invited"
content_path = "./templates/invite.html"
```

Create template in `api/supabase/templates/invite.html`:
```html
<h2>You've been invited!</h2>
<p><a href="{{ .ConfirmationURL }}">Accept Invitation</a></p>
```

## Provider Setup

### Google
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `http://127.0.0.1:54321/auth/v1/callback` (local)
   - `https://your-project.supabase.co/auth/v1/callback` (prod)

### GitHub
1. Go to GitHub Developer Settings
2. Create OAuth App
3. Set callback URL to Supabase auth callback

## Expected Inputs

- Provider to configure
- OAuth credentials

## Expected Outputs

- Updated config.toml
- Provider ready to use
