// 🧠 TELEGRAM BOT - AI CONVERSATION ENGINE
// Advanced conversational AI with context awareness and memory

const { RepositoryManager } = require('./telegram-repository-config.js');

class ConversationEngine {
  constructor() {
    this.conversationHistory = new Map(); // userId -> conversation context
    this.userProfiles = new Map(); // userId -> user preferences & patterns
    this.repoManager = new RepositoryManager();
    this.contextWindow = 10; // Remember last 10 messages per user
  }

  // 🎯 Advanced Message Processing with Context
  async processMessage(userId, message, messageType = 'text') {
    // Get or create user context
    const userContext = this.getUserContext(userId);
    
    // Add message to conversation history
    this.addToHistory(userId, message, messageType);
    
    // Analyze message intent and context
    const analysis = await this.analyzeMessageIntent(message, userContext);
    
    // Generate intelligent response
    const response = await this.generateResponse(analysis, userContext);
    
    // Update user profile based on interaction
    this.updateUserProfile(userId, analysis);
    
    return {
      response: response,
      analysis: analysis,
      confidence: analysis.confidence,
      suggestedActions: analysis.suggestedActions
    };
  }

  // 🔍 Advanced Intent Analysis
  async analyzeMessageIntent(message, userContext) {
    const messageLower = message.toLowerCase();
    
    // Intent categories with confidence scoring
    const intents = {
      // Technical intents
      bug_report: this.calculateIntentScore(messageLower, ['bug', 'error', 'broken', 'not working', 'issue', 'problem']),
      feature_request: this.calculateIntentScore(messageLower, ['feature', 'add', 'new', 'enhancement', 'improve', 'could you']),
      question: this.calculateIntentScore(messageLower, ['how', 'what', 'why', 'when', 'where', 'help', '?']),
      
      // Business intents
      financial_query: this.calculateIntentScore(messageLower, ['money', 'cost', 'expense', 'budget', 'financial', 'revenue']),
      client_management: this.calculateIntentScore(messageLower, ['client', 'customer', 'user', 'onboarding']),
      project_management: this.calculateIntentScore(messageLower, ['project', 'task', 'deadline', 'milestone', 'progress']),
      
      // Personal intents
      scheduling: this.calculateIntentScore(messageLower, ['schedule', 'meeting', 'appointment', 'calendar', 'time']),
      reminder: this.calculateIntentScore(messageLower, ['remind', 'reminder', 'later', 'tomorrow', 'next week']),
      idea_capture: this.calculateIntentScore(messageLower, ['idea', 'thought', 'concept', 'brainstorm', 'innovation'])
    };

    // Find highest confidence intent
    const topIntent = Object.entries(intents)
      .sort(([,a], [,b]) => b - a)[0];

    // Detect repository context
    const repositoryContext = this.repoManager.detectRepository(message);
    
    // Generate suggested actions based on intent
    const suggestedActions = this.generateSuggestedActions(topIntent[0], repositoryContext, message);

    return {
      primaryIntent: topIntent[0],
      confidence: topIntent[1],
      allIntents: intents,
      repository: repositoryContext,
      messageType: this.classifyMessageType(message),
      urgency: this.calculateUrgency(message),
      suggestedActions: suggestedActions,
      contextualInfo: this.extractContextualInfo(message, userContext)
    };
  }

  // 📊 Calculate Intent Confidence Score
  calculateIntentScore(message, keywords) {
    let score = 0;
    const words = message.split(' ');
    
    keywords.forEach(keyword => {
      if (message.includes(keyword)) {
        score += 0.3; // Base score for keyword match
        
        // Bonus for exact word match
        if (words.includes(keyword)) {
          score += 0.2;
        }
        
        // Bonus for keyword at beginning of message
        if (message.startsWith(keyword)) {
          score += 0.1;
        }
      }
    });
    
    return Math.min(1.0, score); // Cap at 1.0
  }

