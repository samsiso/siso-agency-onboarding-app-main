// 🚀 TELEGRAM BOT - REPOSITORY ENHANCEMENTS
// Advanced features for multi-repository management

const { RepositoryManager, MultiRepoGitHubManager } = require('./telegram-repository-config.js');

// Enhanced Repository Manager with advanced features
class EnhancedRepositoryManager extends RepositoryManager {
  constructor() {
    super();
    this.issueTemplates = this.initializeIssueTemplates();
    this.routingHistory = [];
    this.routingStats = {};
  }

  // Initialize issue templates for different repository types
  initializeIssueTemplates() {
    return {
      'siso-agency': {
        bug: {
          title: "🐛 [Agency] Bug Report: {title}",
          template: `## 🐛 Bug Description
{description}

## 🔍 Steps to Reproduce
1. Go to agency dashboard
2. Navigate to affected area
3. Perform action that triggers bug

## 💡 Expected Behavior
What should happen instead

## 🌐 Environment
- Browser: 
- User Role: 
- Client: 

## 📱 Impact
- [ ] Affects client onboarding
- [ ] Affects dashboard functionality
- [ ] Affects user experience`
        },
        feature: {
          title: "✨ [Agency] Feature Request: {title}",
          template: `## ✨ Feature Description
{description}

## 🎯 Business Value
Why this feature is needed for the agency

## 👥 Target Users
- [ ] Clients
- [ ] Agency staff
- [ ] Administrators

## 📋 Acceptance Criteria
- [ ] Feature works as described
- [ ] UI/UX is intuitive
- [ ] Performance is acceptable`
        }
      },
      'telegram-bot': {
        enhancement: {
          title: "🔧 [Bot] Enhancement: {title}",
          template: `## 🔧 Enhancement Description
{description}

## 🤖 Bot Functionality
Which bot feature needs enhancement?

## 🎯 Expected Improvement
What should be better after this enhancement?

## 🧪 Testing
- [ ] Test with sample messages
- [ ] Verify voice responses (if applicable)
- [ ] Check multi-repo routing`
        },
        feature: {
          title: "✨ [Bot] New Feature: {title}",
          template: `## ✨ New Feature Description
{description}

## 🛠️ Implementation Approach
How should this feature be built?

## 🔌 API Requirements
- [ ] New API integrations needed
- [ ] Environment variables required
- [ ] Third-party services

## 📊 Success Metrics
How will we know this feature is successful?

## 🚀 Deployment Notes
Any special deployment considerations`
        }
      },
      'mayor-activities': {
        activity: {
          title: "🏛️ [Mayor] Activity Request: {title}",
          template: `## 🏛️ Activity Description
{description}

## 📅 Timeline
When should this activity happen?

## 👥 Stakeholders
Who needs to be involved?

## 📍 Location/Venue
Where will this take place?

## 💰 Budget Considerations
Any budget implications?

## 📢 Public Communication
- [ ] Press release needed
- [ ] Social media announcement
- [ ] Website update

## ✅ Success Criteria
How will we measure success?`
        }
      },
      'personal-projects': {
        idea: {
          title: "💡 [Personal] Project Idea: {title}",
          template: `## 💡 Project Idea
{description}

## 🎯 Goals
What do you want to achieve?

## 🛠️ Technology Stack
What tools/technologies will you use?

## ⏱️ Time Estimate
How long do you think this will take?

## 📈 Success Metrics
How will you know it's successful?

## 🔗 Resources Needed
- [ ] Learning materials
- [ ] Tools/software
- [ ] External APIs
- [ ] Design assets

## 📝 Next Steps
What's the first action to take?`
        }
      }
    };
  }

  // Enhanced repository detection with confidence scoring
  detectRepositoryWithConfidence(message) {
    const messageLower = message.toLowerCase();
    const scores = {};
    
    // Initialize scores for all repositories
    Object.keys(this.repositories).forEach(repo => {
      scores[repo] = 0;
    });

    // Score based on explicit repo mentions (highest weight)
    for (const [repoKey, config] of Object.entries(this.repositories)) {
      if (messageLower.includes(config.repo.toLowerCase()) || 
          messageLower.includes(repoKey)) {
        scores[repoKey] += 100;
      }
    }

    // Score based on keywords (medium weight)
    for (const [repoKey, config] of Object.entries(this.repositories)) {
      for (const keyword of config.keywords) {
        if (messageLower.includes(keyword.toLowerCase())) {
          scores[repoKey] += 10;
        }
      }
    }

    // Find the highest scoring repository
    const sortedRepos = Object.entries(scores)
      .sort(([,a], [,b]) => b - a);
    
    const topRepo = sortedRepos[0];
    const confidence = topRepo[1] > 0 ? Math.min(topRepo[1] / 20, 1) : 0.1;

    // Track routing history
    this.routingHistory.push({
      message: message.substring(0, 100),
      repository: topRepo[0],
      confidence: confidence,
      scores: scores,
      timestamp: new Date().toISOString()
    });

    // Update routing stats
    if (!this.routingStats[topRepo[0]]) {
      this.routingStats[topRepo[0]] = 0;
    }
    this.routingStats[topRepo[0]]++;

    return {
      repository: topRepo[0] || 'siso-agency',
      confidence: confidence,
      scores: scores,
      alternatives: sortedRepos.slice(1, 3)
    };
  }

