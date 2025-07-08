#!/usr/bin/env node

// 🚀 ENHANCE EXISTING SERVER WITH NOTION INTEGRATION
// Updates server.js to include comprehensive Notion features

const fs = require('fs');
const path = require('path');

class ServerNotionEnhancer {
  constructor() {
    this.serverPath = 'server.js';
    this.backupPath = 'server.js.notion-backup';
  }

  async enhance() {
    console.log('🚀 ENHANCING SERVER WITH NOTION INTEGRATION');
    console.log('===========================================\n');

    try {
      // Step 1: Backup existing server
      await this.backupExistingServer();
      
      // Step 2: Read current server content
      const serverContent = await this.readServerContent();
      
      // Step 3: Add Notion imports
      const enhancedContent = this.addNotionImports(serverContent);
      
      // Step 4: Add Notion initialization
      const withNotionInit = this.addNotionInitialization(enhancedContent);
      
      // Step 5: Enhance message processing
      const withEnhancedProcessing = this.enhanceMessageProcessing(withNotionInit);
      
      // Step 6: Add Notion endpoints
      const withNotionEndpoints = this.addNotionEndpoints(withEnhancedProcessing);
      
      // Step 7: Write enhanced server
      await this.writeEnhancedServer(withNotionEndpoints);
      
      // Step 8: Create integration summary
      await this.createIntegrationSummary();

      console.log('✅ SERVER ENHANCEMENT COMPLETE!');
      console.log('🔗 Check SERVER_NOTION_INTEGRATION.md for details');

    } catch (error) {
      console.error('❌ Enhancement failed:', error.message);
      await this.restoreBackup();
    }
  }

  async backupExistingServer() {
    if (fs.existsSync(this.serverPath)) {
      fs.copyFileSync(this.serverPath, this.backupPath);
      console.log(`✓ Backed up existing server to ${this.backupPath}`);
    }
  }

  async readServerContent() {
    return fs.readFileSync(this.serverPath, 'utf8');
  }

  addNotionImports(content) {
    console.log('📦 Adding Notion imports...');

    const notionImports = `
// 📝 NOTION INTEGRATION IMPORTS
const { EnhancedNotionManager } = require('./notion-enhanced-integration');
const { notionService } = require('./src/services/notionService.ts');
`;

    // Insert after existing imports
    const insertPoint = content.indexOf('const app = express();');
    if (insertPoint === -1) {
      throw new Error('Could not find insertion point for Notion imports');
    }

    return content.slice(0, insertPoint) + notionImports + '\n' + content.slice(insertPoint);
  }

  addNotionInitialization(content) {
    console.log('⚙️ Adding Notion initialization...');

    const notionInit = `
// 📝 INITIALIZE ENHANCED NOTION MANAGER
const enhancedNotionManager = new EnhancedNotionManager();

console.log('📝 Notion integration initialized');
`;

    // Insert after existing initializations
    const insertPoint = content.indexOf('console.log(\'🚀 SISO Telegram Webhook Server Starting...\');');
    if (insertPoint === -1) {
      throw new Error('Could not find insertion point for Notion initialization');
    }

    return content.slice(0, insertPoint) + notionInit + '\n' + content.slice(insertPoint);
  }

