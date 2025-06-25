// 📊 TELEGRAM BOT ANALYTICS & MONITORING SYSTEM
const fs = require('fs').promises;

class TelegramBotAnalytics {
  constructor() {
    this.metricsFile = 'bot-metrics.json';
    this.logFile = 'bot-activity.log';
    this.metrics = {
      totalMessages: 0,
      repositoryRouting: {},
      messageTypes: {},
      voiceRequests: 0,
      githubIssuesCreated: 0,
      supabaseQueries: 0,
      errors: 0,
      uptime: Date.now(),
      dailyStats: {},
      userStats: {},
      responseTimeStats: {
        total: 0,
        count: 0,
        average: 0,
        min: Infinity,
        max: 0
      }
    };
    this.loadMetrics();
  }

  // Load existing metrics from file
  async loadMetrics() {
    try {
      const data = await fs.readFile(this.metricsFile, 'utf8');
      this.metrics = { ...this.metrics, ...JSON.parse(data) };
    } catch (error) {
      console.log('📊 Starting fresh analytics tracking');
    }
  }

  // Save metrics to file
  async saveMetrics() {
    try {
      await fs.writeFile(this.metricsFile, JSON.stringify(this.metrics, null, 2));
    } catch (error) {
      console.error('Failed to save metrics:', error);
    }
  }

  // Track message received
  async trackMessage(message, userId, repository, responseTime) {
    this.metrics.totalMessages++;
    
    // Track repository routing
    if (!this.metrics.repositoryRouting[repository]) {
      this.metrics.repositoryRouting[repository] = 0;
    }
    this.metrics.repositoryRouting[repository]++;
    
    // Track message types
    const messageType = this.categorizeMessage(message);
    if (!this.metrics.messageTypes[messageType]) {
      this.metrics.messageTypes[messageType] = 0;
    }
    this.metrics.messageTypes[messageType]++;
    
    // Track user stats
    if (!this.metrics.userStats[userId]) {
      this.metrics.userStats[userId] = {
        messageCount: 0,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        repositories: {}
      };
    }
    this.metrics.userStats[userId].messageCount++;
    this.metrics.userStats[userId].lastSeen = Date.now();
    
    // Update response time
    this.updateResponseTime(responseTime);
    
    // Track daily stats
    const today = new Date().toISOString().split('T')[0];
    if (!this.metrics.dailyStats[today]) {
      this.metrics.dailyStats[today] = {
        messages: 0,
        repositories: {},
        errors: 0
      };
    }
    this.metrics.dailyStats[today].messages++;
    
    await this.saveMetrics();
  }

  // Update response time statistics
  updateResponseTime(responseTime) {
    this.metrics.responseTimeStats.total += responseTime;
    this.metrics.responseTimeStats.count++;
    this.metrics.responseTimeStats.average = 
      this.metrics.responseTimeStats.total / this.metrics.responseTimeStats.count;
    this.metrics.responseTimeStats.min = 
      Math.min(this.metrics.responseTimeStats.min, responseTime);
    this.metrics.responseTimeStats.max = 
      Math.max(this.metrics.responseTimeStats.max, responseTime);
  }

  // Categorize message type
  categorizeMessage(message) {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('bug') || messageLower.includes('error')) {
      return 'bug_report';
    } else if (messageLower.includes('feature') || messageLower.includes('enhancement')) {
      return 'feature_request';
    } else if (messageLower.includes('question') || messageLower.includes('help')) {
      return 'question';
    } else if (messageLower.includes('urgent') || messageLower.includes('critical')) {
      return 'urgent';
    } else {
      return 'general';
    }
  }

  // Track GitHub issue creation
  async trackGitHubIssue(repository, issueUrl, userId) {
    this.metrics.githubIssuesCreated++;
    await this.saveMetrics();
  }

  // Track voice request
  async trackVoiceRequest(userId, success = true) {
    this.metrics.voiceRequests++;
    await this.saveMetrics();
  }

  // Track error
  async trackError(error, context, userId = null) {
    this.metrics.errors++;
    await this.saveMetrics();
  }

  // Get analytics report
  getAnalyticsReport() {
    const uptime = Date.now() - this.metrics.uptime;
    const uptimeHours = (uptime / (1000 * 60 * 60)).toFixed(2);
    
    return {
      summary: {
        totalMessages: this.metrics.totalMessages,
        githubIssuesCreated: this.metrics.githubIssuesCreated,
        voiceRequests: this.metrics.voiceRequests,
        supabaseQueries: this.metrics.supabaseQueries,
        errors: this.metrics.errors,
        uptimeHours: parseFloat(uptimeHours),
        activeUsers: Object.keys(this.metrics.userStats).length
      },
      repositoryRouting: this.metrics.repositoryRouting,
      messageTypes: this.metrics.messageTypes,
      responseTimeStats: {
        average: Math.round(this.metrics.responseTimeStats.average),
        min: this.metrics.responseTimeStats.min,
        max: this.metrics.responseTimeStats.max,
        totalRequests: this.metrics.responseTimeStats.count
      },
      healthScore: this.calculateHealthScore()
    };
  }

  // Calculate health score (0-100)
  calculateHealthScore() {
    let score = 100;
    
    // Deduct points for errors
    const errorRate = this.metrics.totalMessages > 0 ? 
      (this.metrics.errors / this.metrics.totalMessages) * 100 : 0;
    score -= errorRate * 2;
    
    // Add points for activity
    if (this.metrics.totalMessages > 100) {
      score += 5;
    }
    
    // Add points for multi-repo usage
    const repoCount = Object.keys(this.metrics.repositoryRouting).length;
    score += repoCount * 2;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // Generate formatted report
  generateFormattedReport() {
    const report = this.getAnalyticsReport();
    
    return `
📊 TELEGRAM BOT ANALYTICS REPORT
${'='.repeat(50)}

📈 SUMMARY METRICS
• Total Messages: ${report.summary.totalMessages}
• GitHub Issues Created: ${report.summary.githubIssuesCreated}
• Voice Requests: ${report.summary.voiceRequests}
• Errors: ${report.summary.errors}
• Uptime: ${report.summary.uptimeHours} hours
• Active Users: ${report.summary.activeUsers}
• Health Score: ${report.healthScore}/100

🗂️ REPOSITORY ROUTING
${Object.entries(report.repositoryRouting)
  .map(([repo, count]) => `• ${repo}: ${count} messages`)
  .join('\n')}

📝 MESSAGE TYPES
${Object.entries(report.messageTypes)
  .map(([type, count]) => `• ${type}: ${count} messages`)
  .join('\n')}

⚡ PERFORMANCE
• Average Response Time: ${report.responseTimeStats.average}ms
• Fastest Response: ${report.responseTimeStats.min}ms
• Slowest Response: ${report.responseTimeStats.max}ms

${'='.repeat(50)}
Report generated: ${new Date().toISOString()}
`;
  }
}

module.exports = {
  TelegramBotAnalytics
};
