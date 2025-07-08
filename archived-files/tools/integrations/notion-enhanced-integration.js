// 🚀 ENHANCED NOTION INTEGRATION FOR SISO ASSISTANT
// Extends existing Telegram system with comprehensive Notion features

const { NotionService } = require('./src/services/notionService.ts');
const { createClient } = require('@supabase/supabase-js');

class EnhancedNotionManager {
  constructor() {
    this.notionService = new NotionService();
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    
    // Enhanced AI patterns for better task extraction
    this.taskPatterns = {
      urgentKeywords: ['urgent', 'asap', 'immediately', 'critical', 'emergency'],
      highPriorityKeywords: ['important', 'priority', 'deadline', 'soon'],
      projectKeywords: ['project', 'client', 'app', 'website', 'development'],
      actionKeywords: ['fix', 'create', 'update', 'review', 'implement', 'design'],
      dueDatePatterns: [
        /tomorrow/i,
        /today/i,
        /next week/i,
        /by (\w+)/i,
        /due (\w+)/i,
        /deadline (\w+)/i
      ]
    };
  }

  // ===== ENHANCED TASK CREATION =====

  async createTaskFromVoice(transcription, chatId, messageId) {
    try {
      console.log('🎤 Processing voice task creation...');
      
      // Enhanced AI parsing
      const taskData = await this.parseAdvancedTaskFromText(transcription);
      
      // Create in Notion
      const notionTask = await this.notionService.createTask({
        ...taskData,
        source: 'Voice',
        assignee: 'Sam Siso'
      });

      // Create quick action buttons
      const actionButtons = this.createTaskActionButtons(notionTask.id);

      return {
        type: 'notion_task_created',
        task: notionTask,
        message: this.formatTaskCreatedMessage(notionTask),
        actionButtons,
        originalTranscription: transcription
      };

    } catch (error) {
      console.error('❌ Voice task creation failed:', error);
      return {
        type: 'notion_error',
        message: `❌ Failed to create task: ${error.message}`,
        fallback: `📝 Raw transcription saved: "${transcription}"`
      };
    }
  }

  async createTaskFromText(message, chatId, platform = 'Telegram') {
    try {
      console.log('💬 Processing text task creation...');
      
      const taskData = await this.parseAdvancedTaskFromText(message);
      
      const notionTask = await this.notionService.createTask({
        ...taskData,
        source: platform,
        assignee: 'Sam Siso'
      });

      // Auto-link to existing projects if detected
      await this.autoLinkToProject(notionTask, message);

      return {
        type: 'notion_task_created',
        task: notionTask,
        message: this.formatTaskCreatedMessage(notionTask),
        actionButtons: this.createTaskActionButtons(notionTask.id)
      };

    } catch (error) {
      console.error('❌ Text task creation failed:', error);
      throw error;
    }
  }

  // ===== ADVANCED AI PARSING =====

  async parseAdvancedTaskFromText(text) {
    const taskData = {
      title: this.extractTitle(text),
      description: text,
      priority: this.extractPriority(text),
      project: this.extractProject(text),
      dueDate: this.extractDueDate(text)
    };

    // AI enhancement: Use context from recent tasks
    const recentTasks = await this.notionService.getTasks({ limit: 10 });
    taskData.project = taskData.project || this.inferProjectFromContext(text, recentTasks);

    return taskData;
  }

  extractTitle(text) {
    // Remove common prefixes and extract core task
    const cleanText = text
      .replace(/^(add task|create task|new task|task:|todo:|reminder:)\s*/i, '')
      .replace(/\s+(priority|due|deadline).*$/i, '')
      .trim();

    // Limit title length and capitalize
    const title = cleanText.substring(0, 100);
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  extractPriority(text) {
    const lowerText = text.toLowerCase();
    
    if (this.taskPatterns.urgentKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'Urgent';
    }
    if (this.taskPatterns.highPriorityKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'High';
    }
    if (lowerText.includes('low priority') || lowerText.includes('when possible')) {
      return 'Low';
    }
    
    return 'Medium';
  }

  extractProject(text) {
    const lowerText = text.toLowerCase();
    
    // Common project patterns
    const projectPatterns = [
      /for (.+?) (project|client|app)/i,
      /(project|client): (.+?)(?:\s|$)/i,
      /working on (.+?)(?:\s|$)/i
    ];

    for (const pattern of projectPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1] || match[2];
      }
    }

