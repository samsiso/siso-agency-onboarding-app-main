
import { User, Eye } from 'lucide-react';
import { formatNumber } from '@/lib/formatters';
import { Video } from '../types';

interface VideoMetadataProps {
  educator: Video['educator'];
  metrics: Video['metrics'];
}

export const VideoMetadata = ({ educator, metrics }: VideoMetadataProps) => {
  return (
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
        <div className="flex items-center gap-4 text-xs text-siso-text/60">
          {metrics.views !== undefined && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{formatNumber(metrics.views)} views</span>
            </div>
          )}
          {metrics.category && (
            <span className="px-2 py-0.5 rounded-full bg-siso-bg-alt text-siso-text/70">
              {metrics.category}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
