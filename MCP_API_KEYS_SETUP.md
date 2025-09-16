# Claude MCP Servers API Keys Setup Guide

This guide will help you configure all the necessary API keys for your Claude Desktop MCP servers.

## 🔑 Required API Keys

You need to obtain the following API keys and replace the placeholder values:

### 1. GitHub Personal Access Token
- **Purpose**: Access GitHub repositories, issues, pull requests
- **How to get**: 
  1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token with these scopes:
     - `repo` (Full control of private repositories)
     - `read:user` (Read user profile data)
     - `user:email` (Access user email addresses)
  3. Copy the token (starts with `github_pat_` or `ghp_`)

### 2. Brave Search API Key
- **Purpose**: Web search capabilities through Brave Search
- **How to get**:
  1. Go to [Brave Search API](https://api.search.brave.com/)
  2. Sign up for a free account
  3. Create an API subscription
  4. Copy your API key

### 3. Firecrawl API Key
- **Purpose**: Web scraping and content extraction
- **How to get**:
  1. Go to [Firecrawl.dev](https://firecrawl.dev/)
  2. Sign up for an account
  3. Go to your dashboard
  4. Generate an API key (starts with `fc-`)

## 🛠️ Quick Setup

### Option 1: Use the Update Script (Recommended)
```bash
# Navigate to the project directory
cd /home/harish/Desktop/NEETAI

# Run the update script
./update_api_keys.sh

# Follow the interactive prompts to enter your API keys
```

### Option 2: Manual Setup
Replace the placeholder values in both files:

**In ~/.bashrc:**
```bash
export GITHUB_TOKEN="your_github_token_here"
export BRAVE_API_KEY="your_brave_api_key_here"  
export FIRECRAWL_API_KEY="your_firecrawl_api_key_here"
```

**In ~/.profile:**
```bash
export GITHUB_TOKEN="your_github_token_here"
export BRAVE_API_KEY="your_brave_api_key_here"
export FIRECRAWL_API_KEY="your_firecrawl_api_key_here"
```

Then reload your shell configuration:
```bash
source ~/.bashrc
source ~/.profile
```

## ✅ Current MCP Server Status

| Server | Status | API Key Required | Notes |
|--------|--------|------------------|--------|
| 🟢 Wolfram | ✅ Ready | No | Mathematical computations |
| 🟢 Filesystem | ✅ Ready | No | File system operations |
| 🟢 Git | ✅ Ready | No | Git repository management |
| 🟢 SQLite | ✅ Ready | No | Database operations |
| 🟢 Supabase | ✅ Ready | ✅ Configured | Database and auth services |
| 🟢 Playwright | ✅ Ready | No | Browser automation |
| 🟢 Context7 | ✅ Ready | No | Documentation lookup |
| 🟢 Testsprite | ✅ Ready | No | Testing framework |
| 🟢 Vercel | ✅ Ready | ✅ Configured | Deployment platform |
| 🔴 GitHub | ⏳ Needs API Key | ❌ Required | Repository management |
| 🔴 Brave Search | ⏳ Needs API Key | ❌ Required | Web search |
| 🔴 Firecrawl | ⏳ Needs API Key | ❌ Required | Web scraping |

## 🧪 Testing Your Setup

After setting up the API keys, test each service:

### Test Environment Variables
```bash
echo "GitHub Token: ${GITHUB_TOKEN:0:20}..."
echo "Brave API Key: ${BRAVE_API_KEY:0:20}..."
echo "Firecrawl API Key: ${FIRECRAWL_API_KEY:0:20}..."
```

### Test Claude Desktop
1. Close Claude Desktop completely
2. Restart Claude Desktop
3. Try using the MCP servers:
   - Ask about a GitHub repository
   - Request a web search
   - Ask to scrape a webpage

## 🔒 Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables** (already configured)
3. **Regularly rotate your API keys**
4. **Use minimal required permissions** for GitHub tokens
5. **Monitor API usage** in your provider dashboards

## 🎯 Configuration Files Modified

The following files have been updated with placeholder values:
- `~/.bashrc` - Interactive bash shells
- `~/.profile` - Login shells
- `~/.config/Claude/claude_desktop_config.json` - Claude Desktop MCP configuration

## 🆘 Troubleshooting

### MCP Server Not Loading
1. Check that Claude Desktop is completely closed and restarted
2. Verify API keys are correctly set: `printenv | grep -E "(GITHUB_TOKEN|BRAVE_API_KEY|FIRECRAWL_API_KEY)"`
3. Check Claude Desktop logs for error messages

### Environment Variables Not Found
```bash
# Reload configuration
source ~/.bashrc
source ~/.profile

# Or restart your terminal session
```

### Invalid API Keys
- GitHub: Ensure token has correct permissions
- Brave: Check API quota and subscription status  
- Firecrawl: Verify account is active and has credits

## 🚀 Ready to Go!

Once all API keys are configured:
1. ✅ All MCP servers will be functional
2. ✅ You'll have access to GitHub operations
3. ✅ Web search through Brave will work
4. ✅ Web scraping via Firecrawl will be available
5. ✅ Full integration with your Claude Desktop experience

---
*Last updated: $(date)*