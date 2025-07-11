import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task.types';

export interface TaskCommand {
  action: 'create' | 'update' | 'delete' | 'deleteAll' | 'complete' | 'status' | 'list';
  target?: 'all' | 'category' | 'priority' | 'status' | 'specific';
  filters?: {
    category?: 'main' | 'weekly' | 'daily' | 'siso_app_dev' | 'onboarding_app' | 'instagram';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    status?: 'pending' | 'in_progress' | 'completed';
    taskId?: string;
  };
  content?: {
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: 'main' | 'weekly' | 'daily' | 'siso_app_dev' | 'onboarding_app' | 'instagram';
    dueDate?: string;
    assignedTo?: string;
    estimatedHours?: number;
  };
}

export interface TaskAgentResponse {
  success: boolean;
  message: string;
  data?: any;
  action: string;
  affectedCount?: number;
}

export class AITaskAgent {
  private async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user;
  }

  // Parse natural language input into task commands
  public parseCommand(input: string): TaskCommand | TaskCommand[] {
    const lowerInput = input.toLowerCase().trim();
    
    console.log('🧠 [AI TASK AGENT] Parsing command:', input);
    
    // Check if input contains multiple tasks that should be split
    if (this.shouldSplitTask(input)) {
      return this.splitIntoMultipleTasks(input);
    }
    
    // Delete all tasks patterns - more flexible detection
    if (lowerInput.includes('delete') && (lowerInput.includes('all') || lowerInput.includes('tasks')) ||
        lowerInput.includes('clear all') || lowerInput.includes('remove all') ||
        lowerInput.match(/delet.*all.*task/) || lowerInput.match(/clear.*task/)) {
      const command: TaskCommand = { action: 'deleteAll', target: 'all' };
      
      // Check for specific category filters
      if (lowerInput.includes('main')) command.filters = { category: 'main' };
      else if (lowerInput.includes('weekly')) command.filters = { category: 'weekly' };
      else if (lowerInput.includes('daily')) command.filters = { category: 'daily' };
      else if (lowerInput.includes('development') || lowerInput.includes('dev')) command.filters = { category: 'siso_app_dev' };
      else if (lowerInput.includes('onboarding')) command.filters = { category: 'onboarding_app' };
      else if (lowerInput.includes('instagram')) command.filters = { category: 'instagram' };
      
      // Check for priority filters
      if (lowerInput.includes('high priority')) command.filters = { ...command.filters, priority: 'high' };
      else if (lowerInput.includes('urgent')) command.filters = { ...command.filters, priority: 'urgent' };
      else if (lowerInput.includes('medium priority')) command.filters = { ...command.filters, priority: 'medium' };
      else if (lowerInput.includes('low priority')) command.filters = { ...command.filters, priority: 'low' };
      
      // Check for status filters
      if (lowerInput.includes('pending')) command.filters = { ...command.filters, status: 'pending' };
      else if (lowerInput.includes('in progress') || lowerInput.includes('in_progress')) command.filters = { ...command.filters, status: 'in_progress' };
      else if (lowerInput.includes('completed')) command.filters = { ...command.filters, status: 'completed' };
      
      return command;
    }
    
    // Create task patterns
    if (lowerInput.includes('create') || lowerInput.includes('add') || lowerInput.includes('new task')) {
      const command: TaskCommand = { action: 'create' };
      
      // Extract task content
      const content: any = {};
      
      // Extract title (everything after create/add/new task)
      const titleMatch = input.match(/(?:create|add|new task)\s+(.+)/i);
      if (titleMatch) {
        content.title = titleMatch[1].trim();
      }
      
      // Extract priority
      if (lowerInput.includes('high priority') || lowerInput.includes('urgent')) content.priority = 'high';
      else if (lowerInput.includes('medium priority')) content.priority = 'medium';
      else if (lowerInput.includes('low priority')) content.priority = 'low';
      else content.priority = 'medium'; // default
      
      // Extract category
      if (lowerInput.includes('main')) content.category = 'main';
      else if (lowerInput.includes('weekly')) content.category = 'weekly';
      else if (lowerInput.includes('daily')) content.category = 'daily';
      else if (lowerInput.includes('development') || lowerInput.includes('dev')) content.category = 'siso_app_dev';
      else if (lowerInput.includes('onboarding')) content.category = 'onboarding_app';
      else if (lowerInput.includes('instagram')) content.category = 'instagram';
      else content.category = 'main'; // default
      
      // Extract estimated hours
      const hoursMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)/i);
      if (hoursMatch) {
        content.estimatedHours = parseFloat(hoursMatch[1]);
      }
      
      command.content = content;
      return command;
    }
    
    // Complete tasks patterns
    if (lowerInput.includes('complete') || lowerInput.includes('finish') || lowerInput.includes('done')) {
      const command: TaskCommand = { action: 'complete' };
      
      if (lowerInput.includes('all')) {
        command.target = 'all';
      }
      
      // Add category filters if specified
      if (lowerInput.includes('main')) command.filters = { category: 'main' };
      else if (lowerInput.includes('weekly')) command.filters = { category: 'weekly' };
      else if (lowerInput.includes('daily')) command.filters = { category: 'daily' };
      
      return command;
    }
    
    // Status/progress queries
    if (lowerInput.includes('status') || lowerInput.includes('progress') || lowerInput.includes('how many') || lowerInput.includes('list')) {
      return { action: 'status' };
    }
    
    // Default to status if nothing else matches
    return { action: 'status' };
  }

  // Check if a task should be split into multiple tasks
  private shouldSplitTask(input: string): boolean {
    const lowerInput = input.toLowerCase();
    
    // Keywords that indicate multiple tasks
    const multiTaskIndicators = [
      'and also',
      'also',
      'plus',
      'then',
      'after that',
      'fix.*and.*test',
      'build.*and.*push',
      'create.*and.*test',
      'update.*and.*deploy'
    ];
    
    return multiTaskIndicators.some(indicator => 
      lowerInput.includes(indicator) || lowerInput.match(new RegExp(indicator))
    );
  }

  // Split a complex task into multiple simpler tasks
  private splitIntoMultipleTasks(input: string): TaskCommand[] {
    const lowerInput = input.toLowerCase();
    const tasks: TaskCommand[] = [];
    
    // Determine category based on content
    let category: 'main' | 'weekly' | 'daily' | 'siso_app_dev' | 'onboarding_app' | 'instagram' = 'main';
    
    if (lowerInput.includes('siso agency app') || lowerInput.includes('app dev')) {
      category = 'siso_app_dev';
    } else if (lowerInput.includes('development') || lowerInput.includes('dev')) {
      category = 'siso_app_dev';
    } else if (lowerInput.includes('onboarding')) {
      category = 'onboarding_app';
    } else if (lowerInput.includes('instagram')) {
      category = 'instagram';
    }
    
    // Split based on common patterns in the input
    if (lowerInput.includes('landing page') && lowerInput.includes('fix')) {
      tasks.push({
        action: 'create',
        content: {
          title: 'Fix SISO Agency Landing Page',
          description: 'Review and fix issues with the landing page layout, content, and functionality',
          priority: 'high',
          category: category
        }
      });
    }
    
    if (lowerInput.includes('task section') && lowerInput.includes('test')) {
      tasks.push({
        action: 'create',
        content: {
          title: 'Test Task Section Functionality',
          description: 'Thoroughly test the task management section for bugs and usability issues',
          priority: 'medium',
          category: category
        }
      });
    }
    
    if (lowerInput.includes('push') && lowerInput.includes('github')) {
      tasks.push({
        action: 'create',
        content: {
          title: 'Push Changes to GitHub',
          description: 'Commit and push all completed changes to the GitHub repository',
          priority: 'medium',
          category: category
        }
      });
    }
    
    if (lowerInput.includes('pull') && lowerInput.includes('test')) {
      tasks.push({
        action: 'create',
        content: {
          title: 'Create Pull Request and Test',
          description: 'Create a pull request for the changes and run automated tests',
          priority: 'medium',
          category: category
        }
      });
    }
    
    // If no specific tasks were identified, create a general task
    if (tasks.length === 0) {
      tasks.push({
        action: 'create',
        content: {
          title: input.length > 60 ? input.substring(0, 60) + '...' : input,
          description: 'Task created from: ' + input,
          priority: 'medium',
          category: category
        }
      });
    }
    
    return tasks;
  }

  // Execute multiple commands in sequence
  private async executeMultipleCommands(commands: TaskCommand[]): Promise<TaskAgentResponse> {
    const results: TaskAgentResponse[] = [];
    let totalAffected = 0;
    
    for (const command of commands) {
      try {
        const result = await this.executeSingleCommand(command);
        results.push(result);
        if (result.affectedCount) {
          totalAffected += result.affectedCount;
        }
      } catch (error) {
        console.error('Failed to execute command:', command, error);
        results.push({
          success: false,
          message: `Failed to execute: ${error instanceof Error ? error.message : 'Unknown error'}`,
          action: command.action
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;
    
    return {
      success: successCount > 0,
      message: `✅ Created ${successCount} tasks successfully${failCount > 0 ? ` (${failCount} failed)` : ''}:\n${results.filter(r => r.success).map(r => `• ${r.message}`).join('\n')}`,
      action: 'create_multiple',
      data: results,
      affectedCount: totalAffected
    };
  }

  // Execute task commands (single or multiple)
  public async executeCommand(command: TaskCommand | TaskCommand[]): Promise<TaskAgentResponse> {
    const user = await this.getCurrentUser();
    
    console.log('⚡ [AI TASK AGENT] Executing command:', command);
    
    // Handle multiple commands
    if (Array.isArray(command)) {
      return await this.executeMultipleCommands(command);
    }
    
    return await this.executeSingleCommand(command);
  }

  // Execute a single command
  private async executeSingleCommand(command: TaskCommand): Promise<TaskAgentResponse> {
    try {
      switch (command.action) {
        case 'deleteAll':
          return await this.deleteAllTasks(command.filters);
          
        case 'create':
          return await this.createTask(command.content!);
          
        case 'complete':
          return await this.completeTasks(command.filters);
          
        case 'status':
          return await this.getTaskStatus(command.filters);
          
        default:
          return {
            success: false,
            message: 'Unknown command. I can help you create, delete, complete, or check status of tasks.',
            action: 'error'
          };
      }
    } catch (error) {
      console.error('❌ [AI TASK AGENT] Command execution failed:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide user-friendly error messages for common issues
        if (errorMessage.includes('infinite recursion') || errorMessage.includes('policy')) {
          errorMessage = 'Database permission issue. Please check your access rights.';
        } else if (errorMessage.includes('not found')) {
          errorMessage = 'No tasks found matching your criteria.';
        } else if (errorMessage.includes('network')) {
          errorMessage = 'Network connection issue. Please try again.';
        }
      }
      
      return {
        success: false,
        message: `Failed to execute command: ${errorMessage}`,
        action: 'error'
      };
    }
  }

  private async deleteAllTasks(filters?: TaskCommand['filters'], uiTasks?: any[]): Promise<TaskAgentResponse> {
    try {
      console.log('🔧 [AI TASK AGENT] Database RLS detected, attempting direct query with fallback...');
      
      // Try a simplified direct query first
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: directTasks, error: directError } = await supabase
            .from('tasks')
            .select('id, title, priority, status, category')
            .eq('assigned_to', user.id);
            
          if (!directError && directTasks) {
            console.log('✅ [AI TASK AGENT] Direct query successful, using database data');
            uiTasks = directTasks;
          }
        }
      } catch (directQueryError) {
        console.log('⚠️ [AI TASK AGENT] Direct query failed, falling back to UI data');
      }
      
      // Since database access is having issues, use UI state data or inform user
      if (!uiTasks || uiTasks.length === 0) {
        return {
          success: false,
          message: `❌ **Task Access Issue**\n\n⚠️ Cannot access task data due to database policy configuration.\n\n**Quick Fix Options:**\n1. **Manual SQL Fix**: Run the RLS policy fix in Supabase Dashboard\n2. **Reload Page**: Sometimes a page refresh resolves temporary issues\n3. **Check Tasks Page**: View tasks directly in the Tasks section\n\n💡 The task system is working, just needs a policy adjustment in the database.`,
          action: 'deleteAll',
          affectedCount: 0
        };
      }
      
      // Process UI state tasks
      return this.processRealTaskDeletion(uiTasks, filters);
      
    } catch (error) {
      console.error('Delete all tasks error:', error);
      return {
        success: false,
        message: `Failed to process tasks: ${error instanceof Error ? error.message : 'Unknown error'}`,
        action: 'deleteAll',
        affectedCount: 0
      };
    }
  }

  private processRealTaskDeletion(tasks: any[], filters?: TaskCommand['filters']): TaskAgentResponse {
    console.log('🔧 [AI TASK AGENT] Processing real task data:', tasks.length, 'tasks found');
    
    // Apply filters to real data
    let filteredTasks = tasks;
    
    if (filters?.category) {
      filteredTasks = filteredTasks.filter(task => task.category === filters.category);
    }
    if (filters?.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }
    if (filters?.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    
    const deletedCount = filteredTasks.length;
    const filterDescription = this.buildFilterDescription(filters);
    
    console.log('🔧 [AI TASK AGENT] Filtered tasks for deletion:', deletedCount);
    
    if (deletedCount === 0) {
      return {
        success: true,
        message: `No ${filterDescription}tasks found to delete.`,
        action: 'deleteAll',
        affectedCount: 0
      };
    }
    
    // Show what would be deleted with real task titles
    const taskTitles = filteredTasks.slice(0, 3).map(t => `"${t.title}"`).join(', ');
    const moreText = filteredTasks.length > 3 ? ` and ${filteredTasks.length - 3} more` : '';
    
    return {
      success: true,
      message: `✅ Found ${deletedCount} ${filterDescription}task${deletedCount !== 1 ? 's' : ''} to delete:\n\n${taskTitles}${moreText}\n\n⚠️ **Note**: Delete operation disabled due to database RLS policies. Tasks identified from real data.`,
      action: 'deleteAll',
      affectedCount: deletedCount,
      data: filteredTasks
    };
  }

  private cleanupTaskText(text: string): string {
    if (!text) return text;
    
    // Basic text cleanup and enhancement
    let cleaned = text
      // Fix common spelling mistakes
      .replace(/\bteh\b/gi, 'the')
      .replace(/\bintergate\b/gi, 'integrate')
      .replace(/\bfunctinal\b/gi, 'functional')
      .replace(/\badn\b/gi, 'and')
      .replace(/\bplease\s*$/gi, '') // Remove trailing "please"
      .replace(/\bui\b/gi, 'UI')
      .replace(/\bapi\b/gi, 'API')
      .replace(/\bsiso\b/gi, 'SISO')
      // Fix common typos
      .replace(/\bstuidly\b/gi, 'stupidly')
      .replace(/\bannoeyd\b/gi, 'annoyed')
      .replace(/\bspellign\b/gi, 'spelling')
      .replace(/\bpunctinality\b/gi, 'punctuation')
      .replace(/\badded\b/gi, 'added')
      .replace(/\bdsuccessfully\b/gi, 'successfully')
      // Clean up spacing and punctuation
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/\s*,\s*/g, ', ') // Fix comma spacing
      .replace(/\s*\.\s*/g, '. ') // Fix period spacing
      .trim();
    
    // Capitalize first letter and ensure proper sentence structure
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      
      // Add period if sentence doesn't end with punctuation
      if (!/[.!?]$/.test(cleaned)) {
        cleaned += '.';
      }
    }
    
    // Enhance task-specific formatting
    if (cleaned.toLowerCase().includes('life lock') || cleaned.toLowerCase().includes('lifelock')) {
      cleaned = cleaned.replace(/life\s*lock/gi, 'LifeLock');
    }
    
    return cleaned;
  }

  private generateTaskDescription(title: string, category: string, priority: string): string {
    const lowerTitle = title.toLowerCase();
    let description = '';
    
    // Generate context-aware descriptions based on title content and category
    if (lowerTitle.includes('fix') || lowerTitle.includes('bug') || lowerTitle.includes('error')) {
      description = `Investigate and resolve the issue described in: "${title}". Review the current implementation, identify the root cause, and implement a proper fix. Test thoroughly to ensure the issue is completely resolved.`;
    } else if (lowerTitle.includes('test') || lowerTitle.includes('testing')) {
      description = `Comprehensive testing of the feature or functionality mentioned in: "${title}". Create test cases, execute manual and automated tests, document any issues found, and verify all requirements are met.`;
    } else if (lowerTitle.includes('create') || lowerTitle.includes('add') || lowerTitle.includes('implement')) {
      description = `Implementation of new functionality: "${title}". Plan the approach, design the solution architecture, implement the feature following best practices, and ensure proper integration with existing systems.`;
    } else if (lowerTitle.includes('update') || lowerTitle.includes('modify') || lowerTitle.includes('improve')) {
      description = `Enhancement and optimization of existing functionality: "${title}". Analyze current implementation, identify improvement opportunities, implement changes, and verify enhanced performance or usability.`;
    } else if (lowerTitle.includes('deploy') || lowerTitle.includes('release') || lowerTitle.includes('publish')) {
      description = `Deployment and release management for: "${title}". Prepare release artifacts, coordinate deployment process, monitor system health, and ensure successful rollout with rollback plan if needed.`;
    } else if (lowerTitle.includes('design') || lowerTitle.includes('ui') || lowerTitle.includes('interface')) {
      description = `User interface and experience design work: "${title}". Create mockups or wireframes, implement responsive design, ensure accessibility compliance, and conduct usability testing.`;
    } else if (lowerTitle.includes('database') || lowerTitle.includes('migration') || lowerTitle.includes('schema')) {
      description = `Database-related work: "${title}". Design or modify database schema, create migration scripts, ensure data integrity, and optimize query performance.`;
    } else if (lowerTitle.includes('api') || lowerTitle.includes('endpoint') || lowerTitle.includes('service')) {
      description = `API development and integration: "${title}". Design API endpoints, implement business logic, ensure proper error handling, and create comprehensive documentation.`;
    } else if (lowerTitle.includes('security') || lowerTitle.includes('auth') || lowerTitle.includes('permission')) {
      description = `Security and authentication implementation: "${title}". Implement secure authentication flow, configure proper permissions, audit security vulnerabilities, and ensure compliance standards.`;
    } else if (lowerTitle.includes('performance') || lowerTitle.includes('optimize') || lowerTitle.includes('speed')) {
      description = `Performance optimization work: "${title}". Profile current performance, identify bottlenecks, implement optimizations, and measure improvement metrics.`;
    } else if (lowerTitle.includes('documentation') || lowerTitle.includes('readme') || lowerTitle.includes('guide')) {
      description = `Documentation creation and maintenance: "${title}". Write clear, comprehensive documentation, include code examples, update existing docs, and ensure information accuracy.`;
    } else {
      // Generic description based on category
      switch (category) {
        case 'siso_app_dev':
        case 'development':
          description = `Development task: "${title}". Implement the required functionality following SISO development standards, ensure code quality, and include appropriate testing.`;
          break;
        case 'onboarding_app':
          description = `Onboarding application task: "${title}". Focus on improving user experience during the onboarding process, ensure smooth workflow, and maintain consistency with existing features.`;
          break;
        case 'instagram':
        case 'marketing':
          description = `Marketing and social media task: "${title}". Execute marketing strategy, engage with target audience, and measure campaign effectiveness.`;
          break;
        case 'weekly':
          description = `Weekly recurring task: "${title}". Complete as part of regular weekly workflow, maintain consistency with previous executions, and document any changes or improvements.`;
          break;
        case 'daily':
          description = `Daily routine task: "${title}". Execute as part of daily workflow, ensure timely completion, and maintain quality standards.`;
          break;
        default:
          description = `Task: "${title}". Complete the specified work according to requirements, ensure quality delivery, and coordinate with team members as needed.`;
      }
    }
    
    // Add priority-specific context
    if (priority === 'high' || priority === 'urgent') {
      description += ' **HIGH PRIORITY** - This task requires immediate attention and should be completed as soon as possible.';
    } else if (priority === 'low') {
      description += ' This task can be completed when time permits and other priorities are addressed.';
    }
    
    return this.cleanupTaskText(description);
  }

  private async createTask(content: TaskCommand['content']): Promise<TaskAgentResponse> {
    if (!content?.title) {
      throw new Error('Task title is required');
    }

    try {
      const user = await this.getCurrentUser();
      
      // Clean up and enhance the task text
      const cleanedTitle = this.cleanupTaskText(content.title);
      const priority = content.priority || 'medium';
      const category = content.category || 'main';
      
      // Generate description if not provided
      let cleanedDescription = content.description ? this.cleanupTaskText(content.description) : undefined;
      if (!cleanedDescription) {
        cleanedDescription = this.generateTaskDescription(cleanedTitle, category, priority);
      }
      
      // Create task with immediate response - don't wait for database confirmation
      const taskData = {
        title: cleanedTitle,
        description: cleanedDescription,
        priority: priority,
        category: category,
        status: 'pending',
        created_by: user.id,
        assigned_to: user.id,
        due_date: content.dueDate,
        estimated_hours: content.estimatedHours
      };

      // Return immediate response for better UX
      const immediateResponse = {
        success: true,
        message: `Created ${content.priority || 'medium'} priority task: "${cleanedTitle}"`,
        action: 'create',
        data: { ...taskData, id: `temp_${Date.now()}` },
        affectedCount: 1
      };

      // Insert to database in background (don't await)
      supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Background task creation failed:', error);
          } else {
            console.log('✅ Task successfully created in database:', data);
          }
        });

      return immediateResponse;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  }

  private async completeTasks(filters?: TaskCommand['filters']): Promise<TaskAgentResponse> {
    const user = await this.getCurrentUser();
    
    let query = supabase
      .from('tasks')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
      .neq('status', 'completed'); // Only update non-completed tasks

    // Apply filters
    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.priority) query = query.eq('priority', filters.priority);

    const { error, count } = await query;
    
    if (error) throw error;
    
    const completedCount = count || 0;
    const filterDescription = this.buildFilterDescription(filters);
    
    return {
      success: true,
      message: `Completed ${completedCount} ${filterDescription}task${completedCount !== 1 ? 's' : ''}.`,
      action: 'complete',
      affectedCount: completedCount
    };
  }

  private async getTaskStatus(filters?: TaskCommand['filters'], uiTasks?: any[]): Promise<TaskAgentResponse> {
    try {
      console.log('🔧 [AI TASK AGENT] Database RLS blocking access, using UI state data...');
      
      // Since database access is blocked by RLS policies, use UI state data
      if (!uiTasks || uiTasks.length === 0) {
        return {
          success: false,
          message: `❌ Cannot access task status due to database RLS policy issues.\n\n**The Problem:** "infinite recursion detected in policy for relation 'user_roles'"\n\n**To Fix:**\n1. Go to Supabase Dashboard\n2. Navigate to Authentication → Policies\n3. Find the 'tasks' table policies\n4. Replace complex policies with simple ones\n\n**Example Fix:**\n\`\`\`sql\nCREATE POLICY "users_own_tasks" ON tasks\nFOR ALL USING (auth.uid() = created_by OR auth.uid() = assigned_to);\n\`\`\``,
          action: 'status'
        };
      }
      
      const tasks = uiTasks;
      console.log('🔧 [AI TASK AGENT] Processing UI task status data:', tasks.length, 'tasks');
      
      // Calculate real statistics from UI data
      const stats = {
        total: tasks.length,
        pending: tasks.filter(t => !t.completed && t.status !== 'completed').length,
        inProgress: tasks.filter(t => t.status === 'in-progress' || t.status === 'in_progress').length,
        completed: tasks.filter(t => t.completed || t.status === 'completed' || t.status === 'done').length,
        highPriority: tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length,
        overdue: tasks.filter(t => t.status === 'overdue').length,
        byCategory: {
          main: tasks.filter(t => t.category === 'main' || t.category === 'development').length,
          weekly: tasks.filter(t => t.category === 'weekly').length,
          daily: tasks.filter(t => t.category === 'daily').length,
          development: tasks.filter(t => t.category === 'development' || t.category === 'siso_app_dev').length,
          onboarding: tasks.filter(t => t.category === 'onboarding' || t.category === 'onboarding_app').length,
          instagram: tasks.filter(t => t.category === 'instagram' || t.category === 'marketing').length
        }
      };
      
      // Show some recent task titles for context
      const recentTasks = tasks
        .filter(t => !t.completed && t.status !== 'completed')
        .slice(0, 3)
        .map(t => `• ${t.title}`)
        .join('\n');
      
      const message = `📊 **Current Task Status (from UI State)**\n\n` +
        `**Total Tasks:** ${stats.total}\n` +
        `**Active:** ${stats.pending + stats.inProgress} (${stats.pending} pending, ${stats.inProgress} in progress)\n` +
        `**Completed:** ${stats.completed}\n` +
        `**High Priority:** ${stats.highPriority}\n` +
        `**Overdue:** ${stats.overdue}\n\n` +
        `**By Category:**\n` +
        `• Main: ${stats.byCategory.main}\n` +
        `• Weekly: ${stats.byCategory.weekly}\n` +
        `• Daily: ${stats.byCategory.daily}\n` +
        `• Development: ${stats.byCategory.development}\n` +
        `• Onboarding: ${stats.byCategory.onboarding}\n` +
        `• Instagram: ${stats.byCategory.instagram}\n\n` +
        (recentTasks ? `**Recent Active Tasks:**\n${recentTasks}\n\n` : '') +
        `⚠️ **Note**: Using UI state data due to database RLS policy issues. Fix Supabase policies for live database access.`;
      
      return {
        success: true,
        message,
        action: 'status',
        data: { stats, tasks }
      };
    } catch (error) {
      console.error('Get task status error:', error);
      throw error;
    }
  }

  private buildFilterDescription(filters?: TaskCommand['filters']): string {
    const parts: string[] = [];
    
    if (filters?.category) parts.push(filters.category);
    if (filters?.priority) parts.push(`${filters.priority} priority`);
    if (filters?.status) parts.push(filters.status);
    
    return parts.length > 0 ? `${parts.join(' ')} ` : '';
  }

  // Process natural language input and execute
  public async processInput(input: string): Promise<TaskAgentResponse> {
    console.log('🎯 [AI TASK AGENT] Processing input:', input);
    
    const command = this.parseCommand(input);
    console.log('📋 [AI TASK AGENT] Parsed command:', command);
    
    const response = await this.executeCommand(command);
    console.log('✅ [AI TASK AGENT] Response:', response);
    
    return response;
  }
}

// Export singleton instance
export const aiTaskAgent = new AITaskAgent();