  enhanceMessageProcessing(content) {
    console.log('🧠 Enhancing message processing...');

    // Replace the handleEnhancedAnalysisResult function
    const enhancedHandlerFunction = `
// 🚀 ENHANCED ANALYSIS RESULT HANDLER WITH NOTION
async function handleEnhancedAnalysisResult(chatId, originalMessage, result) {
  try {
    console.log('🎯 Processing enhanced analysis result...');
    
    // 1. First check for Notion intents
    const notionIntent = enhancedNotionManager.detectEnhancedIntent(originalMessage);
    console.log('🔍 Notion intent detected:', notionIntent);
    
    if (notionIntent.type !== 'unknown') {
      return await handleNotionIntent(chatId, originalMessage, notionIntent, result);
    }
    
    // 2. Check for voice response preference
    if (result.requiresVoice) {
      console.log('🎤 Voice response requested');
      await sendVoiceResponse(chatId, result.response);
      return;
    }
    
    // 3. Handle GitHub/repository operations
    if (result.analysis.tools.includes('github')) {
      console.log('🐙 GitHub operation detected');
      await handleGitHubOperation(chatId, originalMessage, result);
      return;
    }
    
    // 4. Handle financial queries
    if (result.analysis.tools.includes('financial')) {
      console.log('💰 Financial query detected');
      await handleFinancialQuery(chatId, originalMessage, result.response);
      return;
    }
    
    // 5. Default response with Notion context
    const notionContext = await enhancedNotionManager.generateDashboardSummary();
    const contextualResponse = await addNotionContextToResponse(result.response, notionContext);
    
    await sendTelegramMessage(chatId, contextualResponse);
    
  } catch (error) {
    console.error('❌ Enhanced analysis result handling failed:', error);
    await sendTelegramMessage(chatId, \`❌ Error: \${error.message}\`);
  }
}

// 📝 HANDLE NOTION INTENTS
async function handleNotionIntent(chatId, message, intent, analysisResult) {
  try {
    console.log(\`📝 Handling Notion intent: \${intent.type} - \${intent.action}\`);
    
    switch (intent.type) {
      case 'task':
        return await handleNotionTaskIntent(chatId, message, intent);
        
      case 'project':
        return await handleNotionProjectIntent(chatId, message, intent);
        
      case 'metric':
        return await handleNotionMetricIntent(chatId, message, intent);
        
      case 'query':
        return await handleNotionQueryIntent(chatId, message, intent);
        
      default:
        await sendTelegramMessage(chatId, analysisResult.response);
    }
    
  } catch (error) {
    console.error('❌ Notion intent handling failed:', error);
    await sendTelegramMessage(chatId, \`❌ Notion operation failed: \${error.message}\`);
  }
}

// 📝 HANDLE TASK CREATION
async function handleNotionTaskIntent(chatId, message, intent) {
  try {
    await sendTelegramMessage(chatId, '📝 Creating task in Notion...');
    
    const result = await enhancedNotionManager.createTaskFromText(message, chatId, 'Telegram');
    
    if (result.type === 'notion_task_created') {
      // Send success message with action buttons
      const keyboard = {
        inline_keyboard: [
          result.actionButtons.map(btn => ({
            text: btn.text,
            callback_data: btn.callback_data,
            url: btn.url
          }))
        ]
      };
      
      await sendTelegramMessage(chatId, result.message, keyboard);
      
      // Optional: Generate voice confirmation
      const voiceConfirmation = \`Task "\${result.task.title}" created successfully with \${result.task.priority} priority\`;
      await sendVoiceResponse(chatId, voiceConfirmation);
      
    } else {
      await sendTelegramMessage(chatId, result.message || '❌ Failed to create task');
    }
    
  } catch (error) {
    console.error('❌ Task creation failed:', error);
    await sendTelegramMessage(chatId, \`❌ Task creation failed: \${error.message}\`);
  }
}

// 🚀 HANDLE PROJECT CREATION
async function handleNotionProjectIntent(chatId, message, intent) {
  try {
    await sendTelegramMessage(chatId, '🚀 Creating project in Notion...');
    
    const result = await enhancedNotionManager.createProjectFromMessage(message, chatId);
    
    if (result.type === 'notion_project_created') {
      await sendTelegramMessage(chatId, result.message);
      
      // Voice confirmation
      const voiceConfirmation = \`Project "\${result.project.name}" created with \${result.tasks.length} initial tasks\`;
      await sendVoiceResponse(chatId, voiceConfirmation);
      
    } else {
      await sendTelegramMessage(chatId, '❌ Failed to create project');
    }
    
  } catch (error) {
    console.error('❌ Project creation failed:', error);
    await sendTelegramMessage(chatId, \`❌ Project creation failed: \${error.message}\`);
  }
}

// 📈 HANDLE METRIC RECORDING
async function handleNotionMetricIntent(chatId, message, intent) {
  try {
    await sendTelegramMessage(chatId, '📈 Recording metric in Notion...');
    
    const result = await enhancedNotionManager.recordBusinessMetric(message, chatId);
    
    if (result.type === 'notion_metric_recorded') {
      await sendTelegramMessage(chatId, result.message);
      
      // Voice confirmation with summary
      const voiceConfirmation = \`Recorded \${result.metric.type} of \${result.metric.value} dollars. Monthly net is \${(result.monthlySummary?.totalRevenue || 0) - (result.monthlySummary?.totalExpenses || 0)} dollars\`;
      await sendVoiceResponse(chatId, voiceConfirmation);
      
    } else {
      await sendTelegramMessage(chatId, '❌ Failed to record metric');
    }
    
  } catch (error) {
    console.error('❌ Metric recording failed:', error);
    await sendTelegramMessage(chatId, \`❌ Metric recording failed: \${error.message}\`);
  }
}

// 📊 HANDLE DASHBOARD QUERIES
async function handleNotionQueryIntent(chatId, message, intent) {
  try {
    await sendTelegramMessage(chatId, '📊 Generating dashboard summary...');
    
    const summary = await enhancedNotionManager.generateDashboardSummary();
    const formattedSummary = enhancedNotionManager.formatDashboardSummary(summary);
    
    await sendTelegramMessage(chatId, formattedSummary);
    
    // Voice summary
    const voiceSummary = \`You have \${summary.tasks.total} tasks, \${summary.projects.total} projects, and \${summary.metrics.totalRevenue} dollars in revenue this month\`;
    await sendVoiceResponse(chatId, voiceSummary);
    
  } catch (error) {
    console.error('❌ Dashboard query failed:', error);
    await sendTelegramMessage(chatId, \`❌ Dashboard query failed: \${error.message}\`);
  }
}

// 🎯 ADD NOTION CONTEXT TO RESPONSES
async function addNotionContextToResponse(originalResponse, notionContext) {
  if (!notionContext) return originalResponse;
  
  const contextSummary = \`

📊 **Quick Stats**:
• Tasks: \${notionContext.tasks.inProgress} in progress, \${notionContext.tasks.completed} completed
• Projects: \${notionContext.projects.active} active
• Revenue: $\${notionContext.metrics.totalRevenue.toLocaleString()} this month\`;

  return originalResponse + contextSummary;
}`;

    // Find and replace the existing handleEnhancedAnalysisResult function
    const functionStart = content.indexOf('async function handleEnhancedAnalysisResult(');
    if (functionStart === -1) {
      throw new Error('Could not find handleEnhancedAnalysisResult function');
    }

    // Find the end of the function by counting braces
    let braceCount = 0;
    let functionEnd = functionStart;
    let inFunction = false;

    for (let i = functionStart; i < content.length; i++) {
      if (content[i] === '{') {
        if (!inFunction) inFunction = true;
        braceCount++;
      } else if (content[i] === '}') {
        braceCount--;
        if (inFunction && braceCount === 0) {
          functionEnd = i + 1;
          break;
        }
      }
    }

    return content.slice(0, functionStart) + enhancedHandlerFunction + '\n' + content.slice(functionEnd);
  }

