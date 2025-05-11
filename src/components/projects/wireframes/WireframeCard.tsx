import React, { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye, FileImage } from 'lucide-react';
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

  return (
    <Card 
      className={`transition-all hover:shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${
        isActive ? 'ring-2 ring-indigo-500 shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden h-48 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        {wireframe.imageUrl ? (
          <img 
            src={wireframe.imageUrl}
            alt={wireframe.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              (e.currentTarget.parentNode as HTMLElement).classList.add('fallback-active');
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <FileImage className="h-12 w-12 mb-2" />
            <span className="text-sm font-medium">{wireframe.title}</span>
          </div>
        )}
        
        <Badge className="absolute top-2 right-2 capitalize bg-indigo-500 hover:bg-indigo-600">{wireframe.category}</Badge>
      </div>
      
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white truncate">{wireframe.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-slate-600 dark:text-slate-300 text-sm">{wireframe.description}</CardDescription>
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