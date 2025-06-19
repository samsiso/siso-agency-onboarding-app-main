# 🤖 SISO Agency Automation System

## Overview

The SISO Agency Automation System is a comprehensive Claude Code integration that provides automated task execution, rate limiting, token usage tracking, and cost monitoring. This system allows you to automate development, testing, deployment, analysis, and maintenance tasks while maintaining strict control over API usage and costs.

## Architecture

### Core Components

1. **AutomationEngine** - Central orchestration and task management
2. **RateLimitManager** - Prevents API abuse and manages usage windows  
3. **TokenUsageTracker** - Tracks costs and provides usage analytics
4. **ClaudeCodeIntegration** - Direct interface with Claude Code CLI
5. **React Dashboard** - Visual management and monitoring interface

### Database Schema

The system uses Supabase with the following tables:
- `automation_tasks` - Task definitions and execution history
- `token_usage_history` - Detailed token consumption tracking
- `rate_limit_usage` - Real-time rate limiting data
- `rate_limit_config` - Configurable limits by category
- `token_limits_config` - Global usage limits and budgets
- `automation_analytics` - Pre-aggregated reporting data

## Features

### 🚀 Task Automation
- **Multi-category support**: Development, Testing, Deployment, Analysis, Maintenance
- **Priority queuing**: Urgent, High, Medium, Low priority levels
- **Template system**: Pre-built prompts for common tasks
- **Tool allowlists**: Granular control over Claude Code capabilities
- **Progress tracking**: Real-time execution monitoring

### 📊 Token & Cost Management
- **Real-time tracking**: Monitor token usage across all services
- **Cost calculation**: Automatic cost computation with service-specific rates
- **Budget controls**: Daily/monthly limits with emergency buffers
- **Usage analytics**: Historical trends and efficiency metrics
- **Alerts system**: Proactive notifications for usage thresholds

### 🛡️ Rate Limiting
- **Multi-window limits**: Per-minute, per-hour, per-day controls
- **Category-based limits**: Different limits for different task types
- **Request throttling**: Prevent API abuse and quota exhaustion
- **Automatic reset**: Time-based limit resets with countdown timers

### 📈 Analytics & Reporting
- **Performance metrics**: Execution times, success rates, efficiency
- **Cost breakdown**: Service and category-based cost analysis
- **Usage trends**: Historical patterns and predictions
- **Optimization recommendations**: AI-generated improvement suggestions

## Usage Guide

### 1. Installation & Setup

```bash
# Run the automated setup
./scripts/setup-automation.sh

# Or manual setup:
npm install
npm run build
supabase db push
```

### 2. Configuration

#### Environment Variables
```env
ANTHROPIC_API_KEY=your_api_key
SUPABASE_PROJECT_ID=your_project_id
CLAUDE_CODE_MAX_TOKENS=10000
AUTOMATION_MAX_CONCURRENT_JOBS=3
TOKEN_DAILY_LIMIT=100000
```

#### Claude Code Settings
```json
{
  "permissions": {
    "allow": [
      "ReadFile", "Edit", "Bash(git:*)", 
      "mcp_supabase_execute_sql"
    ]
  },
  "tokenLimits": {
    "daily": 100000,
    "perOperation": 10000
  }
}
```

### 3. Creating Automation Tasks

#### Using the Dashboard
1. Navigate to `/automation` in your app
2. Click "Create Task"
3. Select category and priority
4. Configure allowed tools
5. Write or select prompt template
6. Submit for execution

#### Programmatic API
```typescript
import { automationEngine } from '@/services/automation/AutomationEngine';

const task = await automationEngine.submitTask({
  name: 'Update API documentation',
  category: 'maintenance',
  priority: 'medium',
  prompt: 'Review and update API docs...',
  allowedTools: ['ReadFile', 'Edit'],
  estimatedTokens: 5000,
  createdBy: 'user-id'
});
```

