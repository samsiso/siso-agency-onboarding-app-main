import React, { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye, FileIcon } from 'lucide-react';
import { Wireframe } from '@/hooks/useProjectWireframes';
import { useNavigate } from 'react-router-dom';

interface WireframeCardProps {
  wireframe: Wireframe;
  projectId: string;
  onClick?: () => void;
  isActive?: boolean;
}

export function WireframeCard({ wireframe, projectId, onClick, isActive = false }: WireframeCardProps) {
  const navigate = useNavigate();
  
  // Define status color logic as a memoized function
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-emerald-500 text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white';
      case 'approved':
        return 'bg-emerald-500 text-white';
      case 'in-review':
        return 'bg-amber-500 text-white';
      case 'pending':
      default:
        return 'bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  }, []);

  // Handle view click
  const handleViewClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${projectId}/wireframes/${wireframe.id}`);
  }, [navigate, projectId, wireframe.id]);

  // Handle external link click
  const handleExternalLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (wireframe.notionUiPlanLink) {
      window.open(wireframe.notionUiPlanLink, '_blank');
    }
  }, [wireframe.notionUiPlanLink]);

  // Get a background color based on the first letter of the title
  const getCardColor = () => {
    const colorOptions = [
      'bg-indigo-50 dark:bg-indigo-950/30',
      'bg-blue-50 dark:bg-blue-950/30',
      'bg-emerald-50 dark:bg-emerald-950/30',
      'bg-amber-50 dark:bg-amber-950/30',
      'bg-violet-50 dark:bg-violet-950/30',
      'bg-pink-50 dark:bg-pink-950/30',
      'bg-cyan-50 dark:bg-cyan-950/30',
      'bg-rose-50 dark:bg-rose-950/30'
    ];
    
    // Simple hash function based on the title
    const index = wireframe.title.charCodeAt(0) % colorOptions.length;
    return colorOptions[index];
  };

  return (
    <Card 
      className={`transition-all hover:shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${
        isActive ? 'ring-2 ring-indigo-500 shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <div className={`h-3 w-full rounded-t-lg ${getCardColor()} border-b border-slate-200 dark:border-slate-700`}></div>
      
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start mb-1">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white truncate flex-1">
            {wireframe.title}
          </CardTitle>
          <Badge className="capitalize bg-indigo-500 hover:bg-indigo-600 ml-2 shrink-0">
            {wireframe.category}
          </Badge>
        </div>
        <CardDescription className="line-clamp-3 text-slate-600 dark:text-slate-300 text-sm">
          {wireframe.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline" className={`capitalize ${getStatusColor(wireframe.wireframeStatus)}`}>
            Design: {wireframe.wireframeStatus}
          </Badge>
          <Badge variant="outline" className={`capitalize ${getStatusColor(wireframe.specsStatus)}`}>
            Specs: {wireframe.specsStatus}
          </Badge>
          <Badge variant="outline" className={`capitalize ${getStatusColor(wireframe.devStatus)}`}>
            Dev: {wireframe.devStatus}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        {wireframe.notionUiPlanLink ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-indigo-500 hover:text-indigo-600 border-indigo-200 hover:border-indigo-300 dark:border-indigo-800 dark:hover:border-indigo-700 dark:text-indigo-400" 
            onClick={handleExternalLinkClick}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Notion
          </Button>
        ) : (
          <div></div> // Empty div to maintain flex spacing when no Notion link
        )}
        <Button 
          variant="default" 
          size="sm" 
          className="bg-indigo-500 hover:bg-indigo-600 text-white" 
          onClick={handleViewClick}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      </CardFooter>
    </Card>
  );
} 