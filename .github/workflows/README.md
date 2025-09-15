# NEETAI GitHub Workflows Documentation 🚀

This directory contains all GitHub Actions workflows for the NEETAI project. Each workflow is designed to automate specific aspects of development, deployment, and maintenance.

## 📋 Workflow Overview

| Workflow | File | Triggers | Purpose |
|----------|------|----------|---------|
| 🔄 **Pull Request CI** | `pr.yml` | PRs to main/develop | Code quality, build, and security checks |
| 🔒 **CodeQL Security** | `codeql.yml` | Push, PR, Schedule | Security vulnerability analysis |
| 🚀 **Deploy** | `deploy.yml` | Push to main/develop | Automated deployments to staging/production |
| 📦 **Release** | `release.yml` | Push to main, Manual | Automated semantic versioning and releases |
| 🤖 **PR Automation** | `pr-automation.yml` | PR events, Schedule | Auto-labeling, assignment, stale management |
| 📊 **Monitoring** | `monitoring.yml` | Workflow completion | Alerts, metrics, and failure notifications |

## 🔄 Pull Request CI Workflow (`pr.yml`)

### Purpose
Ensures code quality and functionality before merging pull requests.

### Triggers
- Pull requests opened/updated to `main` or `develop` branches
- Ready for review events

### Jobs
1. **🔍 Detect Changes** - Analyzes changed files and determines what needs testing
2. **🧹 Code Quality** - ESLint, TypeScript checks, formatting validation
3. **🏗️ Build & Test** - Compiles code and runs test suites
4. **📦 Bundle Analysis** - Analyzes bundle size for web apps
5. **🔒 Security Audit** - npm audit and vulnerability scanning
6. **✅ PR Check Summary** - Aggregates all results and provides summary

### Key Features
- **Turbo caching** for faster builds
- **Matrix testing** on Node.js 18.x and 20.x
- **Smart change detection** to skip unnecessary jobs
- **Detailed reporting** in PR comments and summaries

### Configuration
```yaml
# Customize Node versions
strategy:
  matrix:
    node-version: [18.x, 20.x]
    
# Add new status checks
env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
```

## 🔒 CodeQL Security Analysis (`codeql.yml`)

### Purpose
Automated security vulnerability detection using GitHub's CodeQL engine.

### Triggers
- Push to `main` or `develop` branches
- Pull requests to protected branches  
- Weekly scheduled scan (Sundays at 02:00 UTC)
- Manual dispatch

### Languages Analyzed
- JavaScript
- TypeScript

### Features
- **Extended security queries** for comprehensive analysis
- **SARIF result upload** to GitHub Security tab
- **Automatic issue creation** for security findings
- **Weekly baseline scans** to catch new vulnerabilities

### Customization
```yaml
# Add new languages
matrix:
  language: ['javascript', 'typescript', 'python']

# Modify query suites
queries: +security-extended,security-and-quality
```

## 🚀 Deployment Workflow (`deploy.yml`)

### Purpose
Automated deployment to staging and production environments.

### Deployment Strategy
- **Staging**: Auto-deploy on push to `develop` branch
- **Production**: Auto-deploy on push to `main` branch (with approval)

### Environments
| Environment | Branch | Approval | URL |
|-------------|--------|----------|-----|
| Staging | `develop` | None | Auto-assigned preview URL |
| Production | `main` | Required | Production domain |

### Jobs
1. **🎯 Setup Deployment** - Determines target environment
2. **🏗️ Pre-deployment Build & Test** - Validates code before deployment
3. **🚀 Deploy to Staging** - Vercel staging deployment
4. **🚀 Deploy to Production** - Vercel production deployment (with approval)
5. **🧹 Cleanup** - Removes temporary artifacts

### Required Secrets
```bash
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-vercel-org-id>
VERCEL_PROJECT_ID=<your-vercel-project-id>
```

### Manual Deployment
Use workflow dispatch with environment selection:
- Environment: staging | production
- Branch: Any branch name

## 📦 Automated Release Workflow (`release.yml`)

### Purpose
Semantic versioning and automated GitHub releases based on conventional commits.

### Triggers
- Push to `main` branch (if release-worthy commits exist)
- Manual workflow dispatch with version type selection

### Version Detection Logic
- **Major**: Breaking changes (`feat!:`, `fix!:`, `BREAKING CHANGE`)
- **Minor**: New features (`feat:`)
- **Patch**: Bug fixes (`fix:`)

### Jobs
1. **🔍 Check Release Need** - Analyzes commits since last release
2. **📝 Create Release** - Generates changelog and creates GitHub release
3. **📢 Notify Release** - Sends notifications on completion

### Features
- **Automated changelog generation** from conventional commits
- **Release assets creation** (source code, build artifacts)
- **Version badge updates** in README
- **Git tag management**
- **Pre-release support** via manual dispatch

### Conventional Commit Examples
```bash
feat: add user authentication       # Minor version bump
fix: resolve login redirect issue   # Patch version bump  
feat!: redesign user API           # Major version bump
docs: update API documentation      # No version bump
```

## 🤖 PR Automation Workflow (`pr-automation.yml`)

### Purpose
Streamlines the pull request process with intelligent automation.

### Triggers
- Pull request events (opened, edited, synchronized)
- Daily schedule for stale PR management
- Issue comments for PR commands

### Jobs
1. **🏷️ Auto Label PRs** - Applies labels based on:
   - File paths (`area/web-app`, `area/database`)
   - PR size (`size/XS` to `size/XL`)
   - Commit types (`type/enhancement`, `type/bug`)
   - Priority levels (`priority/high`, `priority/medium`)

2. **👥 Auto Assign Reviewers** - Based on:
   - CODEOWNERS file
   - Expertise mapping
   - Changed files analysis

