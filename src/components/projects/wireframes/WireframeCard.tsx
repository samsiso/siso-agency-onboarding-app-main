import React from 'react';
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
  
  const getStatusColor = (status: string) => {
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
  };

  return (
    <Card 
      className={`transition-all hover:shadow-md ${isActive ? 'ring-2 ring-blue-500 shadow-md' : ''}`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden h-48">
        <img 
          src={wireframe.imageUrl || `https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=${encodeURIComponent(wireframe.title)}`} 
          alt={wireframe.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <Badge className="absolute top-2 right-2 capitalize">{wireframe.category}</Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{wireframe.title}</CardTitle>
        <CardDescription className="line-clamp-2">{wireframe.description}</CardDescription>
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
          <Button variant="outline" size="sm" onClick={() => window.open(wireframe.notionUiPlanLink, '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Notion
          </Button>
        )}
        <Button variant="default" size="sm" onClick={(e) => {
          e.stopPropagation();
          navigate(`/projects/${projectId}/wireframes/${wireframe.id}`);
        }}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      </CardFooter>
    </Card>
  );
} 