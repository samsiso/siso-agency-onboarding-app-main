import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import { voiceService } from '@/services/voiceService';
import { Brain, Copy, Check, Play, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Types for Life Lock data
interface MorningRoutineItem {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  logField?: string;
}

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
}

interface WorkoutItem {
  id: string;
  title: string;
  completed: boolean;
  target?: string;
  logged?: string;
}

interface HealthItem {
  id: string;
  title: string;
  completed: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  action?: 'task_update' | 'routine_update' | 'workout_update' | 'health_update';
}

interface LifeLockVoiceAgentProps {
  morningRoutine: MorningRoutineItem[];
  deepFocusTasks: TaskItem[];
  lightFocusTasks: TaskItem[];
  workoutItems: WorkoutItem[];
  healthItems: HealthItem[];
  workHours: { deepFocus: string; lightFocus: string };
  macros: { calories: string; protein: string; carbs: string; fats: string };
  onUpdateMorningRoutine: (items: MorningRoutineItem[]) => void;
  onUpdateDeepFocusTasks: (items: TaskItem[]) => void;
  onUpdateLightFocusTasks: (items: TaskItem[]) => void;
  onUpdateWorkoutItems: (items: WorkoutItem[]) => void;
  onUpdateHealthItems: (items: HealthItem[]) => void;
  onUpdateWorkHours: (hours: { deepFocus: string; lightFocus: string }) => void;
  onUpdateMacros: (macros: { calories: string; protein: string; carbs: string; fats: string }) => void;
  dateKey: string;
}

