# Branch Protection Rules Configuration 🛡️

This document outlines the recommended branch protection rules for the NEETAI repository to ensure code quality and maintain a stable codebase.

## 📋 Overview

Branch protection rules help enforce workflows and protect important branches from potentially damaging changes. They ensure that:
- Code changes go through proper review processes
- Automated tests pass before merging
- Important branches maintain their integrity
- Team collaboration follows established patterns

## 🔧 Configuration Steps

### 1. Navigate to Branch Protection Settings

1. Go to your repository on GitHub
2. Click **Settings** → **Branches**
3. Click **Add rule** to create a new branch protection rule

### 2. Main Branch Protection (`main`)

#### Basic Settings
- **Branch name pattern**: `main`
- ✅ **Restrict pushes that create files larger than 100 MB**

#### Pull Request Requirements
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals**: `1` (minimum)
  - ✅ **Dismiss stale PR approvals when new commits are pushed**
  - ✅ **Require review from code owners**
  - ✅ **Restrict reviews to users with write access to the repository**
  - ✅ **Allow specified actors to bypass required pull requests** (unchecked)

#### Status Check Requirements  
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**

**Required Status Checks:**
```
🧹 Code Quality
🏗️ Build & Test  
🔒 Security Audit
✅ PR Check Summary
```

#### Additional Restrictions
- ✅ **Restrict pushes that create files larger than 100 MB**
- ✅ **Require signed commits** (optional, but recommended)
- ✅ **Require linear history** (optional, for cleaner git history)
- ✅ **Include administrators** (applies rules to repository admins)
- ❌ **Allow force pushes** (unchecked)
- ❌ **Allow deletions** (unchecked)

### 3. Develop Branch Protection (`develop`)

#### Basic Settings
- **Branch name pattern**: `develop`

#### Pull Request Requirements
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals**: `1` (minimum)
  - ✅ **Dismiss stale PR approvals when new commits are pushed**
  - ✅ **Require review from code owners**
  - ❌ **Restrict reviews to users with write access** (more flexible for development)

#### Status Check Requirements
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**

**Required Status Checks:**
```
🧹 Code Quality
🏗️ Build & Test
🔒 Security Audit
✅ PR Check Summary
```

#### Additional Restrictions
- ✅ **Include administrators**
- ❌ **Allow force pushes** (unchecked)
- ❌ **Allow deletions** (unchecked)

### 4. Feature Branch Protection (Optional)

For additional security, you can protect feature branch patterns:

#### Pattern: `feature/*`
- **Branch name pattern**: `feature/*`
- ✅ **Require a pull request before merging**
- ✅ **Require approvals**: `1`
- ❌ **Require status checks** (optional for feature branches)

## 🔄 Branch Protection JSON Configuration

For automated setup or backup purposes, here's the configuration in JSON format:

### Main Branch Protection
```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "🧹 Code Quality",
      "🏗️ Build & Test", 
      "🔒 Security Audit",
      "✅ PR Check Summary"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "restrict_reviews_to_code_owners": false
  },
  "restrictions": {
    "users": [],
    "teams": [],
    "apps": []
  },
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": false,
  "required_conversation_resolution": true
}
```

### Develop Branch Protection
```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "🧹 Code Quality",
      "🏗️ Build & Test",
      "🔒 Security Audit", 
      "✅ PR Check Summary"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "restrict_reviews_to_code_owners": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": false,
  "required_conversation_resolution": false
}
```

## 📊 Status Check Details

### Required Status Checks Explanation

| Status Check | Purpose | Workflow File |
|-------------|---------|---------------|
| **🧹 Code Quality** | ESLint, Prettier, TypeScript checks | `.github/workflows/pr.yml` |
| **🏗️ Build & Test** | Compilation and test execution | `.github/workflows/pr.yml` |
| **🔒 Security Audit** | npm audit and security scanning | `.github/workflows/pr.yml` |
| **✅ PR Check Summary** | Overall PR validation summary | `.github/workflows/pr.yml` |

### Setting Up Status Checks

