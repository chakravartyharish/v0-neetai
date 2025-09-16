#!/bin/bash

# Script to update API keys for Claude MCP servers
# Usage: ./update_api_keys.sh

echo "🔧 Updating API keys for Claude MCP servers..."

# Prompt for API keys if not provided as arguments
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo ""
    echo "Please provide your API keys:"
    echo "Format: ./update_api_keys.sh GITHUB_TOKEN BRAVE_API_KEY FIRECRAWL_API_KEY"
    echo ""
    echo "Or enter them interactively:"
    
    if [ -z "$1" ]; then
        read -p "Enter your GitHub Token: " GITHUB_TOKEN
    else
        GITHUB_TOKEN="$1"
    fi
    
    if [ -z "$2" ]; then
        read -p "Enter your Brave API Key: " BRAVE_API_KEY
    else
        BRAVE_API_KEY="$2"
    fi
    
    if [ -z "$3" ]; then
        read -p "Enter your Firecrawl API Key: " FIRECRAWL_API_KEY
    else
        FIRECRAWL_API_KEY="$3"
    fi
else
    GITHUB_TOKEN="$1"
    BRAVE_API_KEY="$2"
    FIRECRAWL_API_KEY="$3"
fi

# Update .bashrc
echo "📝 Updating ~/.bashrc..."
sed -i "s/YOUR_GITHUB_TOKEN_HERE/$GITHUB_TOKEN/g" ~/.bashrc
sed -i "s/YOUR_BRAVE_API_KEY_HERE/$BRAVE_API_KEY/g" ~/.bashrc
sed -i "s/YOUR_FIRECRAWL_API_KEY_HERE/$FIRECRAWL_API_KEY/g" ~/.bashrc

# Update .profile
echo "📝 Updating ~/.profile..."
sed -i "s/YOUR_GITHUB_TOKEN_HERE/$GITHUB_TOKEN/g" ~/.profile
sed -i "s/YOUR_BRAVE_API_KEY_HERE/$BRAVE_API_KEY/g" ~/.profile
sed -i "s/YOUR_FIRECRAWL_API_KEY_HERE/$FIRECRAWL_API_KEY/g" ~/.profile

# Source the updated files
echo "🔄 Reloading shell configuration..."
source ~/.bashrc
source ~/.profile

# Export for current session
export GITHUB_TOKEN="$GITHUB_TOKEN"
export BRAVE_API_KEY="$BRAVE_API_KEY"
export FIRECRAWL_API_KEY="$FIRECRAWL_API_KEY"

echo ""
echo "✅ API keys have been updated successfully!"
echo ""
echo "🔍 Verifying environment variables:"
echo "GITHUB_TOKEN: ${GITHUB_TOKEN:0:20}..." 
echo "BRAVE_API_KEY: ${BRAVE_API_KEY:0:20}..."
echo "FIRECRAWL_API_KEY: ${FIRECRAWL_API_KEY:0:20}..."
echo "SUPABASE_ACCESS_TOKEN: ${SUPABASE_ACCESS_TOKEN:0:20}..."
echo ""
echo "🎯 Next steps:"
echo "1. Close Claude Desktop if it's running"
echo "2. Restart Claude Desktop to load the new configuration"
echo "3. Test the MCP servers to ensure they work properly"
echo ""
echo "💡 Tip: You can now use GitHub, Brave Search, and Firecrawl MCP servers!"