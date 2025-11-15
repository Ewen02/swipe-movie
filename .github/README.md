# GitHub Workflows

This directory contains CI/CD workflows for automated building, testing, and deployment.

## Workflows Overview

### 🔄 CI (Continuous Integration)
**File:** `workflows/ci.yml`
**Triggers:** Push to `main`/`develop`, Pull Requests

**Jobs:**
1. **Lint & Type Check** - ESLint and TypeScript validation
2. **Build** - Build both web and API applications
3. **Test** - Run unit and integration tests
4. **Security** - npm audit for vulnerabilities
5. **Summary** - Aggregate results and fail if critical issues

**Status Badge:**
```markdown
![CI](https://github.com/YOUR_USERNAME/swipe-movie/workflows/CI/badge.svg)
```

### 🚀 Deploy (Continuous Deployment)
**File:** `workflows/deploy.yml`
**Triggers:** Push to `main`, Manual dispatch

**Jobs:**
1. **Deploy Web** - Deploy to Vercel
2. **Deploy API** - Deploy to configured provider
3. **Notify** - Send deployment status notifications

**Requirements:**
- Vercel account and token
- API hosting provider configured
- See [SECRETS.md](./SECRETS.md) for required secrets

### 👀 PR Preview
**File:** `workflows/pr-preview.yml`
**Triggers:** Pull request events

**Jobs:**
1. **Preview** - Build preview and comment on PR
2. **Size Check** - Analyze bundle size and report

**Features:**
- Automated PR comments with build status
- Bundle size analysis
- Build artifact generation

### 🔒 CodeQL Security Scan
**File:** `workflows/codeql.yml`
**Triggers:** Push, PR, Weekly schedule (Monday 2 AM)

**Features:**
- Automated security vulnerability scanning
- JavaScript/TypeScript analysis
- Security and quality queries
- GitHub Security tab integration

## Workflow Status

Check the status of all workflows:
- **Actions Tab:** https://github.com/YOUR_USERNAME/swipe-movie/actions
- **Branches:** Each branch shows its workflow status

## Configuration

### Environment Variables

Workflows use these environment variables:

**Build-time:**
- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `SENTRY_DSN`

**Deployment:**
- See [SECRETS.md](./SECRETS.md) for complete list

### Branch Protection Rules

Recommended settings for `main` branch:

1. **Require pull request before merging**
   - Require 1 approval
   - Dismiss stale reviews

2. **Require status checks to pass**
   - Lint & Type Check
   - Build Applications
   - Security Audit

3. **Require branches to be up to date**

Configure at: `Settings → Branches → Branch protection rules`

## Local Testing

Test workflows locally using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run CI workflow
act -W .github/workflows/ci.yml

# Run specific job
act -j lint

# Run with secrets
act -s VERCEL_TOKEN=xxx
```

## Troubleshooting

### Workflow Fails

1. **Check workflow run logs**
   - Go to Actions tab
   - Click on failed workflow
   - Review job logs

2. **Common issues:**
   - Missing secrets → Add in repository settings
   - Type errors → Fix locally and push
   - Build errors → Check environment variables
   - Dependencies → Run `npm ci` to update lock file

### Deployment Issues

1. **Vercel deployment fails:**
   - Verify `VERCEL_TOKEN` is set
   - Check Vercel project is linked
   - Review Vercel dashboard for errors

2. **API deployment fails:**
   - Configure deployment provider in `deploy.yml`
   - Add necessary secrets
   - Test deployment locally first

### Security Scan Alerts

1. **Check Security tab** in repository
2. **Review CodeQL alerts**
3. **Fix vulnerabilities** and push changes
4. **Re-run failed workflow**

## Best Practices

### For Contributors

- ✅ Ensure CI passes before requesting review
- ✅ Keep PRs focused and small
- ✅ Write meaningful commit messages
- ✅ Update tests when changing code
- ✅ Check bundle size impact

### For Maintainers

- ✅ Review workflow runs regularly
- ✅ Keep secrets up to date
- ✅ Monitor security alerts
- ✅ Update dependencies monthly
- ✅ Rotate tokens quarterly

## Monitoring

### Workflow Metrics

Track these metrics:
- **Success rate** - Target: >95%
- **Build time** - Target: <5 minutes
- **Deploy time** - Target: <3 minutes

### Alerts

Set up notifications for:
- Failed deployments (critical)
- Security vulnerabilities (high)
- Build failures (medium)

Configure in: `Settings → Notifications`

## Future Enhancements

- [ ] Add E2E testing with Playwright
- [ ] Implement automatic dependency updates (Dependabot)
- [ ] Add performance regression testing
- [ ] Implement canary deployments
- [ ] Add smoke tests post-deployment
- [ ] Integrate with Slack/Discord for notifications

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [CodeQL Documentation](https://codeql.github.com/docs/)