  // Generate issue using templates
  generateIssueFromTemplate(message, repository, issueType = 'bug') {
    const template = this.issueTemplates[repository]?.[issueType];
    if (!template) {
      return this.generateGenericIssue(message, repository);
    }

    // Extract title from message (first 50 chars, cleaned)
    const title = message.substring(0, 50).replace(/[^\w\s-]/g, '').trim();
    
    return {
      title: template.title.replace('{title}', title),
      body: template.template.replace('{description}', message),
      labels: this.getTemplateLabels(repository, issueType)
    };
  }

  // Get labels based on repository and issue type
  getTemplateLabels(repository, issueType) {
    const baseLabels = this.repositories[repository]?.defaultLabels || ['enhancement'];
    const typeLabels = {
      'bug': ['bug', 'urgent'],
      'feature': ['enhancement', 'feature'],
      'enhancement': ['enhancement'],
      'activity': ['activity', 'civic'],
      'idea': ['idea', 'personal']
    };
    
    return [...baseLabels, ...(typeLabels[issueType] || [])];
  }

  // Generate generic issue if no template available
  generateGenericIssue(message, repository) {
    const title = message.substring(0, 50).replace(/[^\w\s-]/g, '').trim();
    return {
      title: `[${repository}] ${title}`,
      body: `## Description\n${message}\n\n---\n*Auto-generated issue*`,
      labels: this.repositories[repository]?.defaultLabels || ['enhancement']
    };
  }

  // Get routing statistics
  getRoutingStats() {
    const total = this.routingHistory.length;
    const stats = Object.entries(this.routingStats)
      .map(([repo, count]) => ({
        repository: repo,
        count: count,
        percentage: ((count / total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalMessages: total,
      repositoryBreakdown: stats,
      recentHistory: this.routingHistory.slice(-10)
    };
  }

  // Smart repository suggestions
  suggestRepository(message) {
    const detection = this.detectRepositoryWithConfidence(message);
    
    if (detection.confidence < 0.5) {
      return {
        suggested: detection.repository,
        confidence: 'LOW',
        message: `I'm not very confident about this routing. Consider mentioning: ${detection.alternatives.map(([repo]) => repo).join(', ')}`,
        alternatives: detection.alternatives
      };
    } else if (detection.confidence < 0.8) {
      return {
        suggested: detection.repository,
        confidence: 'MEDIUM',
        message: `Fairly confident this belongs in ${detection.repository}`,
        alternatives: detection.alternatives.slice(0, 1)
      };
    } else {
      return {
        suggested: detection.repository,
        confidence: 'HIGH',
        message: `Highly confident this belongs in ${detection.repository}`,
        alternatives: []
      };
    }
  }
}

// Enhanced GitHub Manager with advanced features
class AdvancedGitHubManager extends MultiRepoGitHubManager {
  constructor(githubToken) {
    super(githubToken);
    this.enhancedRepoManager = new EnhancedRepositoryManager();
  }

  // Create issue with enhanced detection and templates
  async createEnhancedIssue(message, issueType = 'bug') {
    try {
      const detection = this.enhancedRepoManager.detectRepositoryWithConfidence(message);
      const repoConfig = this.enhancedRepoManager.getRepoConfig(detection.repository);
      
      console.log(`🎯 Creating enhanced issue in ${detection.repository} (confidence: ${(detection.confidence * 100).toFixed(1)}%)`);
      
      // Generate issue using templates
      const issueData = this.enhancedRepoManager.generateIssueFromTemplate(
        message, 
        detection.repository, 
        issueType
      );

      const response = await fetch(
        `https://api.github.com/repos/${repoConfig.owner}/${repoConfig.repo}/issues`,
        {
          method: 'POST',
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(issueData)
        }
      );

      if (response.ok) {
        const issue = await response.json();
        return {
          success: true,
          issue: issue,
          repository: detection.repository,
          confidence: detection.confidence,
          repoConfig: repoConfig,
          url: issue.html_url,
          detection: detection
        };
      } else {
        const error = await response.text();
        return {
          success: false,
          error: `GitHub API Error: ${response.status} - ${error}`,
          repository: detection.repository,
          confidence: detection.confidence
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        repository: 'unknown',
        confidence: 0
      };
    }
  }

  // Get repository analytics
  async getRepositoryAnalytics() {
    const stats = this.enhancedRepoManager.getRoutingStats();
    const repoAnalytics = {};

    for (const [repoKey, config] of Object.entries(this.enhancedRepoManager.repositories)) {
      try {
        const repoStats = await this.getRepositoryStats(repoKey);
        repoAnalytics[repoKey] = {
          ...repoStats,
          routingCount: stats.repositoryBreakdown.find(r => r.repository === repoKey)?.count || 0
        };
      } catch (error) {
        console.error(`Failed to get stats for ${repoKey}:`, error.message);
      }
    }

    return {
      routingStats: stats,
      repositoryStats: repoAnalytics
    };
  }

  // Bulk repository operations
  async bulkCreateIssues(messages) {
    const results = [];
    
    for (const message of messages) {
      try {
        const result = await this.createEnhancedIssue(message);
        results.push(result);
        
        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          message: message.substring(0, 50)
        });
      }
    }
    
    return results;
  }
}

module.exports = {
  EnhancedRepositoryManager,
  AdvancedGitHubManager
}; 