export const LifeLockVoiceAgent: React.FC<LifeLockVoiceAgentProps> = ({
  morningRoutine,
  deepFocusTasks,
  lightFocusTasks,
  workoutItems,
  healthItems,
  workHours,
  macros,
  onUpdateMorningRoutine,
  onUpdateDeepFocusTasks,
  onUpdateLightFocusTasks,
  onUpdateWorkoutItems,
  onUpdateHealthItems,
  onUpdateWorkHours,
  onUpdateMacros,
  dateKey
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Voice state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);

  // Load chat messages from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`lifelock-${dateKey}-chat`);
      if (stored) {
        const messages = JSON.parse(stored).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setChatMessages(messages);
      }
    } catch (error) {
      console.error('Failed to load chat messages:', error);
    }
  }, [dateKey]);

  // Save chat messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`lifelock-${dateKey}-chat`, JSON.stringify(chatMessages));
    } catch (error) {
      console.error('Failed to save chat messages:', error);
    }
  }, [chatMessages, dateKey]);

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

  // Enhanced voice input handler
  const handleVoiceInput = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!voiceService.isSpeechRecognitionSupported()) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      setIsListening(true);
      let finalTranscript = '';

      voiceService.startListening(
        (transcript, isFinal) => {
          if (isFinal) {
            finalTranscript = transcript;
            setIsListening(false);
            resolve(transcript);
          }
        },
        (error) => {
          setIsListening(false);
          reject(new Error(error));
        },
        {
          language: 'en-US',
          continuous: false,
          interimResults: true
        }
      ).catch((error) => {
        setIsListening(false);
        reject(error);
      });
    });
  };

  // Parse voice commands and execute actions
  const processVoiceCommand = (message: string): { response: string; action?: string } => {
    const lowercaseMsg = message.toLowerCase();
    
    // Morning routine commands
    if (lowercaseMsg.includes('morning routine') || lowercaseMsg.includes('morning')) {
      if (lowercaseMsg.includes('complete') || lowercaseMsg.includes('check off') || lowercaseMsg.includes('done')) {
        // Check off morning routine items
        const updatedRoutine = morningRoutine.map(item => {
          if (lowercaseMsg.includes(item.title.toLowerCase()) || 
              lowercaseMsg.includes('all') ||
              lowercaseMsg.includes('everything')) {
            return { ...item, completed: true };
          }
          return item;
        });
        
        if (lowercaseMsg.includes('all') || lowercaseMsg.includes('everything')) {
          const allCompleted = morningRoutine.map(item => ({ ...item, completed: true }));
          onUpdateMorningRoutine(allCompleted);
          return { response: "I've marked all morning routine items as complete! 🌅 Great start to your day!", action: 'routine_update' };
        } else {
          onUpdateMorningRoutine(updatedRoutine);
          return { response: "I've updated your morning routine progress! ✅", action: 'routine_update' };
        }
      }
    }

    // Deep focus task commands
    if (lowercaseMsg.includes('deep focus') || lowercaseMsg.includes('focus task')) {
      if (lowercaseMsg.includes('delete all') || lowercaseMsg.includes('clear all') || lowercaseMsg.includes('remove all')) {
        const clearedTasks = deepFocusTasks.map(task => ({ ...task, title: '', completed: false }));
        onUpdateDeepFocusTasks(clearedTasks);
        return { response: "I've cleared all your deep focus tasks. Ready for a fresh start! 🧠", action: 'task_update' };
      }
      
      if (lowercaseMsg.includes('complete') || lowercaseMsg.includes('done')) {
        const updatedTasks = deepFocusTasks.map(task => {
          if (task.title && (lowercaseMsg.includes(task.title.toLowerCase()) || lowercaseMsg.includes('all'))) {
            return { ...task, completed: true };
          }
          return task;
        });
        onUpdateDeepFocusTasks(updatedTasks);
        return { response: "I've marked your deep focus tasks as complete! 🎯 Excellent work!", action: 'task_update' };
      }
    }

    // Light focus task commands
    if (lowercaseMsg.includes('light focus') || lowercaseMsg.includes('light task')) {
      if (lowercaseMsg.includes('complete') || lowercaseMsg.includes('done')) {
        const updatedTasks = lightFocusTasks.map(task => {
          if (task.title && (lowercaseMsg.includes(task.title.toLowerCase()) || lowercaseMsg.includes('all'))) {
            return { ...task, completed: true };
          }
          return task;
        });
        onUpdateLightFocusTasks(updatedTasks);
        return { response: "I've updated your light focus tasks! ☕ Keep the momentum going!", action: 'task_update' };
      }
    }

    // Workout commands
    if (lowercaseMsg.includes('workout') || lowercaseMsg.includes('exercise')) {
      if (lowercaseMsg.includes('complete') || lowercaseMsg.includes('done')) {
        const updatedWorkout = workoutItems.map(item => {
          if (lowercaseMsg.includes(item.title.toLowerCase()) || lowercaseMsg.includes('all')) {
            return { ...item, completed: true };
          }
          return item;
        });
        onUpdateWorkoutItems(updatedWorkout);
        return { response: "I've marked your workout as complete! 💪 You're crushing it!", action: 'workout_update' };
      }
    }

    // Health items commands
    if (lowercaseMsg.includes('health') || lowercaseMsg.includes('supplement') || lowercaseMsg.includes('water')) {
      if (lowercaseMsg.includes('complete') || lowercaseMsg.includes('done')) {
        const updatedHealth = healthItems.map(item => {
          if (lowercaseMsg.includes(item.title.toLowerCase()) || lowercaseMsg.includes('all')) {
            return { ...item, completed: true };
          }
          return item;
        });
        onUpdateHealthItems(updatedHealth);
        return { response: "I've updated your health tracking! 🌱 Taking care of yourself!", action: 'health_update' };
      }
    }

    // Work hours commands
    if (lowercaseMsg.includes('work hours') || lowercaseMsg.includes('log hours')) {
      const hourMatch = lowercaseMsg.match(/(\d+)\s*hours?/);
      if (hourMatch) {
        const hours = hourMatch[1];
        if (lowercaseMsg.includes('deep')) {
          onUpdateWorkHours({ ...workHours, deepFocus: hours });
          return { response: `I've logged ${hours} hours of deep focus work! 🧠 Excellent productivity!`, action: 'task_update' };
        } else if (lowercaseMsg.includes('light')) {
          onUpdateWorkHours({ ...workHours, lightFocus: hours });
          return { response: `I've logged ${hours} hours of light focus work! ☕ Great job!`, action: 'task_update' };
        }
      }
    }

    // General status check
    if (lowercaseMsg.includes('status') || lowercaseMsg.includes('progress') || lowercaseMsg.includes('how am i doing')) {
      const completedMorning = morningRoutine.filter(item => item.completed).length;
      const completedDeep = deepFocusTasks.filter(task => task.completed).length;
      const completedHealth = healthItems.filter(item => item.completed).length;
      
      return { 
        response: `Here's your progress: Morning routine ${completedMorning}/${morningRoutine.length}, Deep focus ${completedDeep}/${deepFocusTasks.length}, Health items ${completedHealth}/${healthItems.length}. You're doing great! 🚀`,
        action: 'status_check'
      };
    }

    // Default response
    return { response: "I'm here to help you manage your Life Lock day! You can ask me to complete tasks, check off routines, log work hours, or get your daily status. What would you like me to help with?" };
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

    setChatMessages(prev => [...prev, userMessage]);

    try {
      // Process the voice command
      const { response, action } = processVoiceCommand(message);

      // Create AI response message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
        action: action as any
      };

      setChatMessages(prev => [...prev, aiMessage]);

      // Auto-speak AI response if voice is enabled
      if (voiceEnabled && voiceService.isTTSSupported()) {
        await speakMessage(response);
      }

    } catch (error) {
      console.error('Voice Agent Error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        sender: 'assistant',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, errorMessage]);
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

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#252525' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Life Lock Voice Agent</h3>
        </div>
        
        {/* Voice Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`${
              voiceEnabled 
                ? 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30' 
                : 'bg-gray-600/20 text-gray-400 border-gray-600/30 hover:bg-gray-600/30'
            }`}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4 mr-1" /> : <VolumeX className="h-4 w-4 mr-1" />}
            {voiceEnabled ? 'Voice On' : 'Voice Off'}
          </Button>
          
          {/* Speaking indicator */}
          {isSpeaking && (
            <Button
              variant="outline"
              size="sm"
              onClick={stopSpeaking}
              className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30"
            >
              <span className="animate-pulse mr-1">🔊</span>
              Stop
            </Button>
          )}

          {/* Listening indicator */}
          {isListening && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg text-xs">
              <Mic className="h-3 w-3 animate-pulse" />
              <span>Listening...</span>
            </div>
          )}
        </div>
      </div>

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
                <div className="w-16 h-16 border-2 border-yellow-500/30 rounded-2xl flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-sm shadow-lg">
                  <Brain className="w-8 h-8 text-yellow-400" />
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-2xl text-white mb-4 font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Life Lock Voice Assistant
              </motion.h2>
              
              <motion.p 
                className="text-gray-300 mb-6 max-w-md leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Speak or type commands to manage your daily routine, tasks, and progress. I can check off items, update tasks, and track your productivity.
              </motion.p>
              
              <motion.div 
                className="space-y-2 text-sm text-gray-400 max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p>Try saying:</p>
                <ul className="text-left space-y-1">
                  <li>• "Complete all morning routine"</li>
                  <li>• "Delete all deep focus tasks"</li>
                  <li>• "Mark workout as done"</li>
                  <li>• "Log 4 hours deep focus work"</li>
                  <li>• "What's my progress?"</li>
                </ul>
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
                          <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-yellow-500/30 shadow-lg">
                            <img 
                              src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
                              alt="SISO" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/30 to-yellow-600/20 border border-yellow-500/30 flex items-center justify-center backdrop-blur-sm shadow-lg">
                            <Brain className="w-5 h-5 text-yellow-400" />
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
                                ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-yellow-500/20' 
                                : 'bg-gray-800/80 text-gray-100 border border-gray-700/50 shadow-gray-900/20'
                            }`}>
                              <div className="flex items-start gap-3">
                                {message.sender === 'assistant' && (
                                  <Brain className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
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
              
              {/* Loading Indicator */}
              {isLoading && (
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-end gap-3 max-w-[85%]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/30 to-yellow-600/20 border border-yellow-500/30 flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <Brain className="w-5 h-5 text-yellow-400 animate-pulse" />
                    </div>
                    <div className="bg-gray-800/80 text-gray-100 p-4 rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-lg">
                      <div className="flex items-center gap-3">
                        <Brain className="w-4 h-4 text-yellow-400" />
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-300 font-medium">Processing</span>
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
      
      {/* Chat Input */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
        <PromptInputBox 
          onSend={(message, files) => handleSendMessage(message)} 
          placeholder="Speak or type commands to manage your Life Lock day..."
          isLoading={isLoading}
          className="bg-gray-800/90 border-gray-600/50 shadow-xl backdrop-blur-sm"
          onVoiceInput={handleVoiceInput}
        />
      </div>
    </div>
  );
};