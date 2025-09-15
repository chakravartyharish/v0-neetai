# NEETAI GitHub Workflow Setup Guide 🚀

This document provides step-by-step instructions to complete the GitHub workflow setup for your NEETAI repository.

## ✅ What's Already Done

✨ **Workflows Created:**
- Pull Request CI/CD pipeline (`pr.yml`)
- CodeQL security analysis (`codeql.yml`) 
- Deployment workflow (`deploy.yml`)
- Dependabot configuration (`dependabot.yml`)

📋 **Templates Added:**
- Pull request template
- Bug report form
- Feature request form  
- CODEOWNERS file
- Comprehensive CONTRIBUTING.md

## 🔧 Required GitHub Settings

### 1. Branch Protection Rules

Go to **Settings → Branches → Add Rule** and configure:

#### Main Branch Protection
- **Branch name pattern**: `main`
- ✅ **Require pull request reviews before merging**
  - Required approving reviews: `1`
  - ✅ Dismiss stale PR reviews when new commits are pushed
  - ✅ Require review from code owners
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Required status checks:
    - `🧹 Code Quality`
    - `🏗️ Build & Test`
    - `🔒 Security Audit`
    - `✅ PR Check Summary`
- ✅ **Include administrators**
- ✅ **Allow force pushes** (unchecked)
- ✅ **Allow deletions** (unchecked)

#### Develop Branch Protection (Create branch first)
```bash
# Create develop branch
git checkout -b develop
git push origin develop
```

- **Branch name pattern**: `develop`
- ✅ **Require pull request reviews before merging**
  - Required approving reviews: `1`
- ✅ **Require status checks to pass before merging**
  - Same status checks as main branch
- ✅ **Include administrators**

### 2. GitHub Secrets Configuration

Go to **Settings → Secrets and variables → Actions** and add:

#### Deployment Secrets
```
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-vercel-org-id>  
VERCEL_PROJECT_ID=<your-vercel-project-id>
```

#### Optional: Turbo Remote Caching
```
TURBO_TOKEN=<your-turbo-token>
TURBO_TEAM=<your-turbo-team>
```

#### Optional: Notification Secrets
```
SLACK_WEBHOOK_URL=<your-slack-webhook>
DISCORD_WEBHOOK_URL=<your-discord-webhook>
```

### 3. GitHub Environments

Go to **Settings → Environments** and create:

#### Staging Environment
- **Name**: `staging`
- **Deployment branches**: `develop` branch only
- **Required reviewers**: None (auto-deploy)

#### Production Environment  
- **Name**: `production`
- **Deployment branches**: `main` branch only
- **Required reviewers**: Your username
- **Wait timer**: 0 minutes

### 4. Repository Settings

#### General Settings
- ✅ **Issues** enabled
- ✅ **Projects** enabled (optional)
- ✅ **Wiki** disabled
- ✅ **Discussions** enabled (recommended)

#### Pull Request Settings
- ✅ **Allow merge commits**
- ✅ **Allow squash merging** (recommended)
- ✅ **Allow rebase merging**
- ✅ **Always suggest updating pull request branches**
- ✅ **Allow auto-merge**
- ✅ **Automatically delete head branches**

#### Security Settings
- ✅ **Private vulnerability reporting** enabled
- ✅ **Dependency graph** enabled
- ✅ **Dependabot alerts** enabled
- ✅ **Dependabot security updates** enabled

## 🚦 Workflow Usage Guide

### Creating a Feature Branch

```bash
# Start from develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature-name
```

### Pull Request Process

1. **Create PR** to `develop` branch
2. **Fill out PR template** completely
3. **Wait for CI checks** to pass
4. **Request review** (auto-assigned via CODEOWNERS)
5. **Address feedback** and push changes
6. **Squash and merge** after approval

### Deployment Process

#### Staging Deployment
- **Automatic**: Merge to `develop` → deploys to staging
- **Manual**: Use "Deploy" workflow with staging environment

