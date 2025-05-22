import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  ArrowRight, 
  Layers, 
  CheckCircle, 
  Clock, 
  BarChart, 
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PromptPageCardsProps {
  pages: Array<{
    id: string;
    name: string;
    description?: string;
    status: string;
    prompts: Array<{
      id: string;
      cycle: number;
      status: string;
      lastUsed: string;
      timesUsed: number;
    }>;
  }>;
  onViewPage: (pageId: string) => void;
}

export function PromptPageCards({ pages, onViewPage }: PromptPageCardsProps) {
  // Helper function to calculate cycle progress
  const calculateProgress = (prompts: any[]) => {
    if (!prompts.length) return 0;
    const completed = prompts.filter(p => p.status === 'completed').length;
    return Math.round((completed / prompts.length) * 100);
  };

  // Get the current cycle number for a page
  const getCurrentCycle = (prompts: any[]) => {
    if (!prompts.length) return 1;
    return Math.max(...prompts.map(p => p.cycle));
  };

  // Generate a background color based on page name
  const getPageColor = (pageName: string) => {
    const colors = [
      'from-blue-600 to-indigo-700', 
      'from-purple-600 to-indigo-700',
      'from-amber-600 to-red-700',
      'from-green-600 to-teal-700',
      'from-pink-600 to-purple-700',
      'from-cyan-600 to-blue-700',
      'from-red-600 to-pink-700',
      'from-teal-600 to-green-700'
    ];
    
    // Simple hash function to pick a consistent color for a page name
    const hashCode = pageName.split('').reduce((hash, char) => {
      return char.charCodeAt(0) + ((hash << 5) - hash);
    }, 0);
    
    return colors[Math.abs(hashCode) % colors.length];
  };

  // Format date as relative time
  const getRelativeTime = (dateString: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="space-y-8">
      {/* Add New Page button */}
      <div className="flex justify-end">
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pages.map((page) => {
          const progress = calculateProgress(page.prompts);
          const currentCycle = getCurrentCycle(page.prompts);
          const lastUsedPrompt = page.prompts.sort((a, b) => 
            new Date(b.lastUsed || 0).getTime() - new Date(a.lastUsed || 0).getTime()
          )[0];
          const pageColor = getPageColor(page.name);
          
          return (
            <Card 
              key={page.id} 
              className="relative overflow-hidden border-transparent group transition-all duration-300 hover:shadow-lg hover:border-gray-700"
            >
              {/* Top colored banner */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${pageColor}`} />
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{page.name}</CardTitle>
                    {page.description && (
                      <CardDescription className="mt-1 line-clamp-2">{page.description}</CardDescription>
                    )}
                  </div>
                  
                  <div className="flex space-x-1">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-gray-800 text-xs">
                        {page.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="space-y-4">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  {/* Activity overview */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 text-sm rounded-md bg-muted/40 p-2">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Prompts</div>
                        <div className="font-medium">{page.prompts.length}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm rounded-md bg-muted/40 p-2">
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Cycle</div>
                        <div className="font-medium">{currentCycle}/7</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent activity */}
                  {lastUsedPrompt && (
                    <div className="text-xs text-muted-foreground flex items-center space-x-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Last activity: {getRelativeTime(lastUsedPrompt.lastUsed)}</span>
                    </div>
                  )}
                  
                  {/* Prompt status summary */}
                  <div className="flex items-center space-x-1">
                    {Array.from({length: 7}).map((_, i) => {
                      const hasPromptsForCycle = page.prompts.some(p => p.cycle === i + 1);
                      const completedForCycle = page.prompts.some(p => p.cycle === i + 1 && p.status === 'completed');
                      
                      return (
                        <div 
                          key={i}
                          className={`w-8 h-1.5 rounded-full ${
                            hasPromptsForCycle
                              ? completedForCycle 
                                ? 'bg-green-500' 
                                : 'bg-amber-500'
                              : 'bg-gray-700'
                          }`}
                          title={`Cycle ${i + 1}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 flex items-center justify-between">
                <Badge variant={progress === 100 ? "default" : "secondary"}>
                  {progress === 100 ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {progress === 100 ? "Completed" : "In Progress"}
                </Badge>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="group/btn"
                  onClick={() => onViewPage(page.id)}
                >
                  <span>View Cycle</span>
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 