3. **💬 PR Comments** - Adds helpful comments for:
   - First-time contributors
   - Web app changes (with preview links)
   - Testing checklists

4. **🧹 Stale PR Management** - Automatically:
   - Labels PRs stale after 30 days
   - Closes PRs after 37 days of inactivity
   - Excludes draft PRs

5. **⚡ PR Commands** - Handles commands like:
   - `/rerun-ci` - Forces CI re-run
   - `/ready-for-review` - Marks draft as ready
   - `/assign @username` - Assigns user to PR

### Auto-Labeling Rules
```yaml
# Size labels based on total changes
≤ 10 lines: size/XS
≤ 50 lines: size/S  
≤ 200 lines: size/M
≤ 500 lines: size/L
> 500 lines: size/XL

# Area labels based on file paths
apps/web/: area/web-app
packages/auth/: area/authentication
.github/workflows/: area/ci-cd
```

## 📊 Monitoring & Alerts Workflow (`monitoring.yml`)

### Purpose
Proactive monitoring of workflow health and automated alerting.

### Triggers
- Workflow completion events
- Weekly schedule (Mondays at 8 AM UTC)
- Manual dispatch for custom reports

### Jobs
1. **⚠️ Workflow Failure Alert** - Creates issues for failed workflows
2. **🚀 Deployment Success** - Notifies successful deployments
3. **📈 Generate Metrics Report** - Weekly/monthly repository metrics
4. **⚡ Performance Monitoring** - Tracks performance regressions
5. **🔒 Security Monitoring** - Alerts on security scan failures
6. **🧹 Cleanup Resolved Issues** - Closes resolved workflow issues

### Metrics Tracked
- **Workflow Success Rate** - Percentage of successful workflow runs
- **PR Metrics** - Open, merged PRs and average merge time
- **Issue Resolution** - New vs closed issues ratio
- **Deployment Frequency** - Staging and production deployment rates

### Alert Types
- **Critical**: Security failures, production deployment failures
- **Warning**: Low success rates, stale PRs, long merge times
- **Info**: Weekly metrics, successful deployments

### Notification Channels
- **GitHub Issues** - Automatic issue creation for failures
- **Slack** - Optional webhook notifications
- **Discord** - Optional webhook notifications

## 🔧 Configuration and Customization

### Environment Variables
```bash
# Required for Turbo caching
TURBO_TOKEN=<your-turbo-token>
TURBO_TEAM=<your-turbo-team>

# Required for Vercel deployment  
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-vercel-org-id>
VERCEL_PROJECT_ID=<your-vercel-project-id>

# Optional for notifications
SLACK_WEBHOOK_URL=<your-slack-webhook>
DISCORD_WEBHOOK_URL=<your-discord-webhook>
```

### Workflow Permissions
Each workflow uses minimal required permissions:

```yaml
permissions:
  contents: read          # Read repository content
  pull-requests: write    # Manage PRs and comments  
  issues: write          # Create/update issues
  actions: read          # Read workflow run data
  security-events: write # Upload security results
```

### Customizing Workflows

#### Adding New Status Checks
1. Add check to workflow job
2. Update branch protection rules
3. Add to PR summary job

#### Modifying Auto-Labels
Edit the label mapping in `pr-automation.yml`:
```yaml
# Add new area labels
if (changedFiles.some(file => file.startsWith('packages/newpackage/'))) {
  labels.push('area/new-package');
}
```

#### Changing Notification Recipients
Update assignees and reviewers in workflow files:
```yaml
assignees: ['your-username']
reviewers: ['your-username']
```

## 🚀 Best Practices

### Workflow Development
1. **Test locally** using act or similar tools
2. **Use semantic commit messages** for automated releases
3. **Keep workflows focused** on single responsibilities
4. **Document changes** in this README
5. **Monitor workflow performance** and optimize as needed

### Security Considerations
1. **Use repository secrets** for sensitive data
2. **Limit workflow permissions** to minimum required
3. **Review third-party actions** before use
4. **Keep actions updated** to latest versions
5. **Monitor security alerts** from GitHub

### Performance Optimization
1. **Use caching** strategically (Turbo, Node modules)
2. **Parallelize jobs** when possible
3. **Skip unnecessary jobs** based on file changes
4. **Optimize Docker builds** if using containers
5. **Monitor workflow run times**

## 📊 Monitoring and Maintenance

### Regular Tasks
- **Weekly**: Review workflow metrics and failure reports
- **Monthly**: Update action versions and dependencies
- **Quarterly**: Review and optimize workflow performance
- **As needed**: Adjust configurations based on team feedback

### Troubleshooting
- **Check workflow logs** in GitHub Actions tab
- **Verify secrets** are properly configured
- **Review permissions** for workflow failures
- **Test changes** in fork before merging
- **Monitor resource usage** and quotas

### Useful Commands
```bash
# Test workflow locally (using act)
act -j pr-check

# Validate workflow syntax
yamllint .github/workflows/

# View workflow status
gh workflow list
gh workflow view pr.yml
```

## 🔗 Related Documentation

- [Setup Guide](./../SETUP.md) - Complete repository setup instructions
- [Contributing Guide](./../../CONTRIBUTING.md) - Development and contribution guidelines
- [Branch Protection](../branch-protection.md) - Branch protection configuration
- [GitHub Actions Docs](https://docs.github.com/en/actions) - Official GitHub Actions documentation

---

## 🤝 Contributing to Workflows

When modifying workflows:

1. **Create a feature branch** for workflow changes
2. **Test thoroughly** in a fork if possible
3. **Update this documentation** to reflect changes
4. **Get review approval** from repository maintainers
5. **Monitor deployment** after merging changes

**Remember**: Workflow changes affect the entire development team. Test carefully and document thoroughly!