  addNotionEndpoints(content) {
    console.log('🌐 Adding Notion API endpoints...');

    const notionEndpoints = `
// 📝 NOTION API ENDPOINTS

// Health check for Notion integration
app.get('/notion/health', async (req, res) => {
  try {
    const health = await notionService.healthCheck();
    res.json({
      status: 'ok',
      notion: health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get dashboard summary
app.get('/notion/dashboard', async (req, res) => {
  try {
    const summary = await enhancedNotionManager.generateDashboardSummary();
    res.json({
      status: 'ok',
      data: summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Create task via API
app.post('/notion/tasks', async (req, res) => {
  try {
    const { message, chatId = CHAT_ID } = req.body;
    
    if (!message) {
      return res.status(400).json({
        status: 'error',
        error: 'Message is required'
      });
    }
    
    const result = await enhancedNotionManager.createTaskFromText(message, chatId, 'API');
    
    res.json({
      status: 'ok',
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Record metric via API
app.post('/notion/metrics', async (req, res) => {
  try {
    const { message, chatId = CHAT_ID } = req.body;
    
    if (!message) {
      return res.status(400).json({
        status: 'error',
        error: 'Message is required'
      });
    }
    
    const result = await enhancedNotionManager.recordBusinessMetric(message, chatId);
    
    res.json({
      status: 'ok',
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get tasks
app.get('/notion/tasks', async (req, res) => {
  try {
    const { status, project, limit = 50 } = req.query;
    
    const tasks = await notionService.getTasks({
      status,
      project,
      limit: parseInt(limit)
    });
    
    res.json({
      status: 'ok',
      data: tasks,
      count: tasks.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get projects
app.get('/notion/projects', async (req, res) => {
  try {
    const { status, client } = req.query;
    
    const projects = await notionService.getProjects({
      status,
      client
    });
    
    res.json({
      status: 'ok',
      data: projects,
      count: projects.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get metrics
app.get('/notion/metrics', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const metrics = await notionService.getMetrics({
      days: parseInt(days)
    });
    
    res.json({
      status: 'ok',
      data: metrics,
      count: metrics.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
`;

    // Insert before the server start
    const insertPoint = content.indexOf('app.listen(PORT');
    if (insertPoint === -1) {
      throw new Error('Could not find insertion point for Notion endpoints');
    }

    return content.slice(0, insertPoint) + notionEndpoints + '\n' + content.slice(insertPoint);
  }

