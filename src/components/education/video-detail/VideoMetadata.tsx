
import { Eye, Calendar } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

interface VideoMetadataProps {
  title: string;
  viewCount: number;
  publishDate: string | null;
}

export const VideoMetadata = ({ title, viewCount, publishDate }: VideoMetadataProps) => {
  // [Analysis] Handle both ISO dates and relative date strings
  const formatDate = (dateStr: string) => {
    try {
      const parsedDate = parseISO(dateStr);
      return isValid(parsedDate) ? format(parsedDate, 'MMM d, yyyy') : dateStr;
    } catch {
      // If parsing fails, return the original string (e.g., "9 days ago")
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
        {title}
      </h1>
      
      <div className="flex items-center gap-6 text-sm text-gray-400 border-t border-b border-gray-800 py-4">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>{viewCount.toLocaleString()} views</span>
        </div>
        {publishDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(publishDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
