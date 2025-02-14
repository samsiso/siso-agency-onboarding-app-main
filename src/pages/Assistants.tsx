
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Bot } from 'lucide-react';

export default function Assistants() {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-siso-orange" />
            <h1 className="text-4xl font-bold text-siso-text-bold">AI Assistants</h1>
          </div>
          <div className="text-siso-text">
            Content coming soon...
          </div>
        </div>
      </div>
    </div>
  );
}
