# Vercel MCP Integration Setup & Usage Guide

## 🎯 Overview

Your **NEETAI project** now has complete Vercel integration through Model Context Protocol (MCP), giving Claude Desktop direct access to manage your Vercel deployments, projects, and infrastructure.

## ✅ Installation Complete

### What's Installed:
- **Package**: `@mistertk/vercel-mcp@0.1.1` (comprehensive 114+ tools)
- **Location**: `/home/harish/.npm-global/bin/vercel-mcp`
- **Configuration**: Added to Claude Desktop config
- **API Token**: Configured and secured

### Configuration Details:
```json
"vercel": {
  "command": "npx",
  "args": ["-y", "@mistertk/vercel-mcp"],
  "env": {
    "VERCEL_API_KEY": "mmufvDXVAZQpOe180N8oEE2G"
  }
}
```

## 🛠 Available Capabilities

### **Project Management** (114+ tools available)
- List all Vercel projects
- Get detailed project information
- View project settings and configuration
- Manage environment variables
- Check project status and health

### **Deployment Operations**
- Monitor deployment status and progress
- View deployment logs and build information
- Check deployment URLs and preview links
- Access deployment analytics and metrics
- Manage deployment rollbacks

### **Domain & DNS Management**  
- List custom domains
- Check domain configuration
- Manage DNS settings
- Verify domain status
- Configure domain redirects

### **Team & Security**
- View team information and members
- Check access permissions
- Monitor security settings
- Manage team resources

### **Monitoring & Analytics**
- Access performance metrics
- View usage statistics
- Monitor error rates
- Check bandwidth usage

## 🚀 Quick Start Commands

Once you restart Claude Desktop, try these example prompts:

### **Basic Operations:**
```
"List all my Vercel projects"
"Show details for the NEETAI project" 
"What's the status of my recent deployments?"
"Show me the latest deployment logs for NEETAI"
```

### **Environment Management:**
```
"Show environment variables for NEETAI project"
"Check the production environment configuration"
"List all domains associated with my projects"
```

### **Monitoring & Debugging:**
```
"Show deployment history for the last week"
"Check for any failed deployments"
"What's the current build status?"
"Show me performance metrics for NEETAI"
```

## 🔧 Next Steps

### **1. Restart Claude Desktop**
- Completely quit Claude Desktop: `Ctrl+Q` or `Cmd+Q`
- Relaunch Claude Desktop
- Wait for MCP servers to initialize (check status in Claude)

### **2. Test Basic Connectivity**
- Ask: "List my Vercel projects"
- Verify NEETAI project appears
- Check deployment information

### **3. Explore Advanced Features**
- Domain management for custom URLs
- Environment variable management
- Deployment monitoring and analytics
- Team collaboration features

## 🔐 Security Notes

### **API Token Security:**
- Token is securely stored in Claude Desktop config
- Full account access (as configured)
- Token name: `NEETAI-MCP-Integration` (recommended)
- Expiration: Based on your Vercel settings

### **Best Practices:**
- Regularly rotate API tokens (every 90 days recommended)
- Monitor token usage in Vercel dashboard
- Review access logs periodically
- Use environment-specific tokens for different projects

## 🛠 Troubleshooting

### **Common Issues:**

**1. MCP Server Not Connecting:**
- Ensure Claude Desktop is completely restarted
- Check JSON syntax in config file
- Verify API token is valid

**2. API Rate Limiting:**
- Default: 60 calls/minute, burst of 10
- Configure via environment variables if needed:
  ```bash
  VERCEL_RATE_LIMIT_PER_MINUTE=60
  VERCEL_RATE_LIMIT_BURST=10
  ```

**3. Token Issues:**
- Verify token in Vercel dashboard
- Check token hasn't expired
- Ensure proper scope (Full Account recommended)

### **Debug Mode:**
Add to environment variables in config:
```json
"env": {
  "VERCEL_API_KEY": "your-token",
  "VERCEL_DEBUG": "true"
}
```

## 📁 Integration with NEETAI Project

### **Your Current Setup:**
- **Framework**: Next.js with TailwindCSS
- **Database**: Supabase integration
- **Analytics**: Vercel Analytics enabled
- **Deployment**: Automated via GitHub Actions

### **MCP Benefits for NEETAI:**
- **Real-time Monitoring**: Check deployment status without leaving Claude
- **Quick Debugging**: Access logs and error information instantly
- **Environment Management**: Manage staging vs production configs
- **Performance Insights**: Monitor user analytics and performance
- **Team Collaboration**: Manage access and permissions

## 🔄 Workflow Examples

### **Daily Development:**
1. "Check latest NEETAI deployment status"
2. "Show any recent build errors" 
3. "What's the current production URL?"

### **Debugging Issues:**
1. "Show deployment logs for failed builds"
2. "Check environment variables for production"
3. "What's the error rate for the last 24 hours?"

### **Release Management:**
1. "Show all deployments from the last week"
2. "Check preview URLs for recent branches"
3. "Verify custom domain configuration"

## 📞 Support & Resources

### **MCP Server Package:**
- **GitHub**: Community package by @MisterTK
- **Version**: 0.1.1 (actively maintained)
- **Features**: 114+ tools, 4 resources, 5 prompts

### **Vercel Documentation:**
- [Vercel API Reference](https://vercel.com/docs/rest-api)
- [Deployment Documentation](https://vercel.com/docs/deployments)
- [Environment Variables Guide](https://vercel.com/docs/environment-variables)

### **Configuration Files:**
- **Claude Config**: `~/.config/Claude/claude_desktop_config.json`
- **Backup**: `~/.config/Claude/claude_desktop_config.json.backup`
- **MCP Package**: `/home/harish/.npm-global/lib/node_modules/@mistertk/vercel-mcp`

---

## ✨ Ready to Use!

Your Vercel MCP integration is now complete and ready for use. Simply restart Claude Desktop and start managing your NEETAI project deployments directly through AI assistance!

**Remember**: This powerful integration gives you comprehensive control over your Vercel infrastructure, making deployment management, debugging, and monitoring seamless within your development workflow.