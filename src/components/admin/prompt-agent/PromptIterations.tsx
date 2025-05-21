import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2,
  ChevronRight,
  Copy,
  LayoutList,
  History,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AutoPrompt, PromptStretch } from '@/types/auto-prompts';
import { promptStretchesService } from '@/utils/prompt-stretches-service';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PromptIterationsProps {
  projectName: string;
  stretchId: string;
  onBack: () => void;
}

export const PromptIterations: React.FC<PromptIterationsProps> = ({
  projectName,
  stretchId,
  onBack
}) => {
  const [stretch, setStretch] = useState<PromptStretch | null>(null);
  const [prompts, setPrompts] = useState<AutoPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchStretchAndPrompts = async () => {
      if (!stretchId) {
        setError('Invalid stretch ID');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Get all stretches for the project
        const stretches = await promptStretchesService.getByProject(projectName);
        const currentStretch = stretches.find(s => s.id === stretchId);
        setStretch(currentStretch || null);
        
        if (!currentStretch) {
          setError('Stretch not found');
          setLoading(false);
          return;
        }
        
        // Get prompts for the stretch
        const promptsData = await promptStretchesService.getPromptsByStretch(stretchId);
        
        // Group prompts by their feature field for easier navigation
        const sortedPrompts = [...promptsData].sort((a, b) => {
          // Sort by iteration first
          if ((a.iteration || 1) !== (b.iteration || 1)) {
            return (a.iteration || 1) - (b.iteration || 1);
          }
          
          // Then by created date
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
        
        setPrompts(sortedPrompts);
        setError(null);
      } catch (err) {
        console.error(`Error fetching stretch data:`, err);
        setError('Failed to load stretch and prompts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStretchAndPrompts();
  }, [projectName, stretchId]);
  
  const handleCreatePrompt = () => {
    if (stretch) {
      navigate(`/admin/prompt-agent/${encodeURIComponent(projectName)}/new?stretch=${stretchId}`);
    }
  };
  
  const handleEditPrompt = (promptId: string) => {
    navigate(`/admin/prompt-agent/${encodeURIComponent(projectName)}/${promptId}`);
  };
  
  const handleCopyPrompt = (prompt: AutoPrompt) => {
    navigator.clipboard.writeText(prompt.prompt);
    toast({
      title: 'Prompt Copied',
      description: 'The prompt text has been copied to your clipboard',
    });
  };
  
  // Group prompts by feature for better organization
  const promptsByFeature = prompts.reduce((acc, prompt) => {
    const feature = prompt.feature;
    if (!acc[feature]) {
      acc[feature] = [];
    }
    acc[feature].push(prompt);
    return acc;
  }, {} as Record<string, AutoPrompt[]>);
  
  const renderPromptItem = (prompt: AutoPrompt, index: number, featurePrompts: AutoPrompt[]) => {
    const isLatestIteration = index === featurePrompts.length - 1;
    
    return (
      <Card 
        key={prompt.id} 
        className={`mb-4 ${isLatestIteration ? 'border-primary' : 'border-muted'}`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base flex items-center">
                  {prompt.component && (
                    <Badge variant="outline" className="mr-2">
                      {prompt.component}
                    </Badge>
                  )}
                  <span>{prompt.module}</span>
                  <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                  <span>{prompt.feature}</span>
                </CardTitle>
                
                {isLatestIteration && (
                  <Badge variant="default" className="ml-2">Latest</Badge>
                )}
              </div>
              
              <CardDescription className="mt-1 flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className="text-xs"
                >
                  Iteration {prompt.iteration || 1}
                </Badge>
                
                {prompt.tags && prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleCopyPrompt(prompt)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleEditPrompt(prompt.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="bg-muted/50 p-3 rounded text-sm whitespace-pre-wrap">
            {prompt.prompt}
          </div>
          
          {prompt.notes && (
            <Collapsible className="mt-2 border rounded-md">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="flex w-full justify-between p-2">
                  <span className="flex items-center text-sm">
                    Notes
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-2 text-sm border-t">
                {prompt.notes}
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
        
        <CardFooter className="pt-2 flex justify-between text-xs text-muted-foreground border-t">
          <div>
            Status: <Badge variant="outline" className="ml-1">{prompt.status}</Badge>
          </div>
          <div>
            Updated: {new Date(prompt.updated_at).toLocaleDateString()}
          </div>
        </CardFooter>
      </Card>
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
            onClick={onBack}
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
  
  if (error || !stretch) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">Error</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="mb-4">{error || 'Stretch not found'}</p>
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
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">{stretch.title}</h2>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Prompt Iterations</CardTitle>
              <CardDescription>
                {stretch.description || `Prompts for ${stretch.title}`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreatePrompt}>
                <Plus className="h-4 w-4 mr-2" />
                New Prompt
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center mb-4 gap-2">
            <Badge variant="outline">Page {stretch.page_number}</Badge>
            <Badge variant="outline">Sequence {stretch.sequence}</Badge>
            <Badge 
              variant={
                stretch.status === 'completed' 
                  ? 'default' 
                  : stretch.status === 'in_progress' 
                    ? 'secondary' 
                    : 'outline'
              }
            >
              {stretch.status.replace('_', ' ')}
            </Badge>
          </div>
          
          {Object.keys(promptsByFeature).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No prompts in this stretch yet</p>
              <Button onClick={handleCreatePrompt}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Prompt
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center">
                <History className="h-4 w-4 mr-2" />
                <h3 className="text-sm font-medium">Prompt History by Feature</h3>
              </div>
              
              <div className="space-y-4">
                {Object.entries(promptsByFeature).map(([feature, featurePrompts]) => (
                  <Accordion
                    key={feature}
                    type="single"
                    collapsible
                    defaultValue={Object.keys(promptsByFeature)[0]}
                    className="border rounded-md"
                  >
                    <AccordionItem value={feature} className="border-none">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center">
                          <LayoutList className="h-4 w-4 mr-2" />
                          <span>{feature}</span>
                          <Badge 
                            variant="outline" 
                            className="ml-2"
                          >
                            {featurePrompts.length} iteration{featurePrompts.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-0">
                        <ScrollArea className="max-h-[600px]">
                          {featurePrompts.map((prompt, index) => 
                            renderPromptItem(prompt, index, featurePrompts)
                          )}
                        </ScrollArea>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 