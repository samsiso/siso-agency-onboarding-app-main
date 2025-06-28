// Groq API Integration for Task Management
import Groq from 'groq-sdk';

// Simple types to avoid import conflicts
interface Task {
  id: string;
  title: string;
  completed: boolean;
  status: 'overdue' | 'due-today' | 'upcoming' | 'in-progress' | 'blocked' | 'not-started' | 'started' | 'done';
  priority: 'high' | 'medium' | 'low';
  assignee?: string;
  dueDate?: string;
  category: 'development' | 'design' | 'marketing' | 'client' | 'admin';
  tags?: string[];
  estimatedHours?: number;
}

interface GrokTaskRequest {
  message: string;
  tasks: Task[];
  action?: 'create' | 'analyze' | 'prioritize' | 'plan' | 'optimize';
}

interface GrokResponse {
  message: string;
  tasks?: Task[];
  suggestions?: string[];
  analysis?: {
    workloadSummary: string;
    recommendations: string[];
    priorityTasks: string[];
  };
}

export class GrokTaskService {
  private groq: Groq;
  private isConfigured: boolean;

  constructor() {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    this.isConfigured = !!apiKey;
    
    if (this.isConfigured) {
      this.groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  async chatWithGrok(request: GrokTaskRequest): Promise<GrokResponse> {
    if (!this.isConfigured) {
      return {
        message: "Groq API is not configured. Please add VITE_GROQ_API_KEY to your environment variables."
      };
    }

    try {
      const systemPrompt = this.buildSystemPrompt(request);
      const userPrompt = this.buildUserPrompt(request);

      const completion = await this.groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content || "No response generated";
      
      // Parse the response and extract tasks/analysis
      return this.parseGrokResponse(response, request);
    } catch (error) {
      console.error('Groq API Error:', error);
      return {
        message: "Sorry, I encountered an error while processing your request. Please try again."
      };
    }
  }

  private buildSystemPrompt(request: GrokTaskRequest): string {
    return `You are an AI task management assistant for SISO Agency. You help with:
1. Creating tasks from natural language
2. Analyzing workloads and productivity
3. Prioritizing tasks based on deadlines and importance
4. Creating project plans with multiple tasks
5. Optimizing schedules and workflows

Current task context:
- Total tasks: ${request.tasks.length}
- Active tasks: ${request.tasks.filter(t => !t.completed).length}
- Overdue tasks: ${request.tasks.filter(t => t.status === 'overdue').length}

Available categories: development, design, marketing, client, admin
Available priorities: high, medium, low
Available statuses: not-started, in-progress, blocked, done, overdue, due-today, upcoming

When creating tasks, respond with a JSON object containing:
{
  "message": "Your helpful response",
  "tasks": [array of new task objects if creating tasks],
  "analysis": {analysis object if analyzing workload}
}

Be helpful, concise, and actionable in your responses.`;
  }

  private buildUserPrompt(request: GrokTaskRequest): string {
    let prompt = `User request: "${request.message}"`;
    
    if (request.action) {
      prompt += `\nAction type: ${request.action}`;
    }

    if (request.tasks.length > 0) {
      prompt += `\n\nCurrent tasks:\n`;
      request.tasks.slice(0, 5).forEach(task => {
        prompt += `- ${task.title} (${task.status}, ${task.priority} priority)\n`;
      });
    }

    return prompt;
  }

  private parseGrokResponse(response: string, request: GrokTaskRequest): GrokResponse {
    try {
      // Try to parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          message: parsed.message || response,
          tasks: parsed.tasks || undefined,
          analysis: parsed.analysis || undefined
        };
      }
    } catch (e) {
      // If JSON parsing fails, fall back to text response
    }

    // Handle text responses and extract potential tasks
    const tasks = this.extractTasksFromText(response);
    
    return {
      message: response,
      tasks: tasks.length > 0 ? tasks : undefined
    };
  }

  private extractTasksFromText(text: string): Task[] {
    const tasks: Task[] = [];
    const lines = text.split('\n');
    
    lines.forEach((line, index) => {
      // Look for task-like patterns (bullet points, numbered lists, etc.)
      const taskMatch = line.match(/^[\s]*[-*•]\s*(.+)$/) || 
                       line.match(/^[\s]*\d+[\.)]\s*(.+)$/) ||
                       line.match(/^[\s]*Task:\s*(.+)$/i);
      
      if (taskMatch && taskMatch[1]) {
        const title = taskMatch[1].trim();
        if (title.length > 5 && title.length < 100) { // Reasonable task title length
          tasks.push({
            id: `generated-${Date.now()}-${index}`,
            title: title,
            completed: false,
            status: 'not-started',
            priority: 'medium',
            category: 'admin' // Default category
          });
        }
      }
    });

    return tasks;
  }

  // Specialized methods for different AI actions
  async analyzeWorkload(tasks: Task[]): Promise<GrokResponse> {
    return this.chatWithGrok({
      message: "Please analyze my current workload and provide insights on productivity, task distribution, and recommendations for improvement.",
      tasks,
      action: 'analyze'
    });
  }

  async suggestTaskPriorities(tasks: Task[]): Promise<GrokResponse> {
    return this.chatWithGrok({
      message: "Help me prioritize these tasks based on deadlines, importance, and dependencies. Suggest which tasks I should focus on first.",
      tasks,
      action: 'prioritize'
    });
  }

  async createProjectPlan(projectDescription: string, tasks: Task[]): Promise<GrokResponse> {
    return this.chatWithGrok({
      message: `Create a project plan for: ${projectDescription}. Break it down into specific tasks with priorities and estimated timelines.`,
      tasks,
      action: 'plan'
    });
  }

  async optimizeSchedule(tasks: Task[]): Promise<GrokResponse> {
    return this.chatWithGrok({
      message: "Analyze my current tasks and suggest ways to optimize my schedule for better productivity and time management.",
      tasks,
      action: 'optimize'
    });
  }

  // Check if the service is properly configured
  isReady(): boolean {
    return this.isConfigured;
  }
}

export const grokTaskService = new GrokTaskService();