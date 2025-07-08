// 🚀 TELEGRAM BOT - MULTI-REPOSITORY CONFIGURATION
// Smart GitHub Integration Across Multiple Repos

// Repository Configuration System
class RepositoryManager {
  constructor() {
    this.repositories = {
      // Main SISO Agency Repository
      'siso-agency': {
        owner: 'samsiso', // Updated with actual GitHub username
        repo: 'siso-agency-onboarding-app-main-main',
        description: 'Main SISO agency onboarding application',
        keywords: ['agency', 'onboarding', 'business', 'client', 'dashboard'],
        defaultLabels: ['enhancement', 'bug', 'feature'],
        priority: 1 // Primary repo
      },

      // Telegram Bot Repository (to be created)
      'telegram-bot': {
        owner: 'samsiso', // Updated with actual GitHub username  
        repo: 'siso-telegram-ai-assistant',
        description: 'Advanced Telegram AI Assistant with Voice & Multi-Tool Integration',
        keywords: ['telegram', 'bot', 'ai', 'assistant', 'voice', 'automation'],
        defaultLabels: ['bot-enhancement', 'bug', 'feature', 'integration'],
        priority: 2
      },

      // Mayor Activities Repository
      'mayor-activities': {
        owner: 'samsiso', // Updated with actual GitHub username
        repo: 'mayor-activities-tracker',
        description: 'Mayor activities tracking and management system',
        keywords: ['mayor', 'activities', 'civic', 'government', 'public'],
        defaultLabels: ['activity', 'civic', 'urgent', 'public-service'],
        priority: 3
      },

      // Personal Projects Repository
      'personal-projects': {
        owner: 'samsiso', // Updated with actual GitHub username
        repo: 'personal-project-manager',
        description: 'Personal project management and tracking',
        keywords: ['personal', 'project', 'management', 'productivity', 'idea', 'habit', 'app', 'build', 'create', 'hobby'],
        defaultLabels: ['personal', 'project', 'idea', 'todo'],
        priority: 4
      }
    };
  }

  // Detect which repository a message is referring to
  detectRepository(message) {
    const messageLower = message.toLowerCase();
    
    // Check for explicit repo mentions
    for (const [repoKey, config] of Object.entries(this.repositories)) {
      // Check if repo name is mentioned
      if (messageLower.includes(config.repo.toLowerCase()) || 
          messageLower.includes(repoKey)) {
        return repoKey;
      }
      
      // Check keywords
      for (const keyword of config.keywords) {
        if (messageLower.includes(keyword.toLowerCase())) {
          return repoKey;
        }
      }
    }
    
    // Default to primary repo if no specific match
    return 'siso-agency';
  }

  // Get repository configuration
  getRepoConfig(repoKey) {
    return this.repositories[repoKey] || this.repositories['siso-agency'];
  }

  // Get all repositories
  getAllRepos() {
    return Object.entries(this.repositories).map(([key, config]) => ({
      key,
      ...config
    }));
  }

  // Add new repository dynamically
  addRepository(key, config) {
    this.repositories[key] = {
      priority: Object.keys(this.repositories).length + 1,
      defaultLabels: ['enhancement', 'bug'],
      ...config
    };
  }

  // Format repository list for user
  formatRepositoryList() {
    return Object.entries(this.repositories)
      .sort((a, b) => a[1].priority - b[1].priority)
      .map(([key, config]) => 
        `🗂️ **${key}**: ${config.description}\n   📁 ${config.owner}/${config.repo}`
      ).join('\n\n');
  }
}

// Enhanced GitHub Issue Creation with Multi-Repo Support
class MultiRepoGitHubManager {
  constructor(githubToken) {
    this.token = githubToken;
    this.repoManager = new RepositoryManager();
  }

  // Create issue in detected repository
  async createIssue(message, title, body) {
    try {
      // Detect which repository this issue belongs to
      const repoKey = this.repoManager.detectRepository(message);
      const repoConfig = this.repoManager.getRepoConfig(repoKey);
      
      console.log(`🎯 Creating issue in ${repoKey} repository`);
      
      const issueData = {
        title: title,
        body: `${body}\n\n---\n**Auto-created by Telegram Bot**\n**Repository**: ${repoKey}\n**Original Message**: ${message}`,
        labels: this.selectLabels(message, repoConfig.defaultLabels)
      };

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
          repository: repoKey,
          repoConfig: repoConfig,
          url: issue.html_url
        };
      } else {
        const error = await response.text();
        return {
          success: false,
          error: `GitHub API Error: ${response.status} - ${error}`,
          repository: repoKey
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        repository: 'unknown'
      };
    }
  }

  // Smart label selection based on message content
  selectLabels(message, defaultLabels) {
    const labels = [...defaultLabels];
    const messageLower = message.toLowerCase();

    // Priority labels
    if (messageLower.includes('urgent') || messageLower.includes('critical')) {
      labels.push('urgent');
    }
    if (messageLower.includes('high priority')) {
      labels.push('high-priority');
    }

    // Type labels
    if (messageLower.includes('bug') || messageLower.includes('error')) {
      labels.push('bug');
    }
    if (messageLower.includes('feature') || messageLower.includes('enhancement')) {
      labels.push('enhancement');
    }
    if (messageLower.includes('documentation') || messageLower.includes('docs')) {
      labels.push('documentation');
    }

    return [...new Set(labels)]; // Remove duplicates
  }

  // List all configured repositories
  listRepositories() {
    return this.repoManager.formatRepositoryList();
  }

  // Get repository statistics
  async getRepositoryStats(repoKey) {
    const repoConfig = this.repoManager.getRepoConfig(repoKey);
    
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoConfig.owner}/${repoConfig.repo}`,
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (response.ok) {
        const repoData = await response.json();
        return {
          name: repoData.name,
          description: repoData.description,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          openIssues: repoData.open_issues_count,
          language: repoData.language,
          lastUpdated: repoData.updated_at
        };
      }
    } catch (error) {
      console.error('Error fetching repo stats:', error);
    }
    
    return null;
  }
}

module.exports = {
  RepositoryManager,
  MultiRepoGitHubManager
}; 