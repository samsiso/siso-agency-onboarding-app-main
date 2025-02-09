
import { Eye, Calendar, ThumbsUp, MessageCircle } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

interface VideoMetadataProps {
  title: string;
  viewCount: number;
  publishDate: string | null;
  likesCount?: number;
  commentCount?: number;
}

export const VideoMetadata = ({ 
  title, 
  viewCount, 
  publishDate,
  likesCount,
  commentCount 
}: VideoMetadataProps) => {
  const formatDate = (dateStr: string) => {
    try {
      const parsedDate = parseISO(dateStr);
      return isValid(parsedDate) ? format(parsedDate, 'MMM d, yyyy') : dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
        {title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
          <Eye className="h-4 w-4" />
          <span>{viewCount.toLocaleString()} views</span>
        </div>

        {likesCount !== undefined && (
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
            <ThumbsUp className="h-4 w-4" />
            <span>{likesCount.toLocaleString()} likes</span>
          </div>
        )}

        {commentCount !== undefined && (
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
            <MessageCircle className="h-4 w-4" />
            <span>{commentCount.toLocaleString()} comments</span>
          </div>
        )}

        {publishDate && (
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(publishDate)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

