
import { User, Info } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { Video } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VideoMetadataProps {
  educator: Video['educator'];
  metrics: Video['metrics'];
}

export const VideoMetadata = ({ educator, metrics }: VideoMetadataProps) => {
  return (
    <TooltipProvider>
      <div className="space-y-2">
        {educator && (
          <div className="flex items-center gap-2">
            {educator.avatar_url ? (
              <img
                src={educator.avatar_url}
                alt={educator.name}
                className="w-8 h-8 rounded-full ring-2 ring-siso-border"
                loading="lazy"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-siso-bg flex items-center justify-center ring-2 ring-siso-border">
                <User className="w-4 h-4 text-siso-text/70" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-siso-text">{educator.name}</span>
              {educator.title && (
                <span className="text-xs text-siso-text/60">{educator.title}</span>
              )}
            </div>
          </div>
        )}

        {metrics && (
          <div className="flex items-center justify-between text-xs text-siso-text/60">
            <div className="flex items-center gap-2">
              {metrics.category && (
                <span className="px-2 py-0.5 rounded-full bg-siso-bg-alt text-siso-text/70">
                  {metrics.category}
                </span>
              )}
              {metrics.difficulty && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      <span>{metrics.difficulty}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Difficulty level: {metrics.difficulty}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
