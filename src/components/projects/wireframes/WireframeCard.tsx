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
        return 'bg-slate-300 text-slate-800 dark:bg-slate-600 dark:text-slate-100';
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
      {
        header: 'bg-indigo-500 dark:bg-indigo-600',
        bg: 'bg-indigo-50 dark:bg-indigo-900/40',
        border: 'border-indigo-100 dark:border-indigo-800'
      },
      {
        header: 'bg-blue-500 dark:bg-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/40',
        border: 'border-blue-100 dark:border-blue-800'
      },
      {
        header: 'bg-emerald-500 dark:bg-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-900/40',
        border: 'border-emerald-100 dark:border-emerald-800'
      },
      {
        header: 'bg-amber-500 dark:bg-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-900/40',
        border: 'border-amber-100 dark:border-amber-800'
      },
      {
        header: 'bg-violet-500 dark:bg-violet-600',
        bg: 'bg-violet-50 dark:bg-violet-900/40',
        border: 'border-violet-100 dark:border-violet-800'
      },
      {
        header: 'bg-pink-500 dark:bg-pink-600',
        bg: 'bg-pink-50 dark:bg-pink-900/40',
        border: 'border-pink-100 dark:border-pink-800'
      },
      {
        header: 'bg-cyan-500 dark:bg-cyan-600',
        bg: 'bg-cyan-50 dark:bg-cyan-900/40',
        border: 'border-cyan-100 dark:border-cyan-800'
      }
    ];
    
    // Simple hash function based on the title
    const index = wireframe.title.charCodeAt(0) % colorOptions.length;
    return colorOptions[index];
  };

  const colorSet = getCardColor();

  return (
    <Card 
      className={`transition-all hover:shadow-lg overflow-hidden 
        border ${colorSet.border} bg-white dark:bg-slate-800 h-full
        ${isActive ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 shadow-md' : ''}
      `}
      onClick={onClick}
    >
      <div className={`h-6 w-full ${colorSet.header} relative`}>
        <Badge className="absolute right-2 top-1 text-xs capitalize bg-white text-slate-900 dark:bg-slate-800 dark:text-white border-0">
          {wireframe.category}
        </Badge>
      </div>
      
      <CardHeader className={`pb-2 pt-4 ${colorSet.bg}`}>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white truncate">
          {wireframe.title}
        </CardTitle>
        <CardDescription className="line-clamp-3 text-slate-600 dark:text-slate-300 text-sm">
          {wireframe.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 space-y-3">
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
      
      <CardFooter className="flex justify-between pt-2 mt-auto">
        {wireframe.notionUiPlanLink ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-indigo-500 hover:text-indigo-600 border-indigo-200 hover:border-indigo-300 dark:border-indigo-700 dark:hover:border-indigo-600 dark:text-indigo-400" 
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