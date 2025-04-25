
import { Bitcoin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/formatters';

interface ProjectHeaderProps {
  name: string;
  description?: string;
  status?: string;
  created_at?: string;
}

export function ProjectHeader({ name, description, status, created_at }: ProjectHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-black/30 border border-white/10 p-8 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
        <div className="h-40 w-40 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#6E59A5] flex items-center justify-center ring-4 ring-[#9b87f5]/20 animate-pulse">
          <Bitcoin size={64} className="text-white" />
        </div>
        
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-4 flex-col md:flex-row gap-4 md:gap-0">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent mb-2">
                {name}
              </h1>
              <p className="text-neutral-400">
                Created on {formatDate(created_at || '', 'long')}
              </p>
            </div>
            <Badge 
              variant="secondary" 
              className="text-base px-4 py-1.5 bg-[#9b87f5]/20 text-[#9b87f5] border border-[#9b87f5]/20 uppercase tracking-wide"
            >
              {status}
            </Badge>
          </div>
          
          {description && (
            <p className="text-neutral-300 text-lg leading-relaxed max-w-3xl mb-6">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/5" />
    </div>
  );
}