  // 🎭 Generate Intelligent Response
  async generateResponse(analysis, userContext) {
    const { primaryIntent, confidence, repository, urgency } = analysis;
    
    // High confidence responses
    if (confidence > 0.7) {
      switch (primaryIntent) {
        case 'bug_report':
          return this.generateBugReportResponse(analysis, userContext);
        case 'feature_request':
          return this.generateFeatureRequestResponse(analysis, userContext);
        case 'financial_query':
          return this.generateFinancialQueryResponse(analysis, userContext);
        case 'question':
          return this.generateQuestionResponse(analysis, userContext);
        case 'scheduling':
          return this.generateSchedulingResponse(analysis, userContext);
        default:
          return this.generateGenericResponse(analysis, userContext);
      }
    }
    
    // Medium confidence - ask for clarification
    if (confidence > 0.4) {
      return {
        text: `I think you're asking about ${primaryIntent.replace('_', ' ')} related to ${repository}. Could you provide more details so I can help you better?`,
        type: 'clarification',
        followUp: true
      };
    }
    
    // Low confidence - general assistance
    return {
      text: `I'm here to help! I can assist with:\n🐛 Bug reports\n✨ Feature requests\n💰 Financial queries\n📊 Project management\n📅 Scheduling\n\nWhat would you like to do?`,
      type: 'menu',
      showOptions: true
    };
  }

  // 🐛 Generate Bug Report Response
  generateBugReportResponse(analysis, userContext) {
    const { repository, urgency } = analysis;
    const urgencyEmoji = urgency > 0.7 ? '🚨' : urgency > 0.4 ? '⚠️' : '🐛';
    
    return {
      text: `${urgencyEmoji} I'll help you report this bug in the ${repository} repository.\n\nTo create a comprehensive bug report, I'll need:\n📝 Steps to reproduce\n💻 Expected vs actual behavior\n🔧 Environment details\n\nShould I create a GitHub issue now, or would you like to provide more details first?`,
      type: 'bug_report',
      repository: repository,
      urgency: urgency,
      actions: ['create_issue', 'gather_details']
    };
  }

  // ✨ Generate Feature Request Response
  generateFeatureRequestResponse(analysis, userContext) {
    const { repository } = analysis;
    
    return {
      text: `✨ Great idea! I'll help you create a feature request for the ${repository} repository.\n\n📋 Let me gather some details:\n🎯 What problem does this solve?\n💡 How should it work?\n📈 What's the expected impact?\n\nWould you like me to create the GitHub issue now or help you refine the idea first?`,
      type: 'feature_request',
      repository: repository,
      actions: ['create_issue', 'brainstorm', 'research_similar']
    };
  }

  // 💰 Generate Financial Query Response
  generateFinancialQueryResponse(analysis, userContext) {
    return {
      text: `💰 I can help with financial data! I have access to your Supabase database with current expenses (£409.58 in software costs).\n\n📊 What would you like to know?\n💳 Recent expenses\n📈 Budget analysis\n📋 Expense categories\n🔍 Specific transactions\n\nOr I can generate a voice summary of your financial data!`,
      type: 'financial_query',
      actions: ['voice_summary', 'recent_expenses', 'budget_analysis', 'expense_categories']
    };
  }

  // 📅 Generate Scheduling Response
  generateSchedulingResponse(analysis, userContext) {
    const { repository } = analysis;
    
    if (repository === 'mayor-activities') {
      return {
        text: `🏛️ I'll help you schedule civic activities!\n\n📅 What type of event?\n🗓️ Preferred date/time?\n📍 Location requirements?\n👥 Expected attendees?\n\nI can create a GitHub issue to track this civic activity and send reminders.`,
        type: 'civic_scheduling',
        repository: repository,
        actions: ['create_civic_event', 'set_reminder', 'check_calendar']
      };
    }
    
    return {
      text: `📅 I can help with scheduling!\n\n⏰ What would you like to schedule?\n📆 When should it happen?\n🔔 Do you need reminders?\n\nI can create calendar events and set up automated reminders.`,
      type: 'scheduling',
      actions: ['create_event', 'set_reminder', 'check_availability']
    };
  }

  // 🎯 Generate Suggested Actions
  generateSuggestedActions(intent, repository, message) {
    const actions = [];
    
    switch (intent) {
      case 'bug_report':
        actions.push(
          { type: 'create_github_issue', text: '🐛 Create Bug Report', priority: 'high' },
          { type: 'voice_response', text: '🔊 Voice Explanation', priority: 'medium' },
          { type: 'gather_details', text: '📝 Gather More Details', priority: 'medium' }
        );
        break;
        
      case 'feature_request':
        actions.push(
          { type: 'create_github_issue', text: '✨ Create Feature Request', priority: 'high' },
          { type: 'research_similar', text: '🔍 Research Similar Features', priority: 'low' },
          { type: 'brainstorm', text: '💡 Brainstorm Ideas', priority: 'medium' }
        );
        break;
        
      case 'financial_query':
        actions.push(
          { type: 'query_supabase', text: '💰 Query Financial Data', priority: 'high' },
          { type: 'voice_summary', text: '🔊 Voice Financial Summary', priority: 'medium' },
          { type: 'generate_report', text: '📊 Generate Report', priority: 'low' }
        );
        break;
        
      case 'scheduling':
        actions.push(
          { type: 'create_calendar_event', text: '📅 Create Calendar Event', priority: 'high' },
          { type: 'set_reminder', text: '🔔 Set Reminder', priority: 'medium' },
          { type: 'check_availability', text: '⏰ Check Availability', priority: 'low' }
        );
        break;
    }
    
    return actions;
  }

