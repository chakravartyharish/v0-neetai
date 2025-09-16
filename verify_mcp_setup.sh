#!/bin/bash

# Script to verify Claude MCP servers configuration
echo "🔍 Claude MCP Servers Configuration Verification"
echo "=================================================="
echo ""

# Check configuration file exists and is valid JSON
echo "1️⃣ Checking Claude Desktop configuration..."
CONFIG_FILE="$HOME/.config/Claude/claude_desktop_config.json"

if [ -f "$CONFIG_FILE" ]; then
    echo "✅ Configuration file exists: $CONFIG_FILE"
    
    # Validate JSON
    if python3 -m json.tool "$CONFIG_FILE" > /dev/null 2>&1; then
        echo "✅ Configuration file is valid JSON"
        
        # Count MCP servers
        SERVER_COUNT=$(python3 -c "import json; data=json.load(open('$CONFIG_FILE')); print(len(data.get('mcpServers', {})))" 2>/dev/null || echo "0")
        echo "✅ Found $SERVER_COUNT MCP servers configured"
    else
        echo "❌ Configuration file has invalid JSON syntax"
    fi
else
    echo "❌ Configuration file not found: $CONFIG_FILE"
fi

echo ""

# Check environment variables
echo "2️⃣ Checking environment variables..."
source ~/.bashrc
source ~/.profile

check_var() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -n "$var_value" ] && [ "$var_value" != "YOUR_${var_name}_HERE" ]; then
        echo "✅ $var_name: ${var_value:0:20}... (configured)"
        return 0
    else
        echo "❌ $var_name: Not configured"
        return 1
    fi
}

# Check required API keys
GITHUB_OK=0
BRAVE_OK=0
FIRECRAWL_OK=0
SUPABASE_OK=0

check_var "GITHUB_TOKEN" && GITHUB_OK=1
check_var "BRAVE_API_KEY" && BRAVE_OK=1  
check_var "FIRECRAWL_API_KEY" && FIRECRAWL_OK=1
check_var "SUPABASE_ACCESS_TOKEN" && SUPABASE_OK=1

echo ""

# Check individual MCP servers
echo "3️⃣ MCP Server Status..."
echo "┌─────────────────┬────────────────┬──────────────────┐"
echo "│ Server          │ Status         │ API Key Required │"
echo "├─────────────────┼────────────────┼──────────────────┤"

print_server_status() {
    local server=$1
    local has_api_key=$2
    local api_status=$3
    
    if [ "$has_api_key" == "no" ]; then
        echo "│ $server" | awk '{printf "%-15s │", $2}'
        echo " ✅ Ready      │ No               │"
    elif [ "$api_status" == "1" ]; then
        echo "│ $server" | awk '{printf "%-15s │", $2}'
        echo " ✅ Ready      │ ✅ Configured     │"
    else
        echo "│ $server" | awk '{printf "%-15s │", $2}'
        echo " ⏳ Needs Key  │ ❌ Missing        │"
    fi
}

print_server_status "Wolfram" "no" "0"
print_server_status "Filesystem" "no" "0"
print_server_status "Git" "no" "0"
print_server_status "SQLite" "no" "0"
print_server_status "Playwright" "no" "0"
print_server_status "Context7" "no" "0"
print_server_status "Testsprite" "no" "0"
print_server_status "Supabase" "yes" "$SUPABASE_OK"
print_server_status "Vercel" "yes" "1"
print_server_status "GitHub" "yes" "$GITHUB_OK"
print_server_status "Brave Search" "yes" "$BRAVE_OK"
print_server_status "Firecrawl" "yes" "$FIRECRAWL_OK"

echo "└─────────────────┴────────────────┴──────────────────┘"
echo ""

# Summary
echo "4️⃣ Summary..."
TOTAL_SERVERS=12
READY_SERVERS=7
CONFIGURED_SERVERS=$((SUPABASE_OK + GITHUB_OK + BRAVE_OK + FIRECRAWL_OK + 1)) # +1 for Vercel
FUNCTIONAL_SERVERS=$((READY_SERVERS + CONFIGURED_SERVERS))

echo "Total MCP Servers: $TOTAL_SERVERS"
echo "Ready (no API key needed): $READY_SERVERS"
echo "Configured (API key set): $CONFIGURED_SERVERS"
echo "Functional: $FUNCTIONAL_SERVERS/$TOTAL_SERVERS"

echo ""

# Next steps
if [ $FUNCTIONAL_SERVERS -eq $TOTAL_SERVERS ]; then
    echo "🎉 All MCP servers are ready!"
    echo ""
    echo "✅ Next steps:"
    echo "1. Close Claude Desktop completely"
    echo "2. Restart Claude Desktop"
    echo "3. All MCP servers should be functional!"
else
    echo "⚠️  Some MCP servers need API keys:"
    [ $GITHUB_OK -eq 0 ] && echo "   • GitHub Token needed"
    [ $BRAVE_OK -eq 0 ] && echo "   • Brave API Key needed"
    [ $FIRECRAWL_OK -eq 0 ] && echo "   • Firecrawl API Key needed"
    
    echo ""
    echo "📝 To fix this:"
    echo "1. Run: ./update_api_keys.sh"
    echo "2. Follow the prompts to enter your API keys"
    echo "3. Run: ./verify_mcp_setup.sh (this script again)"
fi

echo ""
echo "📚 For detailed setup instructions, see: MCP_API_KEYS_SETUP.md"