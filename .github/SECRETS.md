# GitHub Secrets Configuration

This document lists all the secrets required for the CI/CD pipelines to work properly.

## Required Secrets

Configure these secrets in your GitHub repository settings:
**Settings → Secrets and variables → Actions → New repository secret**

### Deployment Secrets

#### Vercel (Web Application)
- **`VERCEL_TOKEN`**: Vercel authentication token
  - Get it from: https://vercel.com/account/tokens
  - Used for: Automated deployment of the web application

- **`VERCEL_ORG_ID`**: Your Vercel organization ID
  - Found in: `.vercel/project.json` after running `vercel link`

- **`VERCEL_PROJECT_ID`**: Your Vercel project ID
  - Found in: `.vercel/project.json` after running `vercel link`

#### API Deployment (Configure based on your provider)

**Option 1: Railway**
- **`RAILWAY_TOKEN`**: Railway API token
  - Get it from: https://railway.app/account/tokens

**Option 2: Render**
- **`RENDER_API_KEY`**: Render API key
  - Get it from: https://dashboard.render.com/account

**Option 3: Custom Server (SSH)**
- **`DEPLOY_HOST`**: Server hostname or IP
- **`DEPLOY_USER`**: SSH username
- **`DEPLOY_KEY`**: SSH private key

### Monitoring Secrets

#### Sentry
- **`SENTRY_DSN_WEB`**: Sentry DSN for web application
  - Get it from: https://sentry.io/settings/projects/

- **`SENTRY_DSN_API`**: Sentry DSN for API application
  - Get it from: https://sentry.io/settings/projects/

- **`SENTRY_ORG`** (Optional): Sentry organization slug
  - Used for source map uploads

- **`SENTRY_PROJECT`** (Optional): Sentry project name
  - Used for source map uploads

- **`SENTRY_AUTH_TOKEN`** (Optional): Sentry authentication token
  - Get it from: https://sentry.io/settings/account/api/auth-tokens/
  - Required for uploading source maps

## Environment-Specific Secrets

### Production Environment

1. Go to **Settings → Environments → New environment**
2. Create environment named: `production`
3. Add environment protection rules (optional):
   - Required reviewers
   - Wait timer
   - Deployment branches (only `main`)

### Staging Environment (Optional)

1. Create environment named: `staging`
2. Configure for `develop` branch

## How to Add Secrets

### Via GitHub UI
```
1. Navigate to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions
2. Click "New repository secret"
3. Enter the secret name and value
4. Click "Add secret"
```

### Via GitHub CLI
```bash
gh secret set VERCEL_TOKEN --body "your-token-here"
gh secret set SENTRY_DSN_WEB --body "your-dsn-here"
```

## Verifying Configuration

After adding secrets, you can verify them in:
- **Settings → Secrets and variables → Actions**

Secrets will show as configured (values are hidden for security).

## Security Best Practices

1. **Rotate secrets regularly** (every 90 days recommended)
2. **Use environment-specific secrets** for production vs staging
3. **Limit secret access** to necessary workflows only
4. **Never commit secrets** to the repository
5. **Use separate Sentry projects** for web and API
6. **Revoke unused tokens** immediately

## Troubleshooting

### Deployment fails with "Secret not found"
- Verify secret name matches exactly (case-sensitive)
- Check secret is added to the correct repository/environment
- Ensure workflow has access to the secret

### Vercel deployment issues
- Run `vercel link` locally first to generate project config
- Verify VERCEL_ORG_ID and VERCEL_PROJECT_ID match your project
- Check token has necessary permissions

### Sentry source maps not uploading
- Verify SENTRY_AUTH_TOKEN has `project:write` permission
- Check SENTRY_ORG and SENTRY_PROJECT match your Sentry setup
- Ensure `SENTRY_DSN` is not empty (can disable upload if empty)

## Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Sentry Integration Guide](https://docs.sentry.io/product/releases/)
