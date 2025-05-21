import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Layers,
  Edit,
  Trash2
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { PromptStretch } from '@/types/auto-prompts';
import { promptStretchesService } from '@/utils/prompt-stretches-service';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface StretchListProps {
  projectName: string;
  pageNumber: number;
  onStretchClick: (stretchId: string) => void;
}

export const StretchList: React.FC<StretchListProps> = ({
  projectName,
  pageNumber,
  onStretchClick
}) => {
  const [stretches, setStretches] = useState<PromptStretch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchStretches = async () => {
      if (!projectName || !pageNumber) {
        setError('Invalid project name or page number');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const stretchesData = await promptStretchesService.getByProjectAndPage(
          projectName,
          pageNumber
        );
        setStretches(stretchesData);
        setError(null);
      } catch (err) {
        console.error(`Error fetching stretches for page ${pageNumber}:`, err);
        setError('Failed to load stretches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStretches();
  }, [projectName, pageNumber]);
  
  const handleCreateStretch = () => {
    // TODO: Implement create stretch functionality
    toast({
      title: 'Create Stretch',
      description: 'This feature is not implemented yet',
    });
  };
  
  const handleEditStretch = (stretchId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    // TODO: Implement edit stretch functionality
    toast({
      title: 'Edit Stretch',
      description: `Editing stretch ${stretchId}`,
    });
  };
  
  const handleDeleteStretch = async (stretchId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    if (window.confirm('Are you sure you want to delete this stretch?')) {
      try {
        await promptStretchesService.delete(stretchId);
        setStretches(stretches.filter(stretch => stretch.id !== stretchId));
        toast({
          title: 'Success',
          description: 'Stretch deleted successfully',
        });
      } catch (err) {
        console.error(`Error deleting stretch ${stretchId}:`, err);
        toast({
          title: 'Error',
          description: 'Failed to delete stretch',
          variant: 'destructive',
        });
      }
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case 'not_started':
      default:
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-800 hover:bg-slate-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Not Started
          </Badge>
        );
    }
  };
  
  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'completed':
        return 100;
      case 'in_progress':
        return 50;
      case 'not_started':
      default:
        return 0;
    }
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter className="pt-2 flex justify-between border-t">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p className="mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }
  
  if (stretches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg mb-4">No prompt stretches found for this page</p>
        <Button onClick={handleCreateStretch}>
          <Plus className="h-4 w-4 mr-2" />
          Create First Stretch
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">
          Page {pageNumber} Stretches ({stretches.length})
        </h3>
        <Button onClick={handleCreateStretch}>
          <Plus className="h-4 w-4 mr-2" />
          Add Stretch
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stretches.map((stretch) => (
          <Card 
            key={stretch.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onStretchClick(stretch.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{stretch.title}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                        <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => handleEditStretch(stretch.id, e)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => handleDeleteStretch(stretch.id, e)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{stretch.description || 'No description'}</CardDescription>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="mb-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Progress value={getStatusProgress(stretch.status)} className="h-2" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Status: {stretch.status.replace('_', ' ')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Layers className="h-4 w-4 mr-1" />
                <span>{stretch.prompts_count || 0} Prompts</span>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 flex justify-between items-center border-t">
              {getStatusBadge(stretch.status)}
              <Button variant="ghost" size="sm" className="gap-1">
                View <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}; 