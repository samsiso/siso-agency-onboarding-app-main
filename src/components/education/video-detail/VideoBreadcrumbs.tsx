
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VideoBreadcrumbsProps {
  title: string;
}

export const VideoBreadcrumbs = ({ title }: VideoBreadcrumbsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-4 text-gray-400">
      <Button 
        variant="ghost" 
        size="sm" 
        className="hover:bg-white/10"
        onClick={() => navigate('/education')}
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Back to Videos
      </Button>
      <div className="flex items-center gap-2">
        <span>Education</span>
        <ChevronLeft className="w-4 h-4" />
        <span>Videos</span>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-white truncate max-w-[300px]">{title || 'Loading...'}</span>
      </div>
    </div>
  );
};