    return null;
  }

  extractDueDate(text) {
    const today = new Date();
    const lowerText = text.toLowerCase();

    if (lowerText.includes('today')) {
      return today.toISOString().split('T')[0];
    }
    
    if (lowerText.includes('tomorrow')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }
    
    if (lowerText.includes('next week')) {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek.toISOString().split('T')[0];
    }

    // Try to extract specific dates
    const dateMatch = text.match(/by (\w+\s+\d+)|due (\w+\s+\d+)|deadline (\w+\s+\d+)/i);
    if (dateMatch) {
      const dateStr = dateMatch[1] || dateMatch[2] || dateMatch[3];
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0];
      }
    }

    return null;
  }

  inferProjectFromContext(text, recentTasks) {
    // Find the most common project in recent tasks
    const projectCounts = {};
    recentTasks.forEach(task => {
      if (task.project) {
        projectCounts[task.project] = (projectCounts[task.project] || 0) + 1;
      }
    });

    const mostCommonProject = Object.keys(projectCounts)
      .sort((a, b) => projectCounts[b] - projectCounts[a])[0];

    return mostCommonProject || null;
  }

  // ===== PROJECT MANAGEMENT =====

  async autoLinkToProject(task, originalMessage) {
    try {
      // Check if we can link this task to an existing project
      const projects = await this.notionService.getProjects({ status: 'Active' });
      
      for (const project of projects) {
        if (originalMessage.toLowerCase().includes(project.name.toLowerCase())) {
          await this.notionService.updateTask(task.id, { project: project.name });
          console.log(`🔗 Auto-linked task to project: ${project.name}`);
          break;
        }
      }
    } catch (error) {
      console.error('❌ Auto-linking failed:', error);
    }
  }

  async createProjectFromMessage(message, chatId) {
    try {
      console.log('🚀 Creating project from message...');

      const projectData = this.parseProjectFromMessage(message);
      const notionProject = await this.notionService.createProject(projectData);

      // Auto-generate initial tasks
      const initialTasks = await this.generateInitialProjectTasks(notionProject);

      return {
        type: 'notion_project_created',
        project: notionProject,
        tasks: initialTasks,
        message: this.formatProjectCreatedMessage(notionProject, initialTasks)
      };

    } catch (error) {
      console.error('❌ Project creation failed:', error);
      throw error;
    }
  }

  parseProjectFromMessage(message) {
    // Extract project details from natural language
    const nameMatch = message.match(/project:?\s*(.+?)(?:\s+for|\s+budget|\s*$)/i);
    const clientMatch = message.match(/for\s+(.+?)(?:\s+budget|\s*$)/i);
    const budgetMatch = message.match(/budget:?\s*[\$£€]?(\d+(?:,\d+)*)/i);

    return {
      name: nameMatch ? nameMatch[1].trim() : 'New Project',
      client: clientMatch ? clientMatch[1].trim() : undefined,
      budget: budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : undefined,
      description: message,
      startDate: new Date().toISOString().split('T')[0]
    };
  }

  async generateInitialProjectTasks(project) {
    const standardTasks = [
      { title: 'Requirements gathering', priority: 'High' },
      { title: 'Project planning and timeline', priority: 'High' },
      { title: 'UI/UX design', priority: 'Medium' },
      { title: 'Development setup', priority: 'Medium' },
      { title: 'Testing and QA', priority: 'Medium' },
      { title: 'Deployment and launch', priority: 'Low' }
    ];

    const createdTasks = [];
    for (const taskTemplate of standardTasks) {
      try {
        const task = await this.notionService.createTask({
          ...taskTemplate,
          project: project.name,
          source: 'Auto-generated',
          assignee: 'Sam Siso'
        });
        createdTasks.push(task);
      } catch (error) {
        console.error('❌ Failed to create initial task:', error);
      }
    }

    return createdTasks;
  }

  // ===== BUSINESS METRICS =====

  async recordBusinessMetric(message, chatId) {
    try {
      console.log('📈 Recording business metric...');

      const metricData = this.parseMetricFromMessage(message);
      const notionMetric = await this.notionService.recordMetric(metricData);

      // Update monthly summary
      const monthlySummary = await this.generateMonthlySummary();

      return {
        type: 'notion_metric_recorded',
        metric: notionMetric,
        monthlySummary,
        message: this.formatMetricRecordedMessage(notionMetric, monthlySummary)
      };

    } catch (error) {
      console.error('❌ Metric recording failed:', error);
      throw error;
    }
  }

  parseMetricFromMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Extract amount
    const amountMatch = message.match(/[\$£€]?(\d+(?:,\d+)*(?:\.\d{2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;

    // Determine type
    let type = 'Revenue';
    if (lowerMessage.includes('expense') || lowerMessage.includes('cost') || lowerMessage.includes('spent')) {
      type = 'Expenses';
    }

    // Extract description
    const description = message.replace(/[\$£€]?\d+(?:,\d+)*(?:\.\d{2})?/, '').trim();

    return {
      type,
      value: amount,
      description: description || `${type} recorded via ${message.includes('voice') ? 'voice' : 'text'}`,
      source: 'API',
      category: 'Financial'
    };
  }

  async generateMonthlySummary() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const metrics = await this.notionService.getMetrics({
        start: thirtyDaysAgo.toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      });

      const summary = {
        totalRevenue: 0,
        totalExpenses: 0,
        activeTasks: 0,
        completedTasks: 0,
        activeProjects: 0
      };

      metrics.forEach(metric => {
        if (metric.type === 'Revenue') {
          summary.totalRevenue += metric.value;
        } else if (metric.type === 'Expenses') {
          summary.totalExpenses += metric.value;
        } else if (metric.type === 'Tasks') {
          summary.activeTasks += metric.value;
        }
      });

      // Get additional data
      const [tasks, projects] = await Promise.all([
        this.notionService.getTasks({ status: 'In Progress' }),
        this.notionService.getProjects({ status: 'Active' })
      ]);

      summary.activeTasks = tasks.length;
      summary.activeProjects = projects.length;

      return summary;

    } catch (error) {
      console.error('❌ Failed to generate monthly summary:', error);
      return null;
    }
  }

  // ===== MESSAGE FORMATTING =====

  formatTaskCreatedMessage(task) {
    const priorityEmoji = {
      'Urgent': '🔴',
      'High': '🟠',
      'Medium': '🟡',
      'Low': '🟢'
    };

    const statusEmoji = {
      'Not Started': '⏳',
      'In Progress': '🔄',
      'Done': '✅'
    };

    return `✅ **Task Created in Notion!**

📝 **${task.title}**
${priorityEmoji[task.priority]} Priority: ${task.priority}
${statusEmoji[task.status]} Status: ${task.status}
${task.project ? `🏢 Project: ${task.project}` : ''}
${task.dueDate ? `📅 Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}
👤 Assignee: ${task.assignee || 'Unassigned'}

🔗 [View in Notion](${task.url})
📊 [Dashboard](http://localhost:8081/dashboard/tasks)

💡 **Quick Actions**: Reply with:
• "Complete this task" - Mark as done
• "Update priority to high" - Change priority
• "Add due date tomorrow" - Set deadline`;
  }

  formatProjectCreatedMessage(project, tasks) {
    return `🚀 **Project Created in Notion!**

**${project.name}**
${project.client ? `👥 Client: ${project.client}` : ''}
${project.budget ? `💰 Budget: $${project.budget.toLocaleString()}` : ''}
📅 Start: ${new Date(project.startDate).toLocaleDateString()}
📋 Status: ${project.status}

📝 **Auto-generated tasks (${tasks.length})**:
${tasks.slice(0, 3).map((task, i) => `${i + 1}. ${task.title}`).join('\n')}
${tasks.length > 3 ? `... and ${tasks.length - 3} more` : ''}

🔗 [View Project in Notion](${project.url})
📊 [Project Dashboard](http://localhost:8081/dashboard/projects)`;
  }

  formatMetricRecordedMessage(metric, summary) {
    const summaryText = summary ? `

📈 **Monthly Summary**:
💰 Revenue: $${summary.totalRevenue.toLocaleString()}
💸 Expenses: $${summary.totalExpenses.toLocaleString()}
📋 Active Tasks: ${summary.activeTasks}
🚀 Active Projects: ${summary.activeProjects}
📊 Net: $${(summary.totalRevenue - summary.totalExpenses).toLocaleString()}` : '';

    return `📈 **Metric Recorded in Notion!**

${metric.type === 'Revenue' ? '💰' : '💸'} **${metric.type}**: $${metric.value.toLocaleString()}
📝 **Description**: ${metric.description}
📅 **Date**: ${new Date(metric.date).toLocaleDateString()}
📊 **Category**: ${metric.category}${summaryText}

🔗 [View Metrics](http://localhost:8081/dashboard/metrics)`;
  }

  createTaskActionButtons(taskId) {
    return [
      { text: '✅ Complete', callback_data: `complete_task_${taskId}` },
      { text: '📝 Edit', callback_data: `edit_task_${taskId}` },
      { text: '🔗 View', url: `http://localhost:8081/dashboard/tasks/${taskId}` }
    ];
  }

  // ===== SMART INTENT DETECTION =====

  detectEnhancedIntent(message) {
    const lowerMessage = message.toLowerCase();

    // Task intents
    if (this.isTaskIntent(lowerMessage)) {
      return { type: 'task', action: 'create' };
    }

    // Project intents
    if (this.isProjectIntent(lowerMessage)) {
      return { type: 'project', action: 'create' };
    }

    // Metric intents
    if (this.isMetricIntent(lowerMessage)) {
      return { type: 'metric', action: 'record' };
    }

    // Query intents
    if (this.isQueryIntent(lowerMessage)) {
      return { type: 'query', action: 'fetch' };
    }

    return { type: 'unknown', action: 'help' };
  }

  isTaskIntent(message) {
    const taskTriggers = [
      'add task', 'create task', 'new task', 'task:', 'todo:', 'reminder:',
      'need to', 'should', 'must', 'have to', 'remind me'
    ];
    return taskTriggers.some(trigger => message.includes(trigger));
  }

  isProjectIntent(message) {
    const projectTriggers = [
      'new project', 'create project', 'project:', 'start project',
      'client project', 'app for', 'website for', 'development project'
    ];
    return projectTriggers.some(trigger => message.includes(trigger));
  }

  isMetricIntent(message) {
    const metricTriggers = [
      'revenue', 'income', 'earned', 'made', 'expense', 'cost', 'spent',
      'record', 'track', '$', '£', '€'
    ];
    return metricTriggers.some(trigger => message.includes(trigger));
  }

  isQueryIntent(message) {
    const queryTriggers = [
      'show', 'list', 'what are', 'how many', 'status', 'summary',
      'my tasks', 'my projects', 'dashboard', 'report'
    ];
    return queryTriggers.some(trigger => message.includes(trigger));
  }

  // ===== DASHBOARD QUERIES =====

  async generateDashboardSummary() {
    try {
      const [tasks, projects, metrics] = await Promise.all([
        this.notionService.getTasks({ limit: 50 }),
        this.notionService.getProjects(),
        this.notionService.getMetrics({ days: 30 })
      ]);

      const summary = {
        tasks: {
          total: tasks.length,
          notStarted: tasks.filter(t => t.status === 'Not Started').length,
          inProgress: tasks.filter(t => t.status === 'In Progress').length,
          completed: tasks.filter(t => t.status === 'Done').length,
          overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length
        },
        projects: {
          total: projects.length,
          active: projects.filter(p => p.status === 'Active').length,
          planning: projects.filter(p => p.status === 'Planning').length,
          completed: projects.filter(p => p.status === 'Completed').length
        },
        metrics: {
          totalRevenue: metrics.filter(m => m.type === 'Revenue').reduce((sum, m) => sum + m.value, 0),
          totalExpenses: metrics.filter(m => m.type === 'Expenses').reduce((sum, m) => sum + m.value, 0)
        }
      };

      return summary;

    } catch (error) {
      console.error('❌ Failed to generate dashboard summary:', error);
      return null;
    }
  }

  formatDashboardSummary(summary) {
    if (!summary) return '❌ Unable to generate dashboard summary';

    const netRevenue = summary.metrics.totalRevenue - summary.metrics.totalExpenses;

    return `📊 **SISO Dashboard Summary**

📋 **Tasks** (${summary.tasks.total} total):
• ⏳ Not Started: ${summary.tasks.notStarted}
• 🔄 In Progress: ${summary.tasks.inProgress}
• ✅ Completed: ${summary.tasks.completed}
${summary.tasks.overdue > 0 ? `• ⚠️ Overdue: ${summary.tasks.overdue}` : ''}

🚀 **Projects** (${summary.projects.total} total):
• 📋 Planning: ${summary.projects.planning}
• 🔄 Active: ${summary.projects.active}
• ✅ Completed: ${summary.projects.completed}

💰 **Financials** (Last 30 days):
• 📈 Revenue: $${summary.metrics.totalRevenue.toLocaleString()}
• 📉 Expenses: $${summary.metrics.totalExpenses.toLocaleString()}
• 💵 Net: $${netRevenue.toLocaleString()}

🔗 [Full Dashboard](http://localhost:8081/dashboard)
📝 [Notion Workspace](https://notion.so)`;
  }
}

module.exports = { EnhancedNotionManager }; 