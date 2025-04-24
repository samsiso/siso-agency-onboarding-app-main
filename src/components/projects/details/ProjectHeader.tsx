
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
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="h-40 w-40 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#6E59A5] flex items-center justify-center ring-4 ring-[#9b87f5]/20">
        <Bitcoin size={64} className="text-white" />
      </div>
      
      <div className="flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{name}</h1>
            <p className="text-siso-text">
              Created on {formatDate(created_at || '', 'long')}
            </p>
          </div>
          <Badge 
            variant="secondary" 
            className="text-base px-4 py-1 bg-[#9b87f5]/20 text-[#9b87f5]"
          >
            {status}
          </Badge>
        </div>
        
        {description && (
          <p className="text-siso-text text-lg leading-relaxed max-w-3xl mb-6">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
