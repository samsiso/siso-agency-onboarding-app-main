import React, { useState } from 'react';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import { grokTaskService } from '@/services/grokTaskService';
import { Brain } from 'lucide-react';

// Simple types to avoid import issues
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

export const AITaskChat: React.FC<AITaskChatProps> = ({
  tasks,
  chatMessages,
  onTasksUpdate,
  onChatUpdate
}) => {
  const [isLoading, setIsLoading] = useState(false);

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

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#252525' }}>
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
              <h2 className="text-xl text-white mb-4 font-semibold">AI Task Assistant</h2>
              <p className="text-gray-300 mb-4 max-w-md">
                I can help you create tasks, analyze your workload, suggest priorities, and optimize your productivity.
              </p>
              
              {/* AI Status Indicator */}
              <div className="mb-6">
                {grokTaskService.isReady() ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/40 rounded-full text-sm">
                    🤖 AI Ready - Groq API Connected
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/40 rounded-full text-sm">
                    ⚠️ Demo Mode - Configure VITE_GROQ_API_KEY
                  </div>
                )}
              </div>
              
              {/* Task Stats */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/40 rounded-full text-sm font-medium">
                  {activeTasks.length} Active
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/40 rounded-full text-sm font-medium">
                  {completedTasks.length} Completed
                </div>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full text-sm font-medium">
                  {tasks.filter(t => t.status === 'overdue').length} Overdue
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-orange-500 text-white shadow-sm' 
                      : 'bg-gray-800/80 text-gray-100 border border-gray-700/50'
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
                  <div className="bg-gray-800/80 text-gray-100 p-4 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-orange-400 animate-pulse" />
                      <span className="text-sm text-gray-300">Thinking...</span>
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