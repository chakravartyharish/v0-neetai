# MCP Configuration Setup

This document explains how to set up the Model Context Protocol (MCP) configuration for the NEETAI project.

## Overview

The MCP configuration enables various AI tools and services to work with this project. The configuration is stored in `.mcp.json` which contains API keys and should never be committed to version control.

## Setup Instructions

1. Copy the template configuration:
   ```bash
   cp .mcp.json.example .mcp.json
   ```

2. Replace the placeholder values with your actual API keys:
   - `YOUR_SUPABASE_ACCESS_TOKEN`: Your Supabase project access token
   - `YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`: Your GitHub Personal Access Token
   - `YOUR_ANTHROPIC_API_KEY`: Your Anthropic Claude API key
   - `YOUR_PERPLEXITY_API_KEY`: Your Perplexity AI API key
   - `YOUR_PROJECT_REF`: Your Supabase project reference

3. Update the file paths in the configuration:
   - Replace `/path/to/your/project` with the actual path to your project

## Security Note

⚠️ **IMPORTANT**: Never commit your `.mcp.json` file to version control. It contains sensitive API keys. The file is already added to `.gitignore` to prevent accidental commits.

## Available MCP Servers

- **shadcn**: UI component management
- **supabase**: Database and backend services
- **BMAD-METHOD-Docs**: BMAD methodology documentation
- **github**: GitHub repository operations
- **task-master-ai**: Task management with AI

For more information about MCP, visit: https://modelcontextprotocol.io/