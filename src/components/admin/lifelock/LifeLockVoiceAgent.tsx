import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { voiceService } from '@/services/voiceService';
import { motion, AnimatePresence } from 'framer-motion';

interface LifeLockVoiceAgentProps {
  onVoiceCommand?: (command: string) => void;
  className?: string;
}

export const LifeLockVoiceAgent: React.FC<LifeLockVoiceAgentProps> = ({
  onVoiceCommand,
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  console.log('🤖 [LIFELOCK VOICE] LifeLockVoiceAgent component initialized');

  const handleVoiceToggle = async () => {
    if (isListening) {
      console.log('🛑 [LIFELOCK VOICE] Stopping voice listening...');
      voiceService.stopListening();
      setIsListening(false);
      setTranscript('');
    } else {
      console.log('🎤 [LIFELOCK VOICE] Starting voice listening...');
      setError(null);
      
      try {
        await voiceService.startListening(
          (transcript, isFinal) => {
            console.log('📝 [LIFELOCK VOICE] Transcript update:', { transcript, isFinal });
            setTranscript(transcript);
            
            if (isFinal && transcript.trim()) {
              console.log('✅ [LIFELOCK VOICE] Final transcript received:', transcript);
              handleVoiceCommand(transcript);
              setTranscript('');
              setIsListening(false);
            }
          },
          (errorMsg) => {
            console.error('❌ [LIFELOCK VOICE] Voice error:', errorMsg);
            setError(errorMsg);
            setIsListening(false);
            setTranscript('');
          },
          {
            language: 'en-US',
            continuous: false,
            interimResults: true
          }
        );
        
        setIsListening(true);
        console.log('🎯 [LIFELOCK VOICE] Voice listening started successfully');
        
      } catch (error) {
        console.error('❌ [LIFELOCK VOICE] Failed to start voice listening:', error);
        setError(error instanceof Error ? error.message : 'Voice recognition failed');
      }
    }
  };

  const handleVoiceCommand = async (command: string) => {
    console.log('🧠 [LIFELOCK VOICE] Processing voice command:', command);
    console.log('🔍 [LIFELOCK VOICE] Command analysis:', {
      length: command.length,
      wordCount: command.split(' ').length,
      isTaskCommand: command.toLowerCase().includes('task') || command.toLowerCase().includes('add'),
      isStatusQuery: command.toLowerCase().includes('status') || command.toLowerCase().includes('show'),
      isNavigationCommand: command.toLowerCase().includes('go to') || command.toLowerCase().includes('open'),
      containsKeywords: {
        morning: command.toLowerCase().includes('morning'),
        workout: command.toLowerCase().includes('workout'),
        health: command.toLowerCase().includes('health'),
        meal: command.toLowerCase().includes('meal') || command.toLowerCase().includes('food')
      }
    });

    // Process the command and provide voice feedback
    let response = '';
    
    if (command.toLowerCase().includes('morning')) {
      response = 'I can help you with your morning routine. Would you like to check off items or add new ones?';
    } else if (command.toLowerCase().includes('workout')) {
      response = 'Let me help you track your workout progress. What exercise would you like to log?';
    } else if (command.toLowerCase().includes('task')) {
      response = 'I can help you manage your tasks. What would you like to add or update?';
    } else if (command.toLowerCase().includes('status')) {
      response = 'Here\'s your current status. You have several items to complete today.';
    } else {
      response = `I heard you say "${command}". How can I help you with that?`;
    }

    console.log('💬 [LIFELOCK VOICE] Generated response:', response);

    // REMOVED: Automatic voice response per user preference  
    console.log('🔇 [LIFELOCK VOICE] Auto-voice response DISABLED - Voice input only mode');
    console.log('💬 [LIFELOCK VOICE] Response generated for visual display only');
    
    /* REMOVED AUTO-TTS RESPONSE
    // Speak the response
    if (voiceService.isTTSSupported()) {
      console.log('🔊 [LIFELOCK VOICE] Speaking response...');
      setIsSpeaking(true);
      
      try {
        await voiceService.speak(
          response,
          { voice: 'Fritz-PlayAI' },
          () => {
            console.log('▶️ [LIFELOCK VOICE] Started speaking response');
          },
          () => {
            console.log('🏁 [LIFELOCK VOICE] Finished speaking response');
            setIsSpeaking(false);
          },
          (error) => {
            console.error('❌ [LIFELOCK VOICE] TTS error:', error);
            setIsSpeaking(false);
          }
        );
      } catch (error) {
        console.error('❌ [LIFELOCK VOICE] Failed to speak response:', error);
        setIsSpeaking(false);
      }
    }
    */

    // Call the parent callback
    if (onVoiceCommand) {
      console.log('📞 [LIFELOCK VOICE] Calling parent callback with command');
      onVoiceCommand(command);
    }
  };

  const clearError = () => {
    console.log('🧹 [LIFELOCK VOICE] Clearing error');
    setError(null);
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {/* Voice Agent Button */}
      <Button
        onClick={handleVoiceToggle}
        className={`relative w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
          isListening 
            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        disabled={isSpeaking}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={isListening ? 'listening' : 'idle'}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            {isListening ? (
              <MicOff className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Speaking indicator */}
        {isSpeaking && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Volume2 className="h-3 w-3 text-white m-0.5" />
          </motion.div>
        )}
      </Button>

      {/* Status Text */}
      <div className="text-center min-h-[2rem]">
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm font-medium"
          >
            🎤 Listening...
          </motion.div>
        )}
        
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-400 text-sm font-medium"
          >
            🔊 Speaking...
          </motion.div>
        )}
        
        {!isListening && !isSpeaking && (
          <div className="text-gray-400 text-sm">
            Voice Agent Ready
          </div>
        )}
      </div>

      {/* Live Transcript */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 max-w-xs"
        >
          <div className="text-yellow-300 text-xs font-medium mb-1">Listening:</div>
          <div className="text-white text-sm">{transcript}</div>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 max-w-xs"
        >
          <div className="flex items-center justify-between">
            <div className="text-red-400 text-sm">⚠️ {error}</div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-300 ml-2"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <div className="text-gray-500 text-xs text-center max-w-xs">
        Try: "Add morning task", "Show workout status", "Help with meals"
      </div>
    </div>
  );
}; 