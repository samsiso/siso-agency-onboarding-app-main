
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
        <div className="h-40 w-40 rounded-full bg-gradient-to-br from-[#ea384c] to-[#ff1a1a] flex items-center justify-center ring-4 ring-[#ea384c]/20 animate-pulse">
          <img 
            src="/public/lovable-uploads/ubahcrypt-logo.png" 
            alt="UbahCrypt Logo"
            className="w-24 h-24 object-contain"
          />
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
              className="text-base px-4 py-1.5 bg-[#ea384c]/20 text-[#ea384c] border border-[#ea384c]/20 uppercase tracking-wide"
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
      
      <div className="absolute inset-0 bg-gradient-to-tr from-[#ea384c]/5 via-transparent to-red-500/5" />
    </div>
  );
}
