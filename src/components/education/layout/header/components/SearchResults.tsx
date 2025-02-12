
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, PlayCircle, UserCircle, History, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface SearchResult {
  id: string;
  type: 'video' | 'educator';
  title: string;
  thumbnailUrl?: string;
  description?: string;
  slug?: string;
  channel_avatar_url?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  onResultClick: (result: SearchResult) => void;
}

export const SearchResults = ({ results, isLoading, onResultClick }: SearchResultsProps) => {
  const navigate = useNavigate();

  const handleResultClick = (result: SearchResult) => {
    // [Analysis] Navigate based on result type
    if (result.type === 'video') {
      navigate(`/education/video/${result.id}`);
    } else {
      navigate(`/education/educators/${result.slug}`);
    }
    onResultClick(result);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 bg-siso-bg-alt rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-siso-bg-alt rounded w-3/4" />
              <div className="h-3 bg-siso-bg-alt rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const videos = results.filter(r => r.type === 'video');
  const educators = results.filter(r => r.type === 'educator');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="divide-y divide-white/10"
    >
      {/* Videos Section */}
      {videos.length > 0 && (
        <div className="p-4">
          <h3 className="text-sm font-medium text-siso-text/70 mb-3 flex items-center gap-2">
            <Video className="w-4 h-4" />
            Videos
          </h3>
          <div className="space-y-2">
            {videos.map((result) => (
              <motion.div
                key={result.id}
                variants={itemVariants}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                onClick={() => handleResultClick(result)}
              >
                <div className="relative w-20 h-12 rounded-md overflow-hidden bg-siso-bg-alt">
                  {result.thumbnailUrl && (
                    <img 
                      src={result.thumbnailUrl} 
                      alt={result.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <PlayCircle className="w-6 h-6 text-white/80" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-siso-text truncate">
                    {result.title}
                  </div>
                  {result.description && (
                    <div className="text-xs text-siso-text/60 truncate">
                      {result.description}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-siso-text/40" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Educators Section */}
      {educators.length > 0 && (
        <div className="p-4">
          <h3 className="text-sm font-medium text-siso-text/70 mb-3 flex items-center gap-2">
            <UserCircle className="w-4 h-4" />
            Educators
          </h3>
          <div className="space-y-2">
            {educators.map((result) => (
              <motion.div
                key={result.id}
                variants={itemVariants}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                onClick={() => handleResultClick(result)}
              >
                <Avatar className="w-10 h-10">
                  {result.channel_avatar_url ? (
                    <AvatarImage src={result.channel_avatar_url} alt={result.title} />
                  ) : null}
                  <AvatarFallback>
                    {result.title[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-siso-text truncate">
                    {result.title}
                  </div>
                  {result.description && (
                    <div className="text-xs text-siso-text/60 truncate">
                      {result.description}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-siso-text/40" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-sm text-siso-text/60">No results found</p>
        </div>
      )}
    </motion.div>
  );
};