  async writeEnhancedServer(content) {
    fs.writeFileSync(this.serverPath, content);
    console.log('✅ Enhanced server written successfully');
  }

  async createIntegrationSummary() {
    const summary = `# 🚀 SERVER NOTION INTEGRATION COMPLETE

## ✅ Enhancement Summary

Your SISO Telegram server has been successfully enhanced with comprehensive Notion integration!

### 🔧 Changes Made

#### 📦 New Imports Added
- \`EnhancedNotionManager\` - Advanced Notion operations
- \`notionService\` - Core Notion API service

#### 🧠 Enhanced Message Processing
- **Smart Intent Detection** - Automatically detects task, project, metric, and query intents
- **Voice Response Integration** - Notion confirmations via voice
- **Contextual Responses** - All responses include relevant Notion stats

#### 🌐 New API Endpoints
- \`GET /notion/health\` - Check Notion integration status
- \`GET /notion/dashboard\` - Get comprehensive dashboard summary
- \`POST /notion/tasks\` - Create tasks via API
- \`POST /notion/metrics\` - Record metrics via API
- \`GET /notion/tasks\` - Retrieve tasks with filters
- \`GET /notion/projects\` - Retrieve projects with filters
- \`GET /notion/metrics\` - Retrieve metrics with date filters

### 🎯 New Capabilities

#### 📝 Task Management
- **Voice Commands**: "Add task: Fix the login bug with high priority"
- **Smart Parsing**: Automatically detects priority, due dates, projects
- **Instant Feedback**: Voice confirmations and action buttons
- **Project Linking**: Auto-links tasks to existing projects

#### 🚀 Project Management
- **Natural Language**: "Create project: Website for ABC Company budget $10000"
- **Auto-generated Tasks**: Creates standard project tasks automatically
- **Client Association**: Links projects to clients
- **Progress Tracking**: Real-time project status updates

#### 📈 Business Metrics
- **Revenue Tracking**: "Record revenue $5000 from client payment"
- **Expense Management**: "Track expense $500 for software licenses"
- **Monthly Summaries**: Automatic financial summaries
- **Real-time Dashboards**: Live business metrics

#### 📊 Dashboard Queries
- **Voice Queries**: "Show my dashboard" or "What's my status?"
- **Comprehensive Stats**: Tasks, projects, revenue, expenses
- **Quick Summaries**: Voice-optimized status updates

### 🚀 Next Steps

1. **Restart Your Server**:
   \`\`\`bash
   npm run start
   # or
   node server.js
   \`\`\`

2. **Test Notion Integration**:
   \`\`\`bash
   node notion-quick-test.js
   \`\`\`

3. **Try Voice Commands**:
   - Send voice message: "Add task: Update the website"
   - Send text: "Create project: Mobile app for XYZ"
   - Ask: "Show my dashboard"

4. **Access API Endpoints**:
   - Health: \`http://localhost:3000/notion/health\`
   - Dashboard: \`http://localhost:3000/notion/dashboard\`
   - Tasks: \`http://localhost:3000/notion/tasks\`

### 🔧 Configuration

Ensure these environment variables are set:
\`\`\`env
NOTION_API_KEY=secret_your_notion_api_key
NOTION_TASKS_DB_ID=your_tasks_database_id
NOTION_PROJECTS_DB_ID=your_projects_database_id
NOTION_CLIENTS_DB_ID=your_clients_database_id
NOTION_METRICS_DB_ID=your_metrics_database_id
\`\`\`

### 📞 Support

If you encounter issues:
1. Check the backup file: \`server.js.notion-backup\`
2. Verify environment variables
3. Test with: \`node notion-quick-test.js\`
4. Check logs for detailed error messages

---

**Integration completed on**: ${new Date().toISOString()}
**Backup location**: ${this.backupPath}
**Next action**: Restart your server and test the integration!
`;

    fs.writeFileSync('SERVER_NOTION_INTEGRATION.md', summary);
    console.log('✅ Integration summary saved to SERVER_NOTION_INTEGRATION.md');
  }

  async restoreBackup() {
    if (fs.existsSync(this.backupPath)) {
      fs.copyFileSync(this.backupPath, this.serverPath);
      console.log('🔄 Restored server from backup');
    }
  }
}

// Run enhancement if called directly
if (require.main === module) {
  const enhancer = new ServerNotionEnhancer();
  enhancer.enhance().catch(console.error);
}

module.exports = { ServerNotionEnhancer }; 