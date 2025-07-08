# 🚀 TELEGRAM DYNAMIC PROMPT ENGINE INTEGRATION GUIDE

## 📋 OVERVIEW
Transform your Telegram bot from basic categorization to intelligent, context-aware business assistant with automatic tool discovery and dynamic prompt generation.

---

## 🔧 INTEGRATION STEPS

### 1. Add the Prompt Engine to Your Server

```javascript
// Add to your server.js imports
const { TelegramPromptEngine } = require('./telegram-dynamic-prompt-engine.js');

// Initialize the prompt engine
const promptEngine = new TelegramPromptEngine();
```

### 2. Replace Your Current Message Processing

**BEFORE (Current approach):**
```javascript
// Current static approach
const analysisPrompt = `Analyze this message and categorize it...`;
const analysisResponse = await groq.chat.completions.create({
  messages: [{ role: "user", content: analysisPrompt }],
  model: "llama3-8b-8192"
});
```

**AFTER (Dynamic approach):**
```javascript
// New dynamic approach
async function processMessageWithDynamicPrompt(message) {
  try {
    // 1. Analyze message to determine required tools
    const analysis = promptEngine.analyzeMessage(message);
    
    console.log('📊 Message Analysis:', analysis);
    
    // 2. Build contextual prompt with only relevant tool information
    const contextualPrompt = promptEngine.buildContextualPrompt(message, analysis);
    
    console.log('🎯 Generated Prompt Length:', contextualPrompt.length);
    
    // 3. Send to Groq API with perfect context
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: contextualPrompt }],
      model: "llama3-8b-8192",
      max_tokens: 1024,
      temperature: 0.3
    });
    
    return {
      analysis: analysis,
      response: response.choices[0].message.content,
      prompt_used: contextualPrompt.substring(0, 200) + '...' // For debugging
    };
    
  } catch (error) {
    console.error('❌ Error in dynamic prompt processing:', error);
    throw error;
  }
}
```

### 3. Update Your Webhook Handler

```javascript
// Replace your current webhook message handler
app.post('/webhook', async (req, res) => {
  try {
    const { message, callback_query } = req.body;
    
    if (message) {
      const chatId = message.chat.id;
      let messageText = '';
      
      // Handle voice messages
      if (message.voice) {
        console.log('🎤 Voice message received');
        const fileId = message.voice.file_id;
        const transcription = await transcribeVoice(fileId);
        messageText = transcription;
        
        // Send transcription confirmation
        await sendMessage(chatId, `🎤 Voice transcribed: "${transcription}"`);
      } else {
        messageText = message.text || '';
      }
      
      if (messageText) {
        // 🚀 USE DYNAMIC PROMPT ENGINE
        const result = await processMessageWithDynamicPrompt(messageText);
        
        // Send response based on analysis
        await handleAnalysisResult(chatId, messageText, result);
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).send('Error processing request');
  }
});
```

### 4. Create Analysis Result Handler

```javascript
async function handleAnalysisResult(chatId, originalMessage, result) {
  const { analysis, response } = result;
  
  // Log analysis for debugging
  console.log('📊 Analysis Result:', {
    intent: analysis.intent,
    suggested_action: analysis.suggested_action,
    required_tools: analysis.required_tools.map(t => t.tool)
  });
  
  // Execute specific actions based on analysis
  switch (analysis.suggested_action) {
    case 'financial_query':
      await handleFinancialQuery(chatId, originalMessage, response);
      break;
      
    case 'team_performance_query':
      await handleTeamPerformanceQuery(chatId, originalMessage, response);
      break;
      
    case 'project_status_query':
      await handleProjectStatusQuery(chatId, originalMessage, response);
      break;
      
    case 'create_bug_issue':
      await handleBugReport(chatId, originalMessage, response);
      break;
      
    case 'create_feature_request':
      await handleFeatureRequest(chatId, originalMessage, response);
      break;
      
    default:
      // Send AI response for general queries
      await sendMessage(chatId, response);
  }
}
```

### 5. Add Specific Action Handlers

