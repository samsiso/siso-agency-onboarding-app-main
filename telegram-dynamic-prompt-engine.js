// 🚀 TELEGRAM DYNAMIC PROMPT ENGINE
// Provides contextual tool awareness that scales automatically

class TelegramPromptEngine {
  constructor() {
    this.toolRegistry = this.initializeToolRegistry();
    this.contextTemplates = this.initializeContextTemplates();
  }

  // 🔧 TOOL REGISTRY - Add new tools here and they become available instantly
  initializeToolRegistry() {
    return {
      supabase_database: {
        name: "Supabase Database",
        type: "data_query",
        capabilities: [
          "financial_data_retrieval",
          "team_performance_analysis", 
          "project_status_tracking",
          "client_management",
          "task_management",
          "business_intelligence"
        ],
        triggers: [
          "expenses", "revenue", "financial", "money", "cost", "spent", "earned",
          "team", "performance", "sarah", "michael", "emma", "partner", "commission",
          "project", "status", "progress", "ubahcryp", "techstart", "omnifoods",
          "client", "lead", "pipeline", "conversion",
          "task", "todo", "pending", "completed",
          "stats", "analytics", "report", "summary", "total", "how much", "show me"
        ],
        schema: {
          financial_transactions: ["amount", "description", "date", "type", "category_id"],
          team_members: ["name", "total_revenue", "commission_rate", "tier", "conversions"],
          portfolio_items: ["title", "estimated_price", "project_status", "client_name"],
          tasks: ["title", "description", "priority", "category", "status"],
          projects: ["title", "progress", "status", "completion_date"]
        },
        example_queries: [
          "SELECT SUM(amount) FROM financial_transactions WHERE type = 'expense'",
          "SELECT name, total_revenue FROM team_members ORDER BY total_revenue DESC",
          "SELECT COUNT(*) FROM tasks WHERE status = 'pending'"
        ]
      },

      github_integration: {
        name: "GitHub Integration", 
        type: "issue_management",
        capabilities: [
          "bug_report_creation",
          "feature_request_tracking",
          "issue_management",
          "repository_operations"
        ],
        triggers: [
          "bug", "error", "broken", "not working", "issue", "problem",
          "feature", "enhancement", "improvement", "add", "create",
          "github", "repository", "code", "development"
        ],
        actions: [
          "create_issue",
          "update_issue", 
          "add_comment",
          "assign_developer"
        ],
        example_usage: [
          "Bug: Login not working → Creates GitHub issue with bug label",
          "Feature: Add dark mode → Creates feature request issue"
        ]
      },

      voice_transcription: {
        name: "Voice Transcription",
        type: "input_processing",
        capabilities: [
          "voice_to_text_conversion",
          "audio_message_processing",
          "multilingual_support"
        ],
        triggers: ["voice_message"],
        provider: "Groq Whisper API",
        supported_formats: ["ogg", "mp3", "wav", "m4a"]
      },

      ai_analysis: {
        name: "AI Message Analysis",
        type: "intelligence",
        capabilities: [
          "intent_classification",
          "priority_assessment", 
          "component_identification",
          "action_routing",
          "context_understanding"
        ],
        provider: "Groq llama3-8b-8192",
        analysis_categories: [
          "type: bug/feature/enhancement/documentation/task/query",
          "priority: ASAP/High/Medium/Low",
          "component: dashboard/auth/client/partnership/admin/financial/projects",
          "action: github/database_query/todo/automation"
        ]
      },

      // 🔄 EXTENSIBLE - Add new tools here
      email_automation: {
        name: "Email Automation",
        type: "communication",
        capabilities: ["send_email", "schedule_email", "template_management"],
        triggers: ["email", "send", "notify", "contact"],
        status: "planned" // Will be implemented
      }
    };
  }

  // 📝 CONTEXT TEMPLATES - Modular prompt sections
  initializeContextTemplates() {
    return {
      base_identity: `
🤖 SISO AGENCY BUSINESS ASSISTANT
You are an advanced AI assistant with direct access to comprehensive business management tools.
Your role is to provide accurate, data-driven responses and execute business operations efficiently.
`,

      supabase_context: `
📊 DATABASE ACCESS (Supabase MCP)
You have full access to a 105-table business database including:

FINANCIAL DATA:
- financial_transactions: Track all expenses/revenue (£409.58 software spend YTD)
- invoices: Invoice management
- commissions: Partner commission tracking

TEAM DATA:  
- team_members: Performance tracking (Sarah Johnson: £72K revenue, 85% conversion)
- partners: Partner management with tiers (Platinum/Gold/Silver)

PROJECT DATA:
- portfolio_items: Live projects (TechStart £12K in progress, OmniFoods £2.5K completed)
- projects: Project lifecycle management (UbahCryp 75% complete)
- tasks: Task management system

QUERY CAPABILITIES:
- Execute any SQL query for real-time data
- Generate business intelligence reports  
- Track KPIs and performance metrics
- Analyze trends and patterns

EXAMPLE QUERIES:
"How much did we spend on software?" → Query financial_transactions for software expenses
"How is Sarah performing?" → Query team_members for Sarah's metrics
"What's our pipeline value?" → Query portfolio_items for project values
`,

      github_context: `
🔧 GITHUB INTEGRATION
Direct integration with GitHub for development workflow:

CAPABILITIES:
- Create issues for bugs/features
- Assign priorities and labels
- Track development progress
- Link to repositories

WHEN TO USE:
- Bug reports → Create GitHub issue with bug label
- Feature requests → Create GitHub issue with enhancement label  
- Development tasks → Create issue with appropriate component label
`,

      decision_framework: `
🎯 DECISION FRAMEWORK

ANALYZE MESSAGE → DETERMINE TOOLS NEEDED → EXECUTE ACTION

FOR DATA QUESTIONS (expenses, revenue, performance, stats):
→ Use Supabase Database Query

FOR BUG REPORTS OR FEATURE REQUESTS:  
→ Use GitHub Integration

FOR GENERAL TASKS OR REMINDERS:
→ Use Todo System

FOR VOICE MESSAGES:
→ First transcribe, then analyze and route appropriately
`
    };
  }

