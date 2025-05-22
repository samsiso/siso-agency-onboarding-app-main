import React from 'react';
import { ProjectPrompt } from '@/types/auto-prompts';

interface PromptCardProps {
  prompt: ProjectPrompt;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{prompt.page || 'No Page'}</p>
          <p className="text-sm text-gray-500">{prompt.domain || 'No Domain'}</p>
        </div>
        <span className="text-sm text-gray-500">
          Cycle #{prompt.prompt_cycle_number}
        </span>
      </div>
      
      <p className="mt-2 text-sm">{prompt.prompt}</p>
      
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <span>Used {prompt.times_used} times</span>
        <span>Last used: {new Date(prompt.last_used).toLocaleDateString()}</span>
      </div>
    </div>
  );
}; 