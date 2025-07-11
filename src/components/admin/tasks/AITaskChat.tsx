import React, { useState, useEffect, useRef } from 'react';
// Removed framer-motion for performance optimization
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import { grokTaskService } from '@/services/grokTaskService';
import { voiceService } from '@/services/voiceService';
import { aiTaskAgent } from '@/services/aiTaskAgent';
import { Brain, Copy, Check, Play } from 'lucide-react';

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
  onTaskRefresh?: () => void;
}

export const AITaskChat: React.FC<AITaskChatProps> = ({
  tasks,
  chatMessages,
  onTasksUpdate,
  onChatUpdate,
  onTaskRefresh
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Voice state - simplified
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Cleanup voice service on unmount
  useEffect(() => {
    return () => {
      voiceService.cleanup();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Voice output handler
  const speakMessage = async (text: string) => {
    if (!voiceService.isTTSSupported()) return;

    console.log('🔊 [AI TASK] Manual voice playback requested');
    console.log('📝 [AI TASK] Text to speak:', text.substring(0, 50) + '...');

    try {
      setIsSpeaking(true);
      await voiceService.speak(
        text,
        { voice: 'Fritz-PlayAI', rate: 1, pitch: 1 },
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        (error) => {
          console.error('TTS Error:', error);
          setIsSpeaking(false);
        }
      );
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  };

  // Enhanced voice input handler for PromptInputBox integration
  const handleVoiceInput = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!voiceService.isSpeechRecognitionSupported()) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      let finalTranscript = '';

      voiceService.startListening(
        (transcript, isFinal) => {
          if (isFinal) {
            finalTranscript = transcript;
            resolve(transcript);
          }
        },
        (error) => {
          reject(new Error(error));
        },
        {
          language: 'en-US',
          continuous: false,
          interimResults: true
        }
      ).catch(reject);
    });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);

    console.log('🧠 [AI TASK] User Message Received');
    console.log('🔍 [AI TASK] Input:', message);
    console.log('🔍 [AI TASK] Message Analysis:', {
      length: message.length,
      wordCount: message.split(' ').length,
      hasQuestion: message.includes('?'),
      isCommand: message.toLowerCase().startsWith('create') || message.toLowerCase().startsWith('add'),
      containsKeywords: {
        task: message.toLowerCase().includes('task'),
        project: message.toLowerCase().includes('project'),
        deadline: message.toLowerCase().includes('deadline'),
        priority: message.toLowerCase().includes('priority')
      }
    });

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    onChatUpdate([...chatMessages, userMessage]);

    try {
      console.log('🎯 [AI TASK] Processing AI Response...');
      console.log('🔄 [AI TASK] Context Setup:', {
        currentMessages: chatMessages.length,
        voiceEnabled,
        hasTaskContext: !!tasks.find(t => t.id === message.split(' ')[0]),
        taskId: message.split(' ')[0]
      });

      // Use AI Task Agent for intelligent task processing
      console.log('🤖 [AI TASK] Using AI Task Agent for processing...');
      
      let aiResponse = '';
      let taskActionPerformed = false;
      
      try {
        // Check if this is a task-related command
        const lowerMessage = message.toLowerCase().trim();
        const isTaskCommand = lowerMessage.includes('delete') || 
                             lowerMessage.includes('create') || 
                             lowerMessage.includes('add') || 
                             lowerMessage.includes('complete') || 
                             lowerMessage.includes('status') ||
                             lowerMessage.includes('clear') ||
                             lowerMessage.includes('remove') ||
                             lowerMessage.includes('finish') ||
                             lowerMessage.includes('done') ||
                             lowerMessage.startsWith('show') ||
                             lowerMessage.includes('task') ||
                             lowerMessage.includes('how many');
        
        if (isTaskCommand) {
          console.log('🎯 [AI TASK] Task command detected, processing with AI Task Agent...');
          console.log('🔍 [AI TASK] Original message:', message);
          console.log('🔍 [AI TASK] Processed message:', lowerMessage);
          console.log('🔍 [AI TASK] Available task context:', tasks.length, 'tasks');
          
          const agentResponse = await aiTaskAgent.processInput(message);
          console.log('🤖 [AI TASK] Agent response received:', agentResponse);
          
          if (agentResponse.success) {
            aiResponse = `✅ **Task Action Completed**\n\n${agentResponse.message}`;
            taskActionPerformed = true;
            
            // If tasks were modified, trigger a refresh of the task list
            if (agentResponse.affectedCount && agentResponse.affectedCount > 0) {
              console.log('🔄 [AI TASK] Tasks modified, triggering refresh...');
              
              // Trigger task refresh to update the UI immediately
              if (onTaskRefresh) {
                setTimeout(() => {
                  onTaskRefresh();
                  console.log('✅ [AI TASK] Task refresh triggered');
                }, 500); // Small delay to ensure database write completes
              }
            }
          } else {
            aiResponse = `❌ **Task Action Failed**\n\n${agentResponse.message}`;
          }
          
          console.log('✅ [AI TASK] AI Task Agent response:', agentResponse);
        } else {
          // Fall back to conversational responses for non-task commands
          console.log('💬 [AI TASK] Non-task command, using conversational response...');
          
          if (message.toLowerCase().includes('help')) {
            aiResponse = `I'm here to help you manage your tasks efficiently! Here's what I can do:

🔹 **Task Creation**: "Create a new task for..." or "Add task..."
🔹 **Task Deletion**: "Delete all tasks" or "Clear all main tasks"
🔹 **Task Completion**: "Complete all tasks" or "Finish all daily tasks"
🔹 **Status Checking**: "Show task status" or "How many tasks do I have?"
🔹 **Voice Commands**: Use voice for hands-free operation

**Examples:**
• "Delete all high priority tasks"
• "Create a new development task for API integration"
• "Complete all daily tasks"
• "Show me task status"

What would you like me to help you with?`;
          } else if (message.toLowerCase().includes('status') || message.toLowerCase().includes('how many')) {
            // Use AI Task Agent for status even if not detected as command
            const agentResponse = await aiTaskAgent.processInput('status');
            aiResponse = agentResponse.success ? agentResponse.message : 
              `Let me check your current task status...\n\n- Active tasks: ${tasks.filter(t => !t.completed).length}\n- Completed tasks: ${tasks.filter(t => t.completed).length}`;
          } else {
            const responses = [
              `I understand your request about "${message}". Let me help you with your task management needs.`,
              `Thanks for that input! I can help you create, manage, or organize tasks related to "${message}".`,
              `Interesting point about "${message}". Would you like me to create a task or help organize this into your workflow?`,
              `I see you mentioned "${message}". I can help you turn this into actionable tasks or provide status updates.`
            ];
            
            aiResponse = responses[Math.floor(Math.random() * responses.length)] + 
              `\n\n💡 **Quick Actions:**\n• Say "create task..." to add new tasks\n• Say "delete all tasks" to clear your list\n• Say "status" to see your task overview`;
          }
        }
      } catch (agentError) {
        console.error('❌ [AI TASK] AI Task Agent error:', agentError);
        aiResponse = `I encountered an issue processing your task request: ${agentError instanceof Error ? agentError.message : 'Unknown error'}. Please try again or rephrase your request.`;
      }

      console.log('📤 [AI TASK] Final AI Response:', aiResponse.substring(0, 100) + '...');
      console.log('🎭 [AI TASK] Response Characteristics:', {
        length: aiResponse.length,
        wordCount: aiResponse.split(' ').length,
        hasActionItems: aiResponse.includes('•') || aiResponse.includes('🔹'),
        tone: aiResponse.includes('!') ? 'enthusiastic' : 'professional'
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'assistant',
        timestamp: new Date()
      };

      onChatUpdate([...chatMessages, userMessage, aiMessage]);

      // Voice response logic with detailed logging - DISABLED FOR VOICE INPUT ONLY MODE
      console.log('🔇 [AI TASK] Auto-voice response DISABLED - Voice input only mode');
      console.log('💬 [AI TASK] Response available for manual playback via message buttons');
      
      // Note: Automatic voice response removed per user preference
      // User can still play voice manually using the play button on each message
      /* REMOVED AUTO-VOICE RESPONSE
      if (voiceEnabled) {
        console.log('🔊 [AI TASK] Voice Response Enabled - Starting TTS');
        console.log('🎵 [AI TASK] TTS Config:', {
          textLength: aiResponse.length,
          voiceServiceReady: voiceService.isTTSSupported(),
          backgroundMode: false
        });
        
        try {
          await speakMessage(aiResponse);
          console.log('✅ [AI TASK] Voice response completed successfully');
        } catch (voiceError) {
          console.error('❌ [AI TASK] Voice response failed:', voiceError);
        }
      } else {
        console.log('🔇 [AI TASK] Voice response disabled by user');
      }
      */

    } catch (error) {
      console.error('❌ [AI TASK] Error processing message:', error);
      console.log('🔧 [AI TASK] Error Context:', {
        userInput: message,
        messagesCount: chatMessages.length,
        timestamp: new Date().toISOString()
      });
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        content: 'I apologize, but I encountered an error processing your request. Please try again, and I\'ll do my best to help you.',
        sender: 'assistant',
        timestamp: new Date()
      };
      
      onChatUpdate([...chatMessages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
      console.log('🏁 [AI TASK] Message processing completed');
    }
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  // Group consecutive messages from the same sender
  const groupedMessages = chatMessages.reduce((groups: ChatMessage[][], message, index) => {
    const prevMessage = chatMessages[index - 1];
    if (prevMessage && prevMessage.sender === message.sender) {
      groups[groups.length - 1].push(message);
    } else {
      groups.push([message]);
    }
    return groups;
  }, []);

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#252525' }}>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">AI Task Assistant</h3>
          </div>
          
          {/* Voice Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                voiceEnabled 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30' 
                  : 'bg-gray-600/20 text-gray-400 border border-gray-600/30 hover:bg-gray-600/30'
              }`}
              title={voiceEnabled ? 'Voice input enabled, manual playback available' : 'Voice input available, auto-playback disabled'}
            >
              <span className="text-xs">🎤</span>
              <span>Voice Input Only</span>
            </button>
            
            {/* Speaking indicator */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1 px-2 py-1 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg text-xs hover:bg-red-600/30 transition-colors"
                title="Stop speaking"
              >
                <span className="animate-pulse">🔊</span>
                <span>Stop</span>
              </button>
            )}
          </div>
        </div>
        {chatMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-orange-500/30 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm shadow-lg">
                  <Brain className="w-8 h-8 text-orange-400" />
                </div>
              </div>
              
              <h2 className="text-2xl text-white mb-4 font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                AI Task Assistant
              </h2>
              
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                I can help you create tasks, analyze your workload, suggest priorities, and optimize your productivity.
              </p>
              
              {/* AI Status Indicator */}
              <div className="mb-8">
                {grokTaskService.isReady() ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    🤖 AI Ready - Groq API Connected
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/30 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    ⚠️ Demo Mode - Configure VITE_GROQ_API_KEY
                  </div>
                )}
              </div>
              
              {/* Enhanced Task Stats */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30 rounded-xl text-sm font-semibold backdrop-blur-sm shadow-lg">
                  <span className="text-orange-200">{activeTasks.length}</span> Active
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 rounded-xl text-sm font-semibold backdrop-blur-sm shadow-lg">
                  <span className="text-green-200">{completedTasks.length}</span> Completed
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30 rounded-xl text-sm font-semibold backdrop-blur-sm shadow-lg">
                  <span className="text-red-200">{tasks.filter(t => t.status === 'overdue').length}</span> Overdue
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div 
            ref={chatContainerRef}
            className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
          >
            <div className="space-y-6">
              {groupedMessages.map((messageGroup, groupIndex) => (
                  <div key={`group-${groupIndex}`} className={`flex ${messageGroup[0].sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end gap-3 max-w-[85%] ${messageGroup[0].sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className="flex-shrink-0 mb-1">
                        {messageGroup[0].sender === 'user' ? (
                          <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-orange-500/30 shadow-lg">
                            <img 
                              src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
                              alt="SISO" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-600/20 border border-orange-500/30 flex items-center justify-center backdrop-blur-sm shadow-lg">
                            <Brain className="w-5 h-5 text-orange-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Message Group */}
                      <div className="space-y-2">
                        {messageGroup.map((message, messageIndex) => (
                          <div
                            key={message.id}
                            className="group relative"
                          >
                            <div className={`relative p-4 rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl ${
                              message.sender === 'user' 
                                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange-500/20' 
                                : 'bg-gray-800/80 text-gray-100 border border-gray-700/50 shadow-gray-900/20'
                            }`}>
                              <div className="flex items-start gap-3">
                                {message.sender === 'assistant' && (
                                  <Brain className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm leading-relaxed whitespace-pre-line font-medium">
                                    {message.content}
                                  </p>
                                  <div className="flex items-center justify-between mt-3">
                                    <p className="text-xs opacity-70 font-medium">
                                      {message.timestamp.toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </p>
                                    
                                    <div className="flex items-center gap-2">
                                      {/* Voice playback button for AI messages */}
                                      {message.sender === 'assistant' && voiceService.isTTSSupported() && (
                                        <button
                                          onClick={() => speakMessage(message.content)}
                                          disabled={isSpeaking}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-md hover:bg-white/10 text-xs disabled:opacity-50"
                                          title="Play voice"
                                        >
                                          <Play className="w-3 h-3" />
                                        </button>
                                      )}
                                      
                                      {/* Copy button */}
                                      <button
                                        onClick={() => handleCopyMessage(message.id, message.content)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-md hover:bg-white/10 text-xs"
                                        title="Copy message"
                                      >
                                        {copiedMessageId === message.id ? (
                                          <Check className="w-3 h-3" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              
              {/* Enhanced Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-3 max-w-[85%]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-600/20 border border-orange-500/30 flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <Brain className="w-5 h-5 text-orange-400 animate-pulse" />
                    </div>
                    <div className="bg-gray-800/80 text-gray-100 p-4 rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-lg">
                      <div className="flex items-center gap-3">
                        <Brain className="w-4 h-4 text-orange-400" />
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-300 font-medium">Thinking</span>
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>
      
      {/* Clean Chat Input */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
        <PromptInputBox 
          onSend={(message, files) => handleSendMessage(message)} 
          placeholder="Ask me to create tasks, analyze workload, or help with planning..."
          isLoading={isLoading}
          className="bg-gray-800/90 border-gray-600/50 shadow-xl backdrop-blur-sm"
        />
      </div>
    </div>
  );
};