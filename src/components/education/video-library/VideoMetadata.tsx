
import { User, Eye } from 'lucide-react';
import { formatNumber } from '@/lib/formatters';
import { Video } from '../types';

interface VideoMetadataProps {
  educator: Video['educator'];
  metrics: Video['metrics'];
}

export const VideoMetadata = ({ educator, metrics }: VideoMetadataProps) => {
  return (
    <>
      {educator && (
        <div className="flex items-center gap-2">
          {educator.avatar_url ? (
            <img
              src={educator.avatar_url}
              alt={educator.name}
              className="w-6 h-6 rounded-full"
              loading="lazy"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-siso-bg flex items-center justify-center">
              <User className="w-3 h-3 text-siso-text/70" />
            </div>
          )}
          <span className="text-sm text-siso-text/70">{educator.name}</span>
        </div>
      )}

      {metrics && (
        <div className="flex items-center gap-4 text-xs text-siso-text/60">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {formatNumber(metrics.views)} views
          </div>
          {metrics.difficulty && (
            <span className="capitalize px-2 py-0.5 rounded-full bg-siso-bg-alt text-siso-text/70">
              {metrics.difficulty}
            </span>
          )}
        </div>
      )}
    </>
  );
};
