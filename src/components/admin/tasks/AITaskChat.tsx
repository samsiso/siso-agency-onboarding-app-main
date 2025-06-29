import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import { grokTaskService } from '@/services/grokTaskService';
import { voiceService } from '@/services/voiceService';
import { Brain, Copy, Check, Mic, MicOff, Volume2, VolumeX, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);

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

  // Voice input handlers
  const startVoiceInput = async () => {
    if (!voiceService.isSpeechRecognitionSupported()) {
      setVoiceError('Speech recognition not supported in this browser');
      return;
    }

    try {
      setIsListening(true);
      setVoiceError(null);
      setCurrentTranscript('');

      await voiceService.startListening(
        (transcript, isFinal) => {
          setCurrentTranscript(transcript);
          if (isFinal) {
            handleSendMessage(transcript);
            setCurrentTranscript('');
            setIsListening(false);
          }
        },
        (error) => {
          setVoiceError(error);
          setIsListening(false);
          setCurrentTranscript('');
        },
        {
          language: 'en-US',
          continuous: false,
          interimResults: true
        }
      );
    } catch (error) {
      setVoiceError(error instanceof Error ? error.message : 'Voice input failed');
      setIsListening(false);
    }
  };

  const stopVoiceInput = () => {
    voiceService.stopListening();
    setIsListening(false);
    setCurrentTranscript('');
  };

  // Voice output handler
  const speakMessage = async (text: string) => {
    if (!voiceService.isTTSSupported() || !voiceEnabled) return;

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

      // Auto-speak AI response if voice is enabled
      if (voiceEnabled && voiceService.isTTSSupported()) {
        await speakMessage(response.message);
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
        {chatMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="w-20 h-20 mx-auto mb-8 flex items-center justify-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="w-16 h-16 border-2 border-orange-500/30 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm shadow-lg">
                  <Brain className="w-8 h-8 text-orange-400" />
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-2xl text-white mb-4 font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                AI Task Assistant
              </motion.h2>
              
              <motion.p 
                className="text-gray-300 mb-6 max-w-md leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                I can help you create tasks, analyze your workload, suggest priorities, and optimize your productivity.
              </motion.p>
              
              {/* AI Status Indicator */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
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
              </motion.div>
              
              {/* Enhanced Task Stats */}
              <motion.div 
                className="flex items-center justify-center gap-4 mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <div className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30 rounded-xl text-sm font-semibold backdrop-blur-sm shadow-lg">
                  <span className="text-orange-200">{activeTasks.length}</span> Active
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 rounded-xl text-sm font-semibold backdrop-blur-sm shadow-lg">
                  <span className="text-green-200">{completedTasks.length}</span> Completed
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30 rounded-xl text-sm font-semibold backdrop-blur-sm shadow-lg">
                  <span className="text-red-200">{tasks.filter(t => t.status === 'overdue').length}</span> Overdue
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <div 
            ref={chatContainerRef}
            className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
          >
            <div className="space-y-6">
              <AnimatePresence>
                {groupedMessages.map((messageGroup, groupIndex) => (
                  <motion.div
                    key={`group-${groupIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
                    className={`flex ${messageGroup[0].sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
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
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: messageIndex * 0.05 }}
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
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Enhanced Loading Indicator */}
              {isLoading && (
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
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
                </motion.div>
              )}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced Chat Input with Voice Controls */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
        {/* Voice Controls Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Voice Input Button */}
            <Button
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              disabled={isLoading}
              size="sm"
              className={`transition-all duration-200 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'
              } shadow-lg`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Voice
                </>
              )}
            </Button>

            {/* Voice Response Toggle */}
            <Button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              size="sm"
              variant="outline"
              className={`transition-all duration-200 ${
                voiceEnabled 
                  ? 'border-green-500/50 text-green-400 hover:bg-green-500/10' 
                  : 'border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Voice On
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 mr-2" />
                  Voice Off
                </>
              )}
            </Button>

            {/* Speaking Indicator */}
            {isSpeaking && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span>Speaking...</span>
                <Button
                  onClick={stopSpeaking}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                >
                  <Square className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Voice Status */}
          <div className="flex items-center gap-2 text-xs">
            {voiceService.isSpeechRecognitionSupported() ? (
              <span className="text-green-400">🎤 Voice Ready</span>
            ) : (
              <span className="text-orange-400">⚠️ Voice Not Supported</span>
            )}
            {voiceService.isTTSSupported() && (
              <span className="text-green-400">🔊 TTS Ready</span>
            )}
          </div>
        </div>

        {/* Current Transcript Display */}
        {(isListening || currentTranscript) && (
          <motion.div 
            className="mb-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
              </div>
              <span className="text-orange-300 text-sm font-medium">Listening...</span>
            </div>
            <p className="text-white text-sm">
              {currentTranscript || 'Speak now...'}
            </p>
          </motion.div>
        )}

        {/* Voice Error Display */}
        {voiceError && (
          <motion.div 
            className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-red-400 text-sm">⚠️ {voiceError}</span>
              <Button
                onClick={() => setVoiceError(null)}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
              >
                ×
              </Button>
            </div>
          </motion.div>
        )}

        {/* Text Input */}
        <PromptInputBox 
          onSend={(message, files) => handleSendMessage(message)} 
          placeholder="Ask me to create tasks, analyze workload, or help with planning... (or use voice input)"
          isLoading={isLoading}
          className="bg-gray-800/90 border-gray-600/50 shadow-xl backdrop-blur-sm"
        />
        
        {/* Enhanced Example Prompts */}
        {chatMessages.length === 0 && (
          <motion.div 
            className="mt-4 text-xs text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="mb-2 text-gray-300 font-medium">💡 Try these examples (voice or text):</p>
            <div className="space-y-1 text-gray-500">
              <p>• "Create a task to redesign the landing page by next Friday"</p>
              <p>• "Help me prioritize my tasks for this week"</p>
              <p>• "Break down the new feature project into smaller tasks"</p>
              <p>• "What should I focus on to meet my deadlines?"</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};