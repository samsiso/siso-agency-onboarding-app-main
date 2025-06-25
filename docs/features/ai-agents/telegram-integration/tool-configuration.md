# Tool Configuration Guide for Telegram AI Agent

## Overview

This guide details the configuration and implementation of tools that enable the Telegram AI Agent to perform autonomous tasks across multiple platforms and services.

## Tool Definition Schema

All tools follow a standardized schema for Grok's tool-calling system:

```typescript
interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
      required?: boolean;
    }>;
    required: string[];
  };
  handler: (params: any) => Promise<any>;
}
```

## Core Tool Implementations

### 1. GitHub Integration Tools

#### Create GitHub Issue

```javascript
const createGitHubIssue = {
  name: "createGitHubIssue",
  description: "Create an issue in any GitHub repository",
  parameters: {
    type: "object",
    properties: {
      repo: {
        type: "string",
        description: "Repository in format 'owner/repo'",
        enum: [
          "siso-agency/ubah-crypto",
          "siso-agency/siso-app",
          "siso-agency/marroca-activities",
          "siso-agency/ai-agent-system"
        ]
      },
      title: {
        type: "string",
        description: "Issue title"
      },
      body: {
        type: "string",
        description: "Issue description in markdown"
      },
      labels: {
        type: "array",
        description: "Labels to apply",
        items: { type: "string" }
      },
      assignees: {
        type: "array",
        description: "GitHub usernames to assign",
        items: { type: "string" }
      }
    },
    required: ["repo", "title", "body"]
  },
  handler: async (params) => {
    const { Octokit } = require("@octokit/rest");
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    
    const [owner, repo] = params.repo.split('/');
    
    const issue = await octokit.rest.issues.create({
      owner,
      repo,
      title: params.title,
      body: params.body + "\n\n---\n*Created by SISO AI Agent*",
      labels: params.labels || [],
      assignees: params.assignees || []
    });
    
    // Store in Supabase for tracking
    await supabase.from('agent_github_issues').insert({
      issue_number: issue.data.number,
      repo: params.repo,
      title: params.title,
      url: issue.data.html_url,
      created_by: 'telegram-agent'
    });
    
    return {
      success: true,
      issue_number: issue.data.number,
      url: issue.data.html_url
    };
  }
};
```

#### List Repository Issues

```javascript
const listGitHubIssues = {
  name: "listGitHubIssues",
  description: "List open issues across repositories",
  parameters: {
    type: "object",
    properties: {
      repos: {
        type: "array",
        description: "Repositories to check",
        items: { type: "string" }
      },
      state: {
        type: "string",
        enum: ["open", "closed", "all"],
        description: "Issue state filter"
      },
      labels: {
        type: "array",
        description: "Filter by labels",
        items: { type: "string" }
      }
    },
    required: ["repos"]
  },
  handler: async (params) => {
    const issues = [];
    
    for (const repo of params.repos) {
      const [owner, repoName] = repo.split('/');
      const response = await octokit.rest.issues.listForRepo({
        owner,
        repo: repoName,
        state: params.state || 'open',
        labels: params.labels?.join(',')
      });
      
      issues.push(...response.data.map(issue => ({
        repo,
        number: issue.number,
        title: issue.title,
        state: issue.state,
        url: issue.html_url,
        created_at: issue.created_at,
        labels: issue.labels.map(l => l.name)
      })));
    }
    
    return { issues, total: issues.length };
  }
};
```

### 2. Notion Integration Tools

#### Add Notion Task

