import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Search, 
  Trash2,
  Check,
  Clock,
  FileText,
  FilePlus,
  Archive
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { autoPromptsService } from '@/utils/auto-prompts-service';
import { AutoPrompt } from '@/types/auto-prompts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptListProps {
  projectName: string;
}

export const PromptList = ({ projectName }: PromptListProps) => {
  const [prompts, setPrompts] = useState<AutoPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPrompts = async () => {
      if (!projectName) {
        setError('Invalid project name');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const promptsData = await autoPromptsService.getByProject(projectName);
        setPrompts(promptsData);
        setError(null);
      } catch (err) {
        console.error(`Error fetching prompts for project ${projectName}:`, err);
        setError('Failed to load prompts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrompts();
  }, [projectName]);
  
  const handleBackToProjects = () => {
    navigate('/admin/prompt-agent');
  };
  
  const handleCreatePrompt = () => {
    navigate(`/admin/prompt-agent/${encodeURIComponent(projectName)}/new`);
  };
  
  const handleEditPrompt = (promptId: string) => {
    navigate(`/admin/prompt-agent/${encodeURIComponent(projectName)}/${promptId}`);
  };
  
  const handleDeletePrompt = async (promptId: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        await autoPromptsService.delete(promptId);
        setPrompts(prompts.filter(prompt => prompt.id !== promptId));
        toast({
          title: 'Prompt deleted',
          description: 'The prompt has been successfully deleted.',
        });
      } catch (err) {
        console.error(`Error deleting prompt ${promptId}:`, err);
        toast({
          title: 'Error',
          description: 'Failed to delete prompt. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };
  
  const filteredPrompts = prompts.filter(prompt => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (prompt.prompt && prompt.prompt.toLowerCase().includes(searchLower)) ||
      (prompt.feature && prompt.feature.toLowerCase().includes(searchLower)) ||
      (prompt.module && prompt.module.toLowerCase().includes(searchLower)) ||
      (prompt.component && prompt.component.toLowerCase().includes(searchLower))
    );
  });
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'draft':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'archived':
        return <Archive className="h-4 w-4 text-gray-500" />;
      default:
        return <FilePlus className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
    let className = '';
    
    switch (status) {
      case 'completed':
        variant = 'default';
        className = 'bg-green-100 text-green-800 hover:bg-green-200';
        break;
      case 'in_progress':
        variant = 'secondary';
        className = 'bg-amber-100 text-amber-800 hover:bg-amber-200';
        break;
      case 'draft':
        variant = 'outline';
        className = 'bg-blue-100 text-blue-800 hover:bg-blue-200';
        break;
      case 'archived':
        variant = 'outline';
        className = 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        break;
    }
    
    return (
      <Badge variant={variant} className={className}>
        <span className="flex items-center">
          {getStatusIcon(status)}
          <span className="ml-1 capitalize">{status.replace('_', ' ')}</span>
        </span>
      </Badge>
    );
  };
  
  const getPriorityBadge = (priority: string) => {
    let className = '';
    
    switch (priority) {
      case 'critical':
        className = 'bg-red-100 text-red-800 hover:bg-red-200';
        break;
      case 'high':
        className = 'bg-orange-100 text-orange-800 hover:bg-orange-200';
        break;
      case 'medium':
        className = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
        break;
      case 'low':
        className = 'bg-green-100 text-green-800 hover:bg-green-200';
        break;
    }
    
    return (
      <Badge variant="outline" className={className}>
        <span className="capitalize">{priority}</span>
      </Badge>
    );
  };
  
  if (loading) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4"
            onClick={handleBackToProjects}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4"
            onClick={handleBackToProjects}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">{projectName || 'Unknown Project'} Prompts</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-4"
          onClick={handleBackToProjects}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">{projectName || 'All Prompts'}</h2>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>AI Prompts</CardTitle>
              <CardDescription>
                Manage AI prompts for {projectName || 'this project'}
              </CardDescription>
            </div>
            <Button onClick={handleCreatePrompt}>
              <Plus className="h-4 w-4 mr-2" />
              New Prompt
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? (
                <p>No prompts found matching "{searchTerm}"</p>
              ) : (
                <div>
                  <p className="mb-4">No prompts available for this project</p>
                  <Button onClick={handleCreatePrompt}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Prompt
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Step</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrompts.map((prompt) => (
                    <TableRow key={prompt.id}>
                      <TableCell className="font-medium">{prompt.feature}</TableCell>
                      <TableCell>{prompt.module}</TableCell>
                      <TableCell>{prompt.component || '-'}</TableCell>
                      <TableCell>{prompt.step || '-'}</TableCell>
                      <TableCell>{getStatusBadge(prompt.status)}</TableCell>
                      <TableCell>{getPriorityBadge(prompt.priority)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditPrompt(prompt.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeletePrompt(prompt.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 