  // 📊 Calculate Message Urgency
  calculateUrgency(message) {
    const urgencyKeywords = {
      critical: 1.0,
      urgent: 0.9,
      asap: 0.8,
      immediately: 0.8,
      emergency: 1.0,
      broken: 0.7,
      'not working': 0.6,
      important: 0.5,
      soon: 0.4
    };
    
    let urgency = 0;
    const messageLower = message.toLowerCase();
    
    Object.entries(urgencyKeywords).forEach(([keyword, score]) => {
      if (messageLower.includes(keyword)) {
        urgency = Math.max(urgency, score);
      }
    });
    
    return urgency;
  }

  // 👤 User Context Management
  getUserContext(userId) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
      this.userProfiles.set(userId, {
        preferredRepositories: [],
        commonIntents: {},
        responsePreferences: {},
        timezone: null,
        language: 'en'
      });
    }
    
    return {
      history: this.conversationHistory.get(userId),
      profile: this.userProfiles.get(userId)
    };
  }

  // 📝 Add Message to History
  addToHistory(userId, message, messageType) {
    const history = this.conversationHistory.get(userId) || [];
    
    history.push({
      message: message,
      type: messageType,
      timestamp: Date.now()
    });
    
    // Keep only recent messages
    if (history.length > this.contextWindow) {
      history.shift();
    }
    
    this.conversationHistory.set(userId, history);
  }

  // 📈 Update User Profile
  updateUserProfile(userId, analysis) {
    const profile = this.userProfiles.get(userId);
    
    // Track preferred repositories
    if (!profile.preferredRepositories.includes(analysis.repository)) {
      profile.preferredRepositories.push(analysis.repository);
    }
    
    // Track common intents
    if (!profile.commonIntents[analysis.primaryIntent]) {
      profile.commonIntents[analysis.primaryIntent] = 0;
    }
    profile.commonIntents[analysis.primaryIntent]++;
    
    this.userProfiles.set(userId, profile);
  }

  // 🏷️ Classify Message Type
  classifyMessageType(message) {
    if (message.includes('?')) return 'question';
    if (message.includes('!')) return 'exclamation';
    if (message.length < 20) return 'short';
    if (message.length > 200) return 'detailed';
    return 'standard';
  }

  // 🔍 Extract Contextual Information
  extractContextualInfo(message, userContext) {
    const info = {
      mentions: [],
      urls: [],
      numbers: [],
      dates: [],
      technologies: []
    };
    
    // Extract mentions (@username)
    const mentionRegex = /@(\w+)/g;
    info.mentions = [...message.matchAll(mentionRegex)].map(m => m[1]);
    
    // Extract URLs
    const urlRegex = /https?:\/\/[^\s]+/g;
    info.urls = [...message.matchAll(urlRegex)].map(m => m[0]);
    
    // Extract numbers (potential IDs, versions, etc.)
    const numberRegex = /\b\d+(?:\.\d+)*\b/g;
    info.numbers = [...message.matchAll(numberRegex)].map(m => m[0]);
    
    // Extract common technologies
    const techKeywords = ['react', 'typescript', 'nodejs', 'supabase', 'github', 'telegram'];
    info.technologies = techKeywords.filter(tech => 
      message.toLowerCase().includes(tech)
    );
    
    return info;
  }

  // 📊 Get Conversation Analytics
  getConversationAnalytics(userId) {
    const context = this.getUserContext(userId);
    const history = context.history;
    const profile = context.profile;
    
    return {
      totalMessages: history.length,
      preferredRepositories: profile.preferredRepositories,
      topIntents: Object.entries(profile.commonIntents)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      averageMessageLength: history.reduce((sum, msg) => sum + msg.message.length, 0) / history.length,
      messageTypes: history.reduce((types, msg) => {
        types[msg.type] = (types[msg.type] || 0) + 1;
        return types;
      }, {}),
      lastActive: history.length > 0 ? new Date(history[history.length - 1].timestamp) : null
    };
  }
}

module.exports = { ConversationEngine }; 