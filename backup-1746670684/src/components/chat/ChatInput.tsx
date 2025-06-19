import React, { useState } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const ChatInput = ({ onSubmit, isLoading, placeholder = "Type your message..." }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="border-t border-siso-text/10 bg-black/20 backdrop-blur-sm p-4 rounded-b-lg"
    >
      <div className="flex gap-3">
        <div className="relative flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[52px] w-full resize-none rounded-lg bg-black/20 border border-siso-text/10 px-4 py-3 text-white placeholder:text-siso-text/50 focus:outline-none focus:ring-2 focus:ring-siso-red/50 transition-all pr-12 shadow-lg"
            disabled={isLoading}
            rows={1}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-siso-text/50 hover:text-siso-text transition-colors"
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? (
              <MicOff className="h-5 w-5 text-siso-red" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
        </div>
        <Button 
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-siso-red to-siso-orange text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all min-h-[52px] w-[52px] shadow-lg"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </motion.form>
  );
};