  // 🔍 MESSAGE ANALYSIS - Determines which tools are needed
  analyzeMessage(message) {
    const analysis = {
      intent: null,
      required_tools: [],
      confidence: 0,
      suggested_action: null
    };

    // Check each tool's triggers
    for (const [toolId, tool] of Object.entries(this.toolRegistry)) {
      if (tool.triggers) {
        const matches = tool.triggers.filter(trigger => 
          message.toLowerCase().includes(trigger.toLowerCase())
        );
        
        if (matches.length > 0) {
          analysis.required_tools.push({
            tool: toolId,
            matches: matches,
            confidence: matches.length / tool.triggers.length
          });
        }
      }
    }

    // Sort by confidence
    analysis.required_tools.sort((a, b) => b.confidence - a.confidence);
    
    // Determine primary intent
    if (analysis.required_tools.length > 0) {
      const primaryTool = analysis.required_tools[0];
      analysis.intent = this.toolRegistry[primaryTool.tool].type;
      analysis.confidence = primaryTool.confidence;
      analysis.suggested_action = this.determineSuggestedAction(primaryTool.tool, message);
    }

    return analysis;
  }

  // 🎯 ACTION DETERMINATION
  determineSuggestedAction(toolId, message) {
    const tool = this.toolRegistry[toolId];
    
    switch (toolId) {
      case 'supabase_database':
        if (message.includes('how much') || message.includes('total') || message.includes('spent')) {
          return 'financial_query';
        } else if (message.includes('performance') || message.includes('sarah') || message.includes('team')) {
          return 'team_performance_query';
        } else if (message.includes('project') || message.includes('status')) {
          return 'project_status_query';
        }
        return 'general_database_query';
        
      case 'github_integration':
        if (message.includes('bug') || message.includes('error') || message.includes('broken')) {
          return 'create_bug_issue';
        } else if (message.includes('feature') || message.includes('add') || message.includes('enhancement')) {
          return 'create_feature_request';
        }
        return 'create_general_issue';
        
      default:
        return 'route_to_todo';
    }
  }

  // 🚀 DYNAMIC PROMPT BUILDER - Builds contextual prompts
  buildContextualPrompt(message, analysis) {
    let prompt = this.contextTemplates.base_identity;

    // Add relevant tool contexts based on analysis
    if (analysis.required_tools.length > 0) {
      analysis.required_tools.forEach(toolInfo => {
        const toolId = toolInfo.tool;
        
        switch (toolId) {
          case 'supabase_database':
            prompt += this.contextTemplates.supabase_context;
            // Add specific schema context if needed
            prompt += this.buildDatabaseSchemaContext(analysis.suggested_action);
            break;
            
          case 'github_integration':
            prompt += this.contextTemplates.github_context;
            break;
        }
      });
    }

    // Always add decision framework
    prompt += this.contextTemplates.decision_framework;

    // Add current message context
    prompt += `\n\n🎯 CURRENT REQUEST:\n"${message}"\n\n`;
    
    // Add analysis context
    prompt += `📊 ANALYSIS:\n`;
    prompt += `Intent: ${analysis.intent}\n`;
    prompt += `Suggested Action: ${analysis.suggested_action}\n`;
    prompt += `Required Tools: ${analysis.required_tools.map(t => t.tool).join(', ')}\n\n`;

    // Add specific instructions based on suggested action
    prompt += this.buildActionInstructions(analysis.suggested_action);

    return prompt;
  }

