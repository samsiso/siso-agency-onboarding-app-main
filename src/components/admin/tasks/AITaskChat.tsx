import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import { grokTaskService } from '@/services/grokTaskService';
import { 
  Brain, 
  Zap, 
  BarChart3, 
  Target, 
  Clock,
  TrendingUp,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';

// Simple types to avoid import issues
interface Task {
  id: string;
  title: string;
  completed: boolean;
  status: string;
  priority: string;
  assignee?: string;
  dueDate?: string;
  category: string;
  tags?: string[];
  estimatedHours?: number;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface AITaskChatProps {
  tasks: Task[];
  chatMessages: ChatMessage[];
  onTasksUpdate: (tasks: Task[]) => void;
  onChatUpdate: (messages: ChatMessage[]) => void;
}

const quickActions = [
  {
    id: 'analyze',
    label: 'Analyze Workload',
    icon: BarChart3,
    prompt: 'Analyze my current workload and provide insights on productivity and priorities',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/40'
  },
  {
    id: 'prioritize',
    label: 'Prioritize Tasks',
    icon: Target,
    prompt: 'Help me prioritize my tasks based on deadlines and importance',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/40'
  },
  {
    id: 'plan',
    label: 'Create Project',
    icon: Lightbulb,
    prompt: 'Help me create a new project plan with multiple tasks',
    color: 'bg-green-500/20 text-green-400 border-green-500/40'
  },
  {
    id: 'optimize',
    label: 'Optimize Schedule',
    icon: Clock,
    prompt: 'Suggest ways to optimize my schedule and improve productivity',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/40'
  }
];

export const AITaskChat: React.FC<AITaskChatProps> = ({
  tasks,
  chatMessages,
  onTasksUpdate,
  onChatUpdate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    onChatUpdate([...chatMessages, userMessage]);

    try {
      // Call Groq API through our service
      const response = await grokTaskService.chatWithGrok({
        message,
        tasks
      });

      // Create AI response message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'assistant',
        timestamp: new Date()
      };

      onChatUpdate([...chatMessages, userMessage, aiMessage]);

      // If the AI response includes new tasks, add them to the task list
      if (response.tasks && response.tasks.length > 0) {
        const newTasks = [...tasks, ...response.tasks];
        onTasksUpdate(newTasks);
      }

    } catch (error) {
      console.error('AI Chat Error:', error);
      
      // Fallback error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        sender: 'assistant',
        timestamp: new Date()
      };

      onChatUpdate([...chatMessages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: typeof quickActions[0]) => {
    setSelectedQuickAction(action.id);
    setIsLoading(true);

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: action.prompt,
      sender: 'user',
      timestamp: new Date()
    };

    onChatUpdate([...chatMessages, userMessage]);

    try {
      let response;
      
      // Use specialized methods for better AI responses
      switch (action.id) {
        case 'analyze':
          response = await grokTaskService.analyzeWorkload(tasks);
          break;
        case 'prioritize':
          response = await grokTaskService.suggestTaskPriorities(tasks);
          break;
        case 'optimize':
          response = await grokTaskService.optimizeSchedule(tasks);
          break;
        default:
          response = await grokTaskService.chatWithGrok({
            message: action.prompt,
            tasks,
            action: action.id as any
          });
      }

      // Create AI response message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'assistant',
        timestamp: new Date()
      };

      onChatUpdate([...chatMessages, userMessage, aiMessage]);

      // If the AI response includes new tasks, add them to the task list
      if (response.tasks && response.tasks.length > 0) {
        const newTasks = [...tasks, ...response.tasks];
        onTasksUpdate(newTasks);
      }

    } catch (error) {
      console.error('AI Quick Action Error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I encountered an error while processing that action. Please try again.",
        sender: 'assistant',
        timestamp: new Date()
      };

      onChatUpdate([...chatMessages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedQuickAction(null);
    }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="flex-1 flex flex-col max-w-2xl" style={{ backgroundColor: '#252525' }}>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {chatMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-orange-500 rounded-lg flex items-center justify-center bg-orange-500/20">
                  <Brain className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <h2 className="text-xl text-white mb-4">AI Task Assistant</h2>
              <p className="text-gray-400 mb-4 max-w-md">
                I can help you create tasks, analyze your workload, suggest priorities, and optimize your productivity.
              </p>
              
              {/* AI Status Indicator */}
              <div className="mb-6">
                {grokTaskService.isReady() ? (
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/40">
                    🤖 AI Ready - Groq API Connected
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/40">
                    ⚠️ Demo Mode - Configure VITE_GROQ_API_KEY
                  </Badge>
                )}</div>
              
              {/* Task Stats */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/40">
                  {activeTasks.length} Active
                </Badge>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/40">
                  {completedTasks.length} Completed
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40">
                  {tasks.filter(t => t.status === 'overdue').length} Overdue
                </Badge>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="w-full max-w-md">
              <h3 className="text-sm font-medium text-gray-400 mb-4 text-center">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  const isActionLoading = selectedQuickAction === action.id;
                  
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      onClick={() => handleQuickAction(action)}
                      disabled={isLoading || isActionLoading}
                      className={`${action.color} border p-4 h-auto flex flex-col items-center gap-2 hover:opacity-80 transition-opacity`}
                    >
                      {isActionLoading ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                      <span className="text-xs font-medium">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full max-w-2xl mx-auto p-6 overflow-y-auto">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    <div className="flex items-start gap-2 mb-2">
                      {message.sender === 'assistant' && (
                        <Brain className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-orange-400 animate-pulse" />
                      <span className="text-sm text-gray-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <div className="p-4 border-t border-white/20">
        <PromptInputBox 
          onSend={(message, files) => handleSendMessage(message)} 
          placeholder="Ask me to create tasks, analyze workload, or help with planning..."
          isLoading={isLoading}
        />
        
        {/* Example Prompts */}
        {chatMessages.length === 0 && (
          <div className="mt-3 text-xs text-gray-500">
            <p className="mb-1">💡 Try these examples:</p>
            <p>• "Create a task to redesign the landing page by next Friday"</p>
            <p>• "Help me prioritize my tasks for this week"</p>
            <p>• "Break down the new feature project into smaller tasks"</p>
            <p>• "What should I focus on to meet my deadlines?"</p>
          </div>
        )}
      </div>
    </div>
  );
};