1. **Ensure workflows run at least once** - Status checks only appear as options after they've run
2. **Use exact job names** - The status check names must match the `name` field in your workflow jobs
3. **Test the setup** - Create a test PR to verify all status checks appear and function correctly

## 🚀 Deployment Branch Rules

### Environment-Specific Protection

#### Production Deployments (`main` branch)
- **Manual approval required** via GitHub Environments
- **Deployment protection rules** in repository settings
- **Environment secrets** configured for production

#### Staging Deployments (`develop` branch)  
- **Automatic deployment** after PR merge
- **Review apps** for testing changes
- **Staging environment secrets** configured

## 🛠️ Advanced Configuration Options

### Repository Settings Integration

Navigate to **Settings → General → Pull Requests**:

- ✅ **Allow merge commits**
- ✅ **Allow squash merging** (recommended)
- ✅ **Allow rebase merging**
- ✅ **Always suggest updating pull request branches**
- ✅ **Allow auto-merge**
- ✅ **Automatically delete head branches**

### Security Settings Integration

Navigate to **Settings → Security & analysis**:

- ✅ **Dependency graph**
- ✅ **Dependabot alerts**
- ✅ **Dependabot security updates**
- ✅ **Private vulnerability reporting**

## 🔍 Monitoring and Compliance

### Branch Protection Compliance Dashboard

Create a dashboard to monitor:
- **Protection rule violations**
- **Bypass attempts and approvals**
- **Status check success rates**
- **Review completion times**

### Automated Compliance Checks

Consider implementing automated checks for:
- **Rule configuration drift**
- **Status check reliability**
- **Review process effectiveness**
- **Security compliance adherence**

## 🚨 Emergency Procedures

### Emergency Hotfixes

For critical production issues:

1. **Create hotfix branch** from `main`
2. **Use administrator bypass** if necessary (with justification)
3. **Accelerated review process** with senior maintainer approval
4. **Immediate rollback plan** in case of issues
5. **Post-incident documentation** and rule review

### Temporary Rule Modifications

When temporarily modifying protection rules:

1. **Document the change** and reason
2. **Set a reminder** to restore original rules
3. **Notify the team** of temporary changes
4. **Monitor closely** during the modification period

## 📋 Checklist for Setup

### Pre-Setup Checklist
- [ ] Workflows are created and tested
- [ ] Status checks have run at least once
- [ ] CODEOWNERS file is in place
- [ ] Team members have appropriate permissions

### Setup Checklist
- [ ] Main branch protection configured
- [ ] Develop branch protection configured
- [ ] Status checks properly configured
- [ ] Review requirements set up
- [ ] Administrator enforcement enabled
- [ ] Force push and deletion protection enabled

### Post-Setup Checklist
- [ ] Test PR creation and merge process
- [ ] Verify status checks are working
- [ ] Confirm review assignment is working
- [ ] Test branch protection enforcement
- [ ] Document any custom configurations
- [ ] Train team on new workflow

## 🔧 Troubleshooting

### Common Issues

#### Status Checks Not Appearing
- **Solution**: Ensure workflows have run at least once
- **Check**: Workflow file syntax and job names
- **Verify**: Repository permissions and secrets

#### Reviews Not Required
- **Solution**: Check CODEOWNERS file syntax
- **Verify**: Review requirements configuration
- **Test**: Create a test PR to verify settings

#### Protection Rules Not Enforcing
- **Solution**: Verify "Include administrators" is enabled
- **Check**: Branch name pattern matches exactly
- **Test**: Attempt to push directly to protected branch

### Support and Resources

- **GitHub Docs**: [Branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- **Team Support**: Create an issue for configuration help
- **Monitoring**: Use the repository insights for branch protection metrics

---

## 📝 Notes

- **Review Regularly**: Branch protection rules should be reviewed quarterly
- **Update as Needed**: Adjust rules as team size and practices evolve  
- **Document Changes**: Keep this document updated with any modifications
- **Team Training**: Ensure all team members understand the workflow

**Remember**: These protection rules are designed to maintain code quality and team collaboration. They should enhance your workflow, not hinder productivity.