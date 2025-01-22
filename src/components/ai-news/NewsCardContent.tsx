import { Calendar } from 'lucide-react';

interface NewsCardContentProps {
  title: string;
  description: string;
  date: string;
  source: string;
  impact: string;
}

export const NewsCardContent = ({ 
  title, 
  description, 
  date, 
  source, 
  impact 
}: NewsCardContentProps) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-siso-text-bold hover:text-siso-red transition-colors line-clamp-2">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-siso-text/80 line-clamp-2">
          {description}
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-siso-text/60">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          {new Date(date).toLocaleDateString()}
        </span>
        <span>{source}</span>
        <span className="bg-siso-red/10 text-siso-red px-2 py-1 rounded text-xs">
          {impact} Impact
        </span>
      </div>
    </div>
  );
};