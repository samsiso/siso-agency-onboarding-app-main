# MCP Troubleshooting Guide - Supabase Authentication Issues

## 🚨 **The Problem**
Getting persistent "Unauthorized" errors from Supabase MCP server:
```
Error: {"error":{"name":"Error","message":"Unauthorized. Please provide a valid access token to the MCP server via the --access-token flag or SUPABASE_ACCESS_TOKEN."}}
```

## 🔍 **What We've Tried & Learned**

### ❌ **FAILED ATTEMPTS:**

1. **Multiple Access Tokens Tested:**
   - `sb_secret_ovhCXeb5fVzgsjf5loZL1A_TkXcJNUC` (original)
   - `sbp_1fecf12b934a60b8664f14d55c94fff70461e405` (first attempt)
   - `sbp_f9196be9a0ce5b9eae1b5e6ea1c918752814b18e` (current)

2. **Multiple Configuration Methods:**
   ```json
   // Method 1: Command line arg only
   "args": ["--access-token", "TOKEN"]
   
   // Method 2: Environment variable only  
   "env": { "SUPABASE_ACCESS_TOKEN": "TOKEN" }
   
   // Method 3: Both methods
   "args": ["--access-token", "TOKEN"],
   "env": { "SUPABASE_ACCESS_TOKEN": "TOKEN" }
   ```

3. **Different Token Types:**
   - Personal Access Tokens (PAT) - `sbp_*`
   - Service Role JWT Keys
   - Anon Keys

4. **Added Project Reference:**
   ```json
   "args": [
     "-y",
     "@supabase/mcp-server-supabase@latest", 
     "--project-ref=avdgyrepwrvsvwgxrccr"
   ]
   ```

### ✅ **WHAT WORKS:**
- `get_project_url` operation returns correct URL
- MCP server connects and responds (not a connection issue)

### ❌ **WHAT FAILS:**
- `list_projects`
- `list_tables` 
- `execute_sql`
- All database operations

## 🧠 **Current Understanding**

### **Issue Type:** Token Permissions, NOT Token Passing
- The MCP server **IS** receiving the token
- The token **LACKS** permissions for database operations
- Error message is misleading (suggests no token vs insufficient permissions)

### **Evidence:**
1. Some operations work (suggests partial authentication)
2. Database operations fail (suggests permission scope issue)
3. Multiple restart attempts with different tokens all fail the same way

## 📋 **Current Configuration Files**

### **Claude Desktop Config:**
```json
{
  "globalShortcut": "Cmd+Shift+Space",
  "mcpServers": {
    "supabase-siso-agency": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=avdgyrepwrvsvwgxrccr"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_f9196be9a0ce5b9eae1b5e6ea1c918752814b18e"
      }
    }
  }
}
```

### **Project .env:**
```bash
SUPABASE_ACCESS_TOKEN=sbp_f9196be9a0ce5b9eae1b5e6ea1c918752814b18e
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzYzODA4MiwiZXhwIjoyMDU5MjE0MDgyfQ.FjMLrYyfPIx7Efw4MzjwY8LdXVj2HcDmFPSQdOiQDRw
SUPABASE_URL=https://avdgyrepwrvsvwgxrccr.supabase.co
```

## 🎯 **Next Steps to Try**

### **Option 1: Check Token Scopes in Supabase Dashboard**
- Go to Supabase Dashboard → Account → Access Tokens
- Check if there are permission settings we're missing
- Look for specific API scopes or database permissions

### **Option 2: Use Service Role Key as Access Token**
```json
"env": {
  "SUPABASE_ACCESS_TOKEN": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzYzODA4MiwiZXhwIjoyMDU5MjE0MDgyfQ.FjMLrYyfPIx7Efw4MzjwY8LdXVj2HcDmFPSQdOiQDRw"
}
```

### **Option 3: Alternative MCP Server Package**
Try the community version: `@supabase-community/supabase-mcp`

### **Option 4: Enable Debug Logging**
Add debug flags to see what the MCP server is actually doing:
```json
"args": [
  "-y",
  "@supabase/mcp-server-supabase@latest",
  "--project-ref=avdgyrepwrvsvwgxrccr",
  "--debug"
]
```

## ✅ **OFFICIAL CONFIGURATION TESTED**

### **Final Configuration (Per Official Docs):**
```json
{
  "globalShortcut": "Cmd+Shift+Space",
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "sbp_f9196be9a0ce5b9eae1b5e6ea1c918752814b18e"
      ]
    }
  }
}
```

### **Source:** Official Supabase MCP Server blog post (April 4, 2025)
- Removed environment variables
- Removed project-ref parameter  
- Using exact format from official documentation
- **RESULT: Still getting same "Unauthorized" error**

## 🚨 **CONCLUSION**
The issue is **NOT** configuration-related. We've tried:
- ✅ Multiple Personal Access Tokens
- ✅ Service Role Keys 
- ✅ Environment variables vs command line args
- ✅ With/without project-ref parameter
- ✅ Exact official configuration format

## 🎯 **Next Steps**
1. **Check Supabase account permissions** - Maybe the account needs specific setup
2. **Try different Supabase project** - Test with a fresh project
3. **Contact Supabase support** - This might be a platform-specific issue
4. **Check MCP server version** - There might be a bug in the current version

## 📝 **Status: CONFIGURATION VERIFIED, TOKEN ISSUE SUSPECTED**
Date: 2025-07-10  
Configuration matches official docs exactly. Issue likely with token permissions or Supabase account setup.

---
*This document will be updated as we make progress on resolving the authentication issue.*