```javascript
const addNotionTask = {
  name: "addNotionTask",
  description: "Add task to Notion daily task tracker",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Task title"
      },
      description: {
        type: "string",
        description: "Task details"
      },
      priority: {
        type: "string",
        enum: ["Low", "Medium", "High", "Urgent"],
        description: "Task priority"
      },
      category: {
        type: "string",
        enum: ["Development", "Marketing", "Client", "Admin", "Personal"],
        description: "Task category"
      },
      dueDate: {
        type: "string",
        description: "Due date in ISO format"
      }
    },
    required: ["title"]
  },
  handler: async (params) => {
    const { Client } = require("@notionhq/client");
    const notion = new Client({
      auth: process.env.NOTION_TOKEN
    });
    
    const page = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_TASKS_DB_ID
      },
      properties: {
        Name: {
          title: [{
            text: { content: params.title }
          }]
        },
        Description: {
          rich_text: [{
            text: { content: params.description || "" }
          }]
        },
        Priority: {
          select: { name: params.priority || "Medium" }
        },
        Category: {
          select: { name: params.category || "Development" }
        },
        "Due Date": params.dueDate ? {
          date: { start: params.dueDate }
        } : undefined,
        Status: {
          select: { name: "To Do" }
        },
        "Created By": {
          select: { name: "AI Agent" }
        }
      }
    });
    
    // Sync with Supabase
    await supabase.from('notion_tasks').insert({
      notion_page_id: page.id,
      title: params.title,
      description: params.description,
      priority: params.priority,
      category: params.category,
      due_date: params.dueDate,
      status: 'todo'
    });
    
    return {
      success: true,
      page_id: page.id,
      url: page.url
    };
  }
};
```

#### Update Notion Task Status

```javascript
const updateNotionTaskStatus = {
  name: "updateNotionTaskStatus",
  description: "Update status of existing Notion task",
  parameters: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "Notion page ID or task title"
      },
      status: {
        type: "string",
        enum: ["To Do", "In Progress", "Done", "Cancelled"],
        description: "New status"
      },
      notes: {
        type: "string",
        description: "Additional notes"
      }
    },
    required: ["taskId", "status"]
  },
  handler: async (params) => {
    // Implementation details...
  }
};
```

### 3. Claude Code Integration

#### Start Claude Code Task

```javascript
const startClaudeCode = {
  name: "startClaudeCode",
  description: "Trigger Claude Code for code generation tasks",
  parameters: {
    type: "object",
    properties: {
      prompt: {
        type: "string",
        description: "Detailed prompt for Claude"
      },
      project: {
        type: "string",
        enum: ["siso-app", "ubah-crypto", "marroca", "ai-agent"],
        description: "Target project"
      },
      taskType: {
        type: "string",
        enum: ["feature", "bug-fix", "refactor", "test", "documentation"],
        description: "Type of coding task"
      },
      context: {
        type: "object",
        description: "Additional context",
        properties: {
          files: { type: "array", items: { type: "string" } },
          dependencies: { type: "array", items: { type: "string" } },
          style: { type: "string" }
        }
      }
    },
    required: ["prompt", "project"]
  },
  handler: async (params) => {
    // Send to 24/7 PC Claude Code server
    const response = await fetch(`${process.env.CLAUDE_CODE_URL}/api/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CLAUDE_CODE_TOKEN}`
      },
      body: JSON.stringify({
        prompt: params.prompt,
        project: params.project,
        type: params.taskType,
        context: params.context,
        output: 'github' // Auto-commit to GitHub
      })
    });
    
    const result = await response.json();
    
    // Track in Supabase
    await supabase.from('claude_code_tasks').insert({
      prompt: params.prompt,
      project: params.project,
      task_type: params.taskType,
      result: result,
      status: result.success ? 'completed' : 'failed'
    });
    
    return result;
  }
};
```

### 4. Vercel Deployment Tool

```javascript
const deployToVercel = {
  name: "deployToVercel",
  description: "Deploy project to Vercel and get preview URL",
  parameters: {
    type: "object",
    properties: {
      project: {
        type: "string",
        enum: ["siso-app", "ubah-crypto", "marroca", "ai-agent-webhook"],
        description: "Project to deploy"
      },
      branch: {
        type: "string",
        description: "Git branch to deploy",
        default: "main"
      },
      environment: {
        type: "string",
        enum: ["production", "preview", "development"],
        description: "Deployment environment"
      },
      message: {
        type: "string",
        description: "Deployment message"
      }
    },
    required: ["project"]
  },
  handler: async (params) => {
    const projectIds = {
      "siso-app": process.env.VERCEL_SISO_PROJECT_ID,
      "ubah-crypto": process.env.VERCEL_UBAH_PROJECT_ID,
      "marroca": process.env.VERCEL_MARROCA_PROJECT_ID,
      "ai-agent-webhook": process.env.VERCEL_AGENT_PROJECT_ID
    };
    
    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: params.project,
        project: projectIds[params.project],
        target: params.environment || 'preview',
        gitSource: {
          ref: params.branch || 'main',
          repoId: process.env.GITHUB_REPO_ID
        },
        meta: {
          deployedBy: 'telegram-ai-agent',
          message: params.message || 'Deployed via AI Agent'
        }
      })
    });
    
    const deployment = await response.json();
    
    return {
      success: true,
      url: `https://${deployment.url}`,
      deploymentId: deployment.id,
      status: deployment.readyState
    };
  }
};
```

### 5. Supabase Integration Tools

#### Get Client Information

```javascript
const getClientInfo = {
  name: "getClientInfo",
  description: "Retrieve client information from Supabase",
  parameters: {
    type: "object",
    properties: {
      clientIdentifier: {
        type: "string",
        description: "Client name, email, or ID"
      },
      includeProjects: {
        type: "boolean",
        description: "Include project details"
      },
      includeTasks: {
        type: "boolean",
        description: "Include task list"
      },
      includeFinancials: {
        type: "boolean",
        description: "Include financial data"
      }
    },
    required: ["clientIdentifier"]
  },
  handler: async (params) => {
    // Search for client
    const { data: clients } = await supabase
      .from('client_onboarding')
      .select('*')
      .or(`business_name.ilike.%${params.clientIdentifier}%,email.ilike.%${params.clientIdentifier}%`)
      .limit(1);
    
    if (!clients?.length) {
      return { error: "Client not found" };
    }
    
    const client = clients[0];
    const result = { client };
    
    // Include related data
    if (params.includeProjects) {
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', client.id);
      result.projects = projects;
    }
    
    if (params.includeTasks) {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('client_id', client.id)
        .order('due_date', { ascending: true });
      result.tasks = tasks;
    }
    
    if (params.includeFinancials) {
      const { data: invoices } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('client_id', client.id)
        .eq('type', 'invoice');
      result.invoices = invoices;
    }
    
    return result;
  }
};
```

#### Manage Client Tasks

```javascript
const manageClientTodo = {
  name: "manageClientTodo",
  description: "Add or update tasks for specific clients",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["add", "update", "complete", "delete"],
        description: "Action to perform"
      },
      clientId: {
        type: "string",
        description: "Client ID"
      },
      taskData: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          priority: { type: "string" },
          due_date: { type: "string" }
        }
      },
      taskId: {
        type: "string",
        description: "Task ID for update/complete/delete"
      }
    },
    required: ["action"]
  },
  handler: async (params) => {
    switch (params.action) {
      case "add":
        return await supabase.from('tasks').insert({
          ...params.taskData,
          client_id: params.clientId,
          status: 'pending'
        });
        
      case "update":
        return await supabase
          .from('tasks')
          .update(params.taskData)
          .eq('id', params.taskId);
          
      case "complete":
        return await supabase
          .from('tasks')
          .update({ status: 'completed', completed_at: new Date() })
          .eq('id', params.taskId);
          
      case "delete":
        return await supabase
          .from('tasks')
          .delete()
          .eq('id', params.taskId);
    }
  }
};
```

### 6. Multi-Agent Coordination Tool

```javascript
const multiAgentCoordinator = {
  name: "multiAgentCoordinator",
  description: "Coordinate multiple AI agents for complex tasks",
  parameters: {
    type: "object",
    properties: {
      task: {
        type: "string",
        description: "Complex task description"
      },
      agents: {
        type: "array",
        description: "Specific agents to use",
        items: {
          type: "string",
          enum: ["groq-llama", "gemini-flash", "mixtral-local", "claude"]
        }
      },
      strategy: {
        type: "string",
        enum: ["sequential", "parallel", "iterative"],
        description: "Execution strategy"
      },
      subtasks: {
        type: "array",
        description: "Pre-defined subtasks",
        items: {
          type: "object",
          properties: {
            description: { type: "string" },
            agent: { type: "string" },
            dependencies: { type: "array", items: { type: "string" } }
          }
        }
      }
    },
    required: ["task"]
  },
  handler: async (params) => {
    const coordinator = new MultiAgentCoordinator();
    
    // Decompose task if subtasks not provided
    const subtasks = params.subtasks || 
      await coordinator.decomposeTask(params.task);
    
    // Execute based on strategy
    let results;
    switch (params.strategy || 'sequential') {
      case 'parallel':
        results = await coordinator.executeParallel(subtasks);
        break;
      case 'iterative':
        results = await coordinator.executeIterative(subtasks);
        break;
      default:
        results = await coordinator.executeSequential(subtasks);
    }
    
    // Aggregate results
    const finalResult = await coordinator.aggregateResults(results);
    
    // Store execution log
    await supabase.from('agent_executions').insert({
      task: params.task,
      strategy: params.strategy,
      subtasks: subtasks,
      results: results,
      final_result: finalResult,
      execution_time_ms: Date.now() - startTime
    });
    
    return finalResult;
  }
};
```

## Tool Registration and Routing

### Tool Registry

```javascript
class ToolRegistry {
  constructor() {
    this.tools = new Map();
    this.registerDefaultTools();
  }
  
  registerDefaultTools() {
    // GitHub tools
    this.register(createGitHubIssue);
    this.register(listGitHubIssues);
    
    // Notion tools
    this.register(addNotionTask);
    this.register(updateNotionTaskStatus);
    
    // Claude Code tools
    this.register(startClaudeCode);
    
    // Vercel tools
    this.register(deployToVercel);
    
    // Supabase tools
    this.register(getClientInfo);
    this.register(manageClientTodo);
    
    // Coordination tools
    this.register(multiAgentCoordinator);
  }
  
  register(tool) {
    this.tools.set(tool.name, tool);
  }
  
  getToolDefinitions() {
    return Array.from(this.tools.values()).map(tool => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }
    }));
  }
  
  async execute(toolName, parameters) {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }
    
    // Validate parameters
    this.validateParameters(tool, parameters);
    
    // Execute with error handling
    try {
      const result = await tool.handler(parameters);
      await this.logExecution(toolName, parameters, result, true);
      return result;
    } catch (error) {
      await this.logExecution(toolName, parameters, error, false);
      throw error;
    }
  }
  
  async logExecution(toolName, parameters, result, success) {
    await supabase.from('tool_executions').insert({
      tool_name: toolName,
      parameters: parameters,
      result: success ? result : null,
      error: success ? null : result.message,
      success: success,
      executed_at: new Date()
    });
  }
}
```

## Environment Configuration

### Required Environment Variables

```bash
# GitHub Integration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPO_ID=your_github_repo_id

# Notion Integration
NOTION_TOKEN=your_notion_integration_token
NOTION_TASKS_DB_ID=your_notion_tasks_database_id

# Claude Code Server
CLAUDE_CODE_URL=http://your-pc:3000
CLAUDE_CODE_TOKEN=your_claude_code_api_token

# Vercel Deployment
VERCEL_TOKEN=your_vercel_api_token
VERCEL_SISO_PROJECT_ID=your_siso_project_id
VERCEL_UBAH_PROJECT_ID=your_ubah_project_id
VERCEL_MARROCA_PROJECT_ID=your_marroca_project_id
VERCEL_AGENT_PROJECT_ID=your_agent_project_id

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# AI Models
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GROK_API_KEY=your_grok_api_key

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

## Testing Tools

### Tool Test Suite

```javascript
// test-tools.js
const testTools = async () => {
  const registry = new ToolRegistry();
  
  // Test GitHub tool
  console.log("Testing GitHub issue creation...");
  const issue = await registry.execute("createGitHubIssue", {
    repo: "siso-agency/ai-agent-system",
    title: "Test issue from AI Agent",
    body: "This is a test issue created by the tool testing suite",
    labels: ["test", "ai-agent"]
  });
  console.log("✓ GitHub issue created:", issue.url);
  
  // Test Notion tool
  console.log("Testing Notion task creation...");
  const task = await registry.execute("addNotionTask", {
    title: "Test task from AI Agent",
    description: "Testing Notion integration",
    priority: "Low",
    category: "Development"
  });
  console.log("✓ Notion task created:", task.page_id);
  
  // Add more tests...
};
```

## Security Considerations

1. **API Key Management**: Store all API keys in environment variables
2. **Rate Limiting**: Implement rate limits for each tool
3. **Input Validation**: Validate all parameters before execution
4. **Access Control**: Restrict tools based on user permissions
5. **Audit Logging**: Log all tool executions for security review

## Next Steps

1. Implement remaining tools from the specification
2. Set up tool authentication and authorization
3. Create tool usage documentation for end users
4. Build monitoring dashboard for tool analytics
5. Implement tool versioning and updates