```javascript
// 💰 FINANCIAL QUERY HANDLER
async function handleFinancialQuery(chatId, message, aiResponse) {
  try {
    // TODO: Add Supabase MCP integration here
    // For now, send AI analysis
    await sendMessage(chatId, `💰 Financial Query Analysis:\n\n${aiResponse}`);
    
    // Add quick action buttons
    const keyboard = {
      inline_keyboard: [
        [{ text: '📊 Detailed Breakdown', callback_data: 'financial_breakdown' }],
        [{ text: '📈 Monthly Trends', callback_data: 'financial_trends' }],
        [{ text: '💡 Cost Optimization', callback_data: 'cost_optimization' }]
      ]
    };
    
    await sendMessage(chatId, '🎯 What would you like to explore?', keyboard);
    
  } catch (error) {
    console.error('❌ Financial query error:', error);
    await sendMessage(chatId, '❌ Error processing financial query. Please try again.');
  }
}

// 👥 TEAM PERFORMANCE HANDLER
async function handleTeamPerformanceQuery(chatId, message, aiResponse) {
  try {
    await sendMessage(chatId, `👥 Team Performance Analysis:\n\n${aiResponse}`);
    
    const keyboard = {
      inline_keyboard: [
        [{ text: '🏆 Top Performers', callback_data: 'top_performers' }],
        [{ text: '📊 Individual Stats', callback_data: 'individual_stats' }],
        [{ text: '🎯 Performance Goals', callback_data: 'performance_goals' }]
      ]
    };
    
    await sendMessage(chatId, '🎯 Dive deeper into team performance:', keyboard);
    
  } catch (error) {
    console.error('❌ Team performance query error:', error);
    await sendMessage(chatId, '❌ Error processing team performance query.');
  }
}

// 🚀 PROJECT STATUS HANDLER
async function handleProjectStatusQuery(chatId, message, aiResponse) {
  try {
    await sendMessage(chatId, `🚀 Project Status Analysis:\n\n${aiResponse}`);
    
    const keyboard = {
      inline_keyboard: [
        [{ text: '📋 Active Projects', callback_data: 'active_projects' }],
        [{ text: '⚠️ Attention Needed', callback_data: 'projects_attention' }],
        [{ text: '💰 Project Values', callback_data: 'project_values' }]
      ]
    };
    
    await sendMessage(chatId, '🎯 Project management options:', keyboard);
    
  } catch (error) {
    console.error('❌ Project status query error:', error);
    await sendMessage(chatId, '❌ Error processing project status query.');
  }
}

// 🐛 BUG REPORT HANDLER
async function handleBugReport(chatId, message, aiResponse) {
  try {
    await sendMessage(chatId, `🐛 Bug Report Analysis:\n\n${aiResponse}`);
    
    const keyboard = {
      inline_keyboard: [
        [{ text: '✅ Create GitHub Issue', callback_data: 'create_github_issue' }],
        [{ text: '🔄 Add More Details', callback_data: 'add_bug_details' }],
        [{ text: '📋 View Similar Issues', callback_data: 'similar_issues' }]
      ]
    };
    
    await sendMessage(chatId, '🎯 Next steps for bug report:', keyboard);
    
  } catch (error) {
    console.error('❌ Bug report error:', error);
    await sendMessage(chatId, '❌ Error processing bug report.');
  }
}
```

### 6. Add Tool Registration for Future Expansion

```javascript
// 🔧 REGISTER NEW TOOLS DYNAMICALLY
function registerNewTools() {
  // Example: Email automation
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
  
  // Example: Calendar integration
  promptEngine.registerTool('calendar_integration', {
    name: "Calendar Integration",
    type: "scheduling",
    capabilities: ["schedule_meeting", "check_availability", "send_invites"],
    triggers: ["meeting", "schedule", "calendar", "appointment", "book"],
    actions: ["create_meeting", "check_conflicts", "send_invites"],
    example_usage: [
      "Schedule meeting with client → Creates calendar event",
      "Check my availability → Queries calendar"
    ]
  });
  
  console.log('✅ New tools registered successfully');
}

// Call during server startup
registerNewTools();
```

---

## 🎯 IMPLEMENTATION BENEFITS

### Before Dynamic Prompt Engine:
- ❌ Static prompts with limited context
- ❌ Agent doesn't know about database capabilities
- ❌ Routes data questions to todo system incorrectly
- ❌ No awareness of available tools
- ❌ Difficult to add new capabilities

### After Dynamic Prompt Engine:
- ✅ **Contextual Awareness**: Agent knows exactly what tools are available
- ✅ **Smart Routing**: Data questions go to database, bugs to GitHub
- ✅ **Scalable Architecture**: Adding new tools is automatic
- ✅ **Reduced Prompt Bloat**: Only relevant context is included
- ✅ **Better Decision Making**: Clear decision framework for tool selection

---

## 🧪 TESTING THE INTEGRATION

### Test Messages to Verify Functionality:

1. **Financial Query**: "How much have we spent on software this year?"
   - Expected: Routes to `financial_query` action
   - Should include Supabase context and financial schema

2. **Team Performance**: "How is Sarah performing this month?"
   - Expected: Routes to `team_performance_query` action
   - Should include team_members schema context

3. **Bug Report**: "The login page is broken and showing errors"
   - Expected: Routes to `create_bug_issue` action
   - Should include GitHub integration context

4. **Feature Request**: "We need to add dark mode to the dashboard"
   - Expected: Routes to `create_feature_request` action
   - Should include GitHub integration context

5. **Project Status**: "What's the status of UbahCryp project?"
   - Expected: Routes to `project_status_query` action
   - Should include portfolio_items schema context

---

## 🔍 DEBUGGING AND MONITORING

### Add Logging to Track Performance:

```javascript
// Add to your message processing function
console.log('📊 Prompt Engine Analysis:', {
  message: message.substring(0, 50) + '...',
  intent: analysis.intent,
  confidence: analysis.confidence,
  tools_matched: analysis.required_tools.length,
  suggested_action: analysis.suggested_action,
  prompt_length: contextualPrompt.length
});

// Track tool inventory
console.log('🔧 Available Tools:', promptEngine.getToolInventory());
```

### Monitor Response Quality:
- Track which actions are triggered most frequently
- Monitor response accuracy for different query types
- Identify patterns in tool selection

---

## 🚀 NEXT STEPS

1. **Implement Supabase MCP Integration**: Add actual database queries to action handlers
2. **Add GitHub Integration**: Implement actual issue creation functionality
3. **Expand Tool Registry**: Add email, calendar, CRM integrations
4. **Optimize Prompts**: Fine-tune based on usage patterns
5. **Add Analytics**: Track tool usage and response quality

---

## 🎯 EXPECTED TRANSFORMATION

**From**: Basic categorization bot that routes everything to todos
**To**: Intelligent business assistant that:
- Queries real financial data from Supabase
- Creates GitHub issues for bugs/features
- Provides team performance insights
- Tracks project status and progress
- Automatically adapts to new tools and capabilities

This dynamic prompt engine will transform your Telegram bot into a comprehensive business intelligence assistant that scales automatically as you add new tools and capabilities! 