#### Production Deployment
- **Process**: Merge `develop` → `main` → requires approval → deploys
- **Manual**: Use "Deploy" workflow with production environment

## 🛠️ Vercel Integration Setup

### 1. Connect Vercel Account

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your NEETAI repository
3. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && npm run build --filter=web`
   - **Output Directory**: `apps/web/.next`

### 2. Get Vercel Tokens

```bash
# Install Vercel CLI
npm i -g vercel

# Login and get tokens
vercel login
vercel --cwd apps/web

# Get org and project IDs
vercel project ls
```

### 3. Environment Variables in Vercel

Add your environment variables in Vercel dashboard:
- Production environment: `main` branch
- Preview environment: `develop` branch

## 🔍 Monitoring & Maintenance

### Weekly Tasks
- [ ] Review Dependabot PRs
- [ ] Check security alerts
- [ ] Monitor CI/CD performance
- [ ] Review failed workflows

### Monthly Tasks
- [ ] Update workflow dependencies
- [ ] Review and update branch protection rules
- [ ] Audit repository access
- [ ] Review deployment metrics

### Security Monitoring
- 🔒 **CodeQL scans**: Weekly + on every PR
- 🤖 **Dependabot updates**: Daily security updates
- 📊 **Security tab**: Monitor vulnerability alerts
- ⚠️ **Failed workflows**: Investigate immediately

## 🎯 Best Practices

### Commit Messages
Use [Conventional Commits](https://conventionalcommits.org/):
```bash
feat(auth): add OAuth integration
fix(quiz): resolve score calculation bug  
docs: update API documentation
ci: improve workflow performance
```

### Branch Naming
```bash
feature/add-user-authentication
fix/quiz-loading-issue
hotfix/security-vulnerability
release/v1.2.0
```

### PR Guidelines
- Keep PRs small and focused
- Write descriptive titles and descriptions
- Add screenshots for UI changes
- Link related issues
- Test thoroughly before requesting review

## 🚀 Testing the Setup

### 1. Test PR Workflow
```bash
# Create test branch
git checkout -b test/workflow-setup

# Make a small change
echo "# Test" > TEST.md
git add TEST.md
git commit -m "test: verify workflow setup"

# Push and create PR
git push origin test/workflow-setup
```

### 2. Verify CI/CD
1. Create PR to `develop`
2. Check that all workflows run
3. Verify status checks appear
4. Test branch protection (try to push directly to main)

### 3. Test Deployment
1. Merge test PR to `develop`
2. Verify staging deployment
3. Create PR from `develop` to `main`  
4. Verify production deployment approval requirement

## 📞 Troubleshooting

### Common Issues

#### Workflow Not Running
- Check `.github/workflows/` files are in main branch
- Verify workflow syntax with GitHub Actions validator
- Check repository permissions

#### Status Checks Not Required
- Ensure branch protection rules are saved
- Check that status check names match workflow job names
- Verify workflows have run at least once

#### Deployment Failures
- Check Vercel token validity
- Verify project configuration
- Check build logs in workflow runs

#### Dependabot Issues
- Verify `dependabot.yml` syntax
- Check repository settings for Dependabot
- Review security and dependency alerts

### Getting Help

- 📚 **GitHub Docs**: [GitHub Actions Documentation](https://docs.github.com/en/actions)
- 🔧 **Vercel Docs**: [Vercel Integration Guide](https://vercel.com/docs)
- 💬 **Community**: Create GitHub Discussion for help
- 🐛 **Issues**: Report problems via GitHub Issues

## 🎉 Completion Checklist

- [ ] Branch protection rules configured
- [ ] GitHub secrets added
- [ ] Environments created
- [ ] Vercel integration setup
- [ ] Test PR workflow successful
- [ ] Security features enabled
- [ ] Team members added with appropriate permissions
- [ ] Documentation reviewed and updated

---

**Congratulations!** 🎉 Your NEETAI repository now has a professional-grade GitHub workflow system. This setup will help maintain code quality, security, and streamlined development processes.

For questions or improvements to this setup, please create an issue or discussion in the repository.