  // 🗃️ DATABASE SCHEMA CONTEXT - Adds relevant schema info
  buildDatabaseSchemaContext(action) {
    const schemas = this.toolRegistry.supabase_database.schema;
    let context = `\n📋 RELEVANT DATABASE SCHEMA:\n`;

    switch (action) {
      case 'financial_query':
        context += `financial_transactions: ${schemas.financial_transactions.join(', ')}\n`;
        context += `Example: SELECT SUM(ABS(amount)) FROM financial_transactions WHERE type = 'expense'\n`;
        break;
        
      case 'team_performance_query':
        context += `team_members: ${schemas.team_members.join(', ')}\n`;
        context += `Example: SELECT name, total_revenue, tier FROM team_members ORDER BY total_revenue DESC\n`;
        break;
        
      case 'project_status_query':
        context += `portfolio_items: ${schemas.portfolio_items.join(', ')}\n`;
        context += `projects: ${schemas.projects.join(', ')}\n`;
        break;
        
      default:
        // Add all schemas for general queries
        Object.entries(schemas).forEach(([table, columns]) => {
          context += `${table}: ${columns.join(', ')}\n`;
        });
    }

    return context;
  }

  // 📋 ACTION INSTRUCTIONS - Specific instructions for each action type
  buildActionInstructions(action) {
    const instructions = {
      financial_query: `
🎯 EXECUTE FINANCIAL QUERY:
1. Generate appropriate SQL query for financial_transactions table
2. Execute query using Supabase MCP
3. Format response with totals, breakdowns, and insights
4. Include actionable recommendations if relevant

RESPONSE FORMAT:
💰 [Total Amount]: £X.XX
📊 Breakdown: [List major categories]
📈 Insights: [Key observations]
💡 Recommendations: [If applicable]
`,

      team_performance_query: `
🎯 EXECUTE TEAM PERFORMANCE QUERY:
1. Query team_members table for performance metrics
2. Include revenue, conversions, commission data
3. Provide comparative analysis
4. Highlight top performers and areas for improvement

RESPONSE FORMAT:
👥 Team Performance Summary:
🏆 Top Performer: [Name] - £X revenue, Y% conversion
📊 Team Stats: [Overall metrics]
💡 Insights: [Performance observations]
`,

      project_status_query: `
🎯 EXECUTE PROJECT STATUS QUERY:
1. Query portfolio_items and projects tables
2. Show current status, progress, and values
3. Identify projects needing attention
4. Provide timeline and completion insights

RESPONSE FORMAT:
📊 Project Portfolio:
🚀 Active Projects: [List with status]
💰 Total Value: £X.XX
⚠️ Attention Needed: [If any]
`,

      create_bug_issue: `
🎯 CREATE GITHUB BUG ISSUE:
1. Extract bug details from message
2. Create GitHub issue with bug label
3. Include reproduction steps if mentioned
4. Assign appropriate priority

RESPONSE FORMAT:
🐛 Bug Report Created:
📝 Issue #X: [Title]
🔗 Link: [GitHub URL]
⚡ Priority: [High/Medium/Low]
`,

      create_feature_request: `
🎯 CREATE GITHUB FEATURE REQUEST:
1. Extract feature requirements from message
2. Create GitHub issue with enhancement label
3. Include user story format if possible
4. Estimate complexity if mentioned

RESPONSE FORMAT:
✨ Feature Request Created:
📝 Issue #X: [Title]
🔗 Link: [GitHub URL]
📊 Complexity: [If estimated]
`
    };

    return instructions[action] || `
🎯 GENERAL INSTRUCTION:
Analyze the request and execute the most appropriate action based on available tools and context.
Provide a helpful, accurate response with specific data when possible.
`;
  }

  // 🔄 TOOL REGISTRATION - Add new tools dynamically
  registerTool(toolId, toolConfig) {
    this.toolRegistry[toolId] = toolConfig;
    console.log(`✅ Registered new tool: ${toolConfig.name}`);
  }

  // 📊 GET TOOL INVENTORY - For debugging and monitoring
  getToolInventory() {
    return Object.keys(this.toolRegistry).map(toolId => ({
      id: toolId,
      name: this.toolRegistry[toolId].name,
      type: this.toolRegistry[toolId].type,
      capabilities: this.toolRegistry[toolId].capabilities
    }));
  }
}

// 🚀 USAGE EXAMPLE
const promptEngine = new TelegramPromptEngine();

// Example usage in your server.js:
async function processMessageWithDynamicPrompt(message) {
  // 1. Analyze message to determine required tools
  const analysis = promptEngine.analyzeMessage(message);
  
  // 2. Build contextual prompt with only relevant tool information
  const contextualPrompt = promptEngine.buildContextualPrompt(message, analysis);
  
  // 3. Send to Groq API with perfect context
  const response = await groqAPI(contextualPrompt);
  
  return response;
}

// 🔧 ADDING NEW TOOLS (Example: Email Automation)
promptEngine.registerTool('email_automation', {
  name: "Email Automation",
  type: "communication",
  capabilities: ["send_email", "schedule_email", "template_management"],
  triggers: ["email", "send", "notify", "contact", "message"],
  actions: ["send_immediate", "schedule_later", "use_template"],
  example_usage: [
    "Send email to client → Triggers email automation",
    "Schedule follow-up → Creates scheduled email"
  ]
});

module.exports = { TelegramPromptEngine }; 