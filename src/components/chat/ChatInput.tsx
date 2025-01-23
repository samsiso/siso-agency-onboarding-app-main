import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/button';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSubmit, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-siso-text/10 p-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-black/20 border border-siso-text/10 rounded-lg px-4 py-3 text-siso-text placeholder:text-siso-text/50 focus:outline-none focus:ring-2 focus:ring-siso-red/50 transition-all"
          disabled={isLoading}
        />
        <Button 
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-siso-red to-siso-orange text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </form>
  );
};