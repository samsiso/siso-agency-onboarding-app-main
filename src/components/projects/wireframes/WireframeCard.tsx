import React, { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye } from 'lucide-react';
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
        return 'bg-green-500 text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white';
      case 'approved':
        return 'bg-green-500 text-white';
      case 'in-review':
        return 'bg-yellow-500 text-white';
      case 'pending':
      default:
        return 'bg-gray-300 text-gray-700';
    }
  }, []);

  // Handle image errors
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback if image fails to load
    e.currentTarget.src = `https://via.placeholder.com/300x200/6366F1/FFFFFF?text=${encodeURIComponent(wireframe.title)}`;
  }, [wireframe.title]);

  // Handle external link click
  const handleExternalLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (wireframe.notionUiPlanLink) {
      window.open(wireframe.notionUiPlanLink, '_blank');
    }
  }, [wireframe.notionUiPlanLink]);

  // Handle view click
  const handleViewClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${projectId}/wireframes/${wireframe.id}`);
  }, [navigate, projectId, wireframe.id]);

  // Enforce color for placeholder images
  const imageUrl = wireframe.imageUrl || `https://via.placeholder.com/300x200/6366F1/FFFFFF?text=${encodeURIComponent(wireframe.title)}`;

  return (
    <Card 
      className={`transition-all hover:shadow-md border border-gray-700 dark:border-gray-700 bg-white dark:bg-gray-800 ${
        isActive ? 'ring-2 ring-blue-500 shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden h-48 bg-gray-50 dark:bg-gray-900">
        <img 
          src={imageUrl}
          alt={wireframe.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          onError={handleImageError}
        />
        <Badge className="absolute top-2 right-2 capitalize">{wireframe.category}</Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-900 dark:text-white">{wireframe.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-300">{wireframe.description}</CardDescription>
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
        {wireframe.notionUiPlanLink && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-indigo-500 hover:text-indigo-600 border-indigo-200 hover:border-indigo-300 dark:border-indigo-900 dark:hover:border-indigo-800 dark:text-indigo-400" 
            onClick={handleExternalLinkClick}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Notion
          </Button>
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