#### Command Line
```bash
# Run automation with specific tools
claude -p "Fix TypeScript errors in components" \
  --allowedTools "ReadFile,Edit,Bash(tsc:*)" \
  --output-format json

# Run with automation settings
./scripts/run-automation.sh task-prompts/fix-bugs.txt development
```

### 4. Monitoring & Management

#### Dashboard Features
- **Real-time queue status**: See pending and active tasks
- **Token usage charts**: Visualize consumption patterns  
- **Rate limit indicators**: Monitor API usage against limits
- **Cost tracking**: Current spend and budget status
- **Task history**: Review completed automation results

#### API Monitoring
```typescript
// Get current automation status
const status = automationEngine.getAutomationStatus();

// Check token usage
const usage = await tokenTracker.getCurrentUsage('day');

// Monitor rate limits
const canProceed = await rateLimitManager.checkLimits('development', 5000);
```

## Task Categories

### 🔧 Development
- **Code generation**: Create new components, hooks, utilities
- **Bug fixes**: Automated error resolution and code repairs
- **Refactoring**: Code optimization and structure improvements
- **Feature implementation**: Add new functionality to existing code

**Example Tools**: `ReadFile`, `Edit`, `Bash(git:*)`, `Bash(npm:*)`

### 🧪 Testing  
- **Test creation**: Generate unit and integration tests
- **Test execution**: Run test suites and analyze results
- **Coverage analysis**: Identify untested code areas
- **Test maintenance**: Update tests for code changes

**Example Tools**: `ReadFile`, `Edit`, `Bash(npm test:*)`, `Bash(jest:*)`

### 🚀 Deployment
- **Build automation**: Compile and package applications
- **Environment setup**: Configure staging/production environments
- **Database migrations**: Apply schema changes safely
- **Health checks**: Verify deployment success

**Example Tools**: `Bash(docker:*)`, `Bash(git:*)`, `mcp_supabase_apply_migration`

### 📊 Analysis
- **Code analysis**: Performance profiling and optimization
- **Usage analytics**: User behavior and feature adoption
- **Security audits**: Vulnerability scanning and reporting
- **Performance monitoring**: Identify bottlenecks and issues

**Example Tools**: `ReadFile`, `mcp_supabase_execute_sql`, `WebFetch`

### 🔧 Maintenance
- **Dependency updates**: Safely upgrade packages and libraries
- **Code cleanup**: Remove dead code and optimize structure
- **Documentation**: Generate and update project documentation
- **Monitoring setup**: Configure alerts and health checks

**Example Tools**: `ReadFile`, `Edit`, `Bash(npm:*)`, `Bash(rm:*)`

## Rate Limits & Token Management

### Default Rate Limits

| Category | Tokens/Min | Tokens/Hour | Tokens/Day | Requests/Min |
|----------|------------|-------------|------------|--------------|
| Development | 1,000 | 15,000 | 100,000 | 5 |
| Testing | 500 | 8,000 | 50,000 | 3 |
| Deployment | 2,000 | 20,000 | 80,000 | 2 |
| Analysis | 800 | 12,000 | 60,000 | 4 |
| Maintenance | 300 | 5,000 | 30,000 | 2 |

### Token Cost Structure
- **Claude Code**: $0.008 per 1,000 tokens
- **Anthropic API**: $0.008 per 1,000 tokens  
- **OpenAI**: $0.002 per 1,000 tokens
- **Custom**: $0.005 per 1,000 tokens

### Budget Management
- **Daily Budget**: $50 default
- **Monthly Budget**: $1,000 default
- **Emergency Buffer**: 50,000 tokens reserved
- **Auto-alerts**: 75% and 90% usage warnings

## Security & Permissions

### Tool Access Control
```typescript
// Safe tools for read-only operations
const SAFE_TOOLS = ['ReadFile', 'Bash(git log:*)', 'Bash(find:*)'];

// Development tools with file editing
const DEV_TOOLS = [...SAFE_TOOLS, 'Edit', 'Bash(npm:*)'];

// Full access including destructive operations
const ADMIN_TOOLS = [...DEV_TOOLS, 'Bash(rm:*)', 'Bash(git push:*)'];
```

### Environment Isolation
- **Development**: Full tool access, lower rate limits
- **Staging**: Restricted tools, moderate limits
- **Production**: Read-only tools, emergency access only

### Audit Logging
All automation activities are logged with:
- User identification
- Tool usage tracking
- Token consumption
- Execution results
- Error details

## Troubleshooting

### Common Issues

#### High Token Usage
```typescript
// Check usage breakdown
const analytics = await tokenTracker.getTokenAnalytics(7);
console.log(analytics.efficiency);

// Optimize prompts
const optimizedPrompt = `Be concise: ${originalPrompt}`;
```

#### Rate Limit Errors
```typescript
// Check current limits
const status = await rateLimitManager.getStatus('development');

// Wait for reset
const waitTime = status.timeToReset.minute * 1000;
await new Promise(resolve => setTimeout(resolve, waitTime));
```

#### Failed Tasks
```typescript
// Review task logs
const task = await automationEngine.getTask(taskId);
console.log(task.error, task.logs);

// Retry with different tools
await automationEngine.retryTask(taskId, {
  allowedTools: ['ReadFile'] // Minimal tools
});
```

### Performance Optimization

#### Token Efficiency
- Use specific, focused prompts
- Limit tool access to minimum required
- Implement result caching where possible
- Batch similar operations together

#### Rate Limit Management
- Distribute tasks across time windows
- Use appropriate priority levels
- Monitor usage patterns and adjust limits
- Implement backoff strategies for failures

## API Reference

### AutomationEngine
```typescript
class AutomationEngine {
  async submitTask(task: AutomationTaskRequest): Promise<string>
  async getTask(taskId: string): Promise<AutomationTask>
  async cancelTask(taskId: string): Promise<void>
  async retryTask(taskId: string, options?: Partial<AutomationTaskRequest>): Promise<void>
  getAutomationStatus(): AutomationStatus
  async getAnalytics(timeRange: string): Promise<AutomationAnalytics>
}
```

### TokenUsageTracker
```typescript
class TokenUsageTracker {
  async recordUsage(service: string, tokens: number, category: string): Promise<void>
  getCurrentUsage(timeRange?: string): UsageSummary
  async canConsumeTokens(tokens: number): Promise<{ canProceed: boolean; reason?: string }>
  async getTokenAnalytics(days?: number): Promise<TokenAnalytics>
  getCostBreakdown(timeRange?: string): CostBreakdown
}
```

### RateLimitManager  
```typescript
class RateLimitManager {
  async checkLimits(category: string, estimatedTokens: number): Promise<RateLimitCheck>
  async recordUsage(category: string, tokens: number): Promise<void>
  getStatus(category?: string): RateLimitStatus
  async updateLimits(category: string, limits: Partial<RateLimit>): Promise<void>
}
```

## Future Enhancements

### Planned Features
- **Multi-user support**: Role-based access control
- **Workflow automation**: Chain multiple tasks together
- **Integration APIs**: Connect with external services
- **Advanced analytics**: ML-powered optimization suggestions
- **Template marketplace**: Community-shared task templates

### Experimental Features  
- **Auto-scaling**: Dynamic rate limit adjustment
- **Predictive analysis**: Forecast usage and costs
- **Smart queuing**: AI-powered task prioritization
- **Error recovery**: Automatic retry strategies

---

## Support

For questions and support:
- Check the troubleshooting section above
- Review task logs in the automation dashboard
- Monitor token usage and rate limits
- Contact the development team for critical issues

---

**Last Updated**: 2025-01-25  
**Version**: 1.0.0  
**Status**: Production Ready