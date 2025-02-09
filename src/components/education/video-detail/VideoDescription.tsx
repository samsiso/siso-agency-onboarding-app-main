
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoDescriptionProps {
  description: string;
  tags?: string[];
}

export const VideoDescription = ({ description, tags }: VideoDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDescription = (text: string) => {
    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const withLinks = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-siso-red hover:underline">$1</a>');
    
    // Convert timestamps to clickable links
    const timestampRegex = /(\d{1,2}:)?(\d{1,2}:\d{2})/g;
    const withTimestamps = withLinks.replace(timestampRegex, '<span class="text-siso-red cursor-pointer hover:underline">$&</span>');

    return withTimestamps;
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">Description</h3>
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-4">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
            >
              <Hash className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <AnimatePresence initial={false}>
        <motion.div
          className={`relative ${!isExpanded ? 'max-h-24' : 'max-h-none'} overflow-hidden`}
          initial={false}
          animate={{ height: isExpanded ? 'auto' : '6rem' }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="text-gray-300 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ 
              __html: formatDescription(description) 
            }}
          />
          
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900/90 to-transparent" />
          )}
        </motion.div>
      </AnimatePresence>
      
      <Button
        variant="ghost"
        className="w-full mt-2 text-gray-400 hover:text-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 mr-2" />
        ) : (
          <ChevronDown className="w-4 h-4 mr-2" />
        )}
        {isExpanded ? 'Show Less' : 'Show More'}
      </Button>
    </div>
  );
};

