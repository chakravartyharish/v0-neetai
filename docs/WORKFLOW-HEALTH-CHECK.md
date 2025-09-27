# NEETAI Workflow Health Check - Quick Reference

## 🚨 Emergency Workflow Debugging

If workflows are failing, check these common issues in order:

### 1. Dependency Installation Failures
```bash
# Symptoms: npm ci fails, ERESOLVE errors
# Quick Fix: Ensure --legacy-peer-deps flag is used
npm ci --legacy-peer-deps

# Check for version conflicts in package.json files
grep -r "@types/react" apps/*/package.json
```

### 2. Package Resolution Issues  
```bash
# Symptoms: Cannot find module errors
# Quick Fix: Verify package names are consistent
grep -r "@repo/" apps/ | head -5  # Should show @neet/ instead

# Rebuild packages if needed
npm run build
```

### 3. TypeScript Configuration Issues
```bash
# Symptoms: Module resolution errors
# Quick Fix: Ensure moduleResolution is set correctly
cat apps/web/tsconfig.json | grep moduleResolution
# Should show: "moduleResolution": "bundler"
```

## 📊 Success Rate Monitoring

### Target Metrics
- **Workflow Success Rate**: >90%
- **Dependency Install Success**: >98%  
- **Build Success Rate**: >95%
- **Security Scan Completion**: >90%

### Alert Thresholds
- 🟨 **Warning**: Success rate 85-90%
- 🟥 **Critical**: Success rate <85%

## 🔧 Quick Fixes

### Common Commands
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Rebuild everything
npm run build

# Check all types
npm run check-types

# Lint everything
npm run lint
```

### Package Consistency Check
```bash
# Ensure all React versions match
grep -r '"react"' apps/*/package.json
grep -r '@types/react' apps/*/package.json

# Verify @neet/ package usage (not @repo/)
find apps/ -name "*.ts" -o -name "*.tsx" | xargs grep -l "@repo/"
```

## 📋 Maintenance Checklist

### Weekly
- [ ] Check workflow success rates in Actions tab
- [ ] Review failed workflow logs
- [ ] Update package-lock.json if needed

### Monthly  
- [ ] Audit dependencies for security updates
- [ ] Verify package version consistency
- [ ] Review and update documentation

### Quarterly
- [ ] Major dependency upgrades (React, Next.js, etc.)
- [ ] Workflow optimization review
- [ ] Performance metrics analysis

---

*For detailed analysis, see [WORKFLOW-IMPROVEMENT-PLAN.md](./WORKFLOW-IMPROVEMENT-PLAN.md)*