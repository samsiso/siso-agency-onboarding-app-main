# Telegram AI Agent Architecture

## System Overview

The Telegram AI Agent is a powerful autonomous assistant that integrates with the SISO Agency platform to provide intelligent task management, code generation, and project automation through natural language interactions.

## Core Architecture

### 1. **Message Processing Pipeline**

```
User Input (Voice/Text) → Telegram Bot → AI Processing → Tool Execution → Response
```

#### Components:
- **Telegram Bot API**: Receives messages and voice notes
- **Voice Transcription**: Converts voice to text using Groq Whisper
- **Intent Recognition**: Uses Grok to determine task type and parameters
- **Tool Router**: Maps intents to appropriate tools
- **Response Generator**: Formats and sends responses (text/voice)

### 2. **Tool-Calling System**

The agent uses Grok's tool-calling capabilities to execute various tasks:

#### Available Tools:

```javascript
const tools = {
  // GitHub Operations
  createGitHubIssue: {
    description: "Create issue in any GitHub repository",
    parameters: {
      repo: "string", // e.g., "your-org/ubah-crypto"
      title: "string",
      body: "string",
      labels: "array"
    }
  },
  
  // Notion Operations
  addNotionTask: {
    description: "Add task to Notion daily tracker",
    parameters: {
      title: "string",
      description: "string",
      priority: "string",
      dueDate: "string"
    }
  },
  
  // Claude Code Integration
  startClaudeCode: {
    description: "Trigger Claude Code for code generation",
    parameters: {
      prompt: "string",
      projectContext: "string",
      outputFormat: "string"
    }
  },
  
  // Vercel Deployment
  deployToVercel: {
    description: "Deploy code to Vercel and get preview link",
    parameters: {
      projectId: "string",
      branch: "string",
      environment: "string"
    }
  },
  
  // Supabase Operations
  getClientInfo: {
    description: "Retrieve client information from Supabase",
    parameters: {
      clientId: "string",
      fields: "array"
    }
  },
  
  // Multi-Agent Coordination
  multiAgentCoordinator: {
    description: "Route tasks to appropriate AI models",
    parameters: {
      task: "string",
      complexity: "string",
      preferredModel: "string"
    }
  }
}
```

### 3. **Multi-Agent Architecture**

The system leverages multiple AI models for different tasks:

```
┌─────────────────────────────────────────────────────────┐
│                   Grok (Orchestrator)                    │
│            - Intent recognition                          │
│            - Tool selection                              │
│            - Response coordination                       │
└────────────────────┬────────────────────────────────────┘
                     │
       ┌─────────────┴─────────────┬─────────────────────┐
       │                           │                      │
┌──────▼──────┐          ┌────────▼────────┐   ┌────────▼────────┐
│ Groq Models │          │  Gemini Flash   │   │  Local Models   │
│ (Llama 70B) │          │  (Research)     │   │  (Ollama)       │
│ - Fast tasks│          │  - Web search   │   │  - Code gen     │
│ - Routing   │          │  - Analysis     │   │  - Cost-free    │
└─────────────┘          └─────────────────┘   └─────────────────┘
```

### 4. **State Management**

All agent state is stored in Supabase for persistence:

```sql
-- Agent conversation state
CREATE TABLE agent_conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  telegram_chat_id BIGINT,
  context JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Tool execution history
CREATE TABLE agent_tool_calls (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES agent_conversations(id),
  tool_name VARCHAR,
  parameters JSONB,
  result JSONB,
  execution_time_ms INTEGER,
  created_at TIMESTAMP
);

-- Project tracking
CREATE TABLE agent_projects (
  id UUID PRIMARY KEY,
  name VARCHAR,
  description TEXT,
  status VARCHAR,
  subtasks JSONB,
  progress INTEGER,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP
);
```

### 5. **Autonomous Project Handling**

For complex projects, the agent breaks down work into subtasks:

```javascript
// Example autonomous project flow
{
  project: "Build new Ubah feature",
  phases: [
    {
      name: "Planning",
      tasks: [
        "Analyze requirements",
        "Create technical spec",
        "Design UI mockups"
      ]
    },
    {
      name: "Implementation",
      tasks: [
        "Set up feature branch",
        "Implement backend API",
        "Build frontend components",
        "Write tests"
      ]
    },
    {
      name: "Deployment",
      tasks: [
        "Run quality checks",
        "Create PR",
        "Deploy to staging",
        "Notify stakeholders"
      ]
    }
  ]
}
```

## Integration Points

### 1. **Telegram Webhook**
```javascript
// Webhook endpoint: /api/telegram-webhook
POST /api/telegram-webhook
{
  update_id: 123456789,
  message: {
    message_id: 123,
    from: { id: 456, username: "user" },
    chat: { id: 789 },
    text: "Create GitHub issue for login bug",
    voice: { file_id: "..." } // For voice messages
  }
}
```

### 2. **Claude Code Server**
```javascript
// 24/7 PC endpoint
POST http://your-pc:3000/claude-code
{
  prompt: "Generate React login component",
  context: { project: "siso-app", style: "tailwind" }
}
```

### 3. **GitHub Integration**
```javascript
// Using Octokit
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
await octokit.rest.issues.create({
  owner: "your-org",
  repo: "ubah-crypto",
  title: "Fix login bug",
  body: "Generated by AI Agent"
});
```

### 4. **Notion Integration**
```javascript
// Using Notion SDK
const notion = new Client({ auth: process.env.NOTION_TOKEN });
await notion.pages.create({
  parent: { database_id: DAILY_TASKS_DB },
  properties: {
    title: { title: [{ text: { content: "Meeting prep" } }] },
    status: { select: { name: "To Do" } }
  }
});
```

## Security Considerations

1. **Authentication**: Verify Telegram user identity
2. **Rate Limiting**: Prevent abuse of AI resources
3. **Token Security**: Secure storage of API tokens
4. **Input Validation**: Sanitize user inputs
5. **Access Control**: Limit operations based on user role

## Performance Optimization

1. **Caching**: Cache frequent queries in Supabase
2. **Parallel Execution**: Run independent tools concurrently
3. **Model Selection**: Route to appropriate model based on task
4. **Batch Operations**: Group similar API calls
5. **Edge Functions**: Deploy critical paths to edge

## Next Steps

1. Review [Deployment Guide](../deployment/telegram-bot-setup.md)
2. Configure [Tool Integrations](./tool-configuration.md)
3. Set up [Voice Processing](../voice-assistant/groq-tts-setup.md)
4. Test with [Sample Commands](./sample-commands.md)