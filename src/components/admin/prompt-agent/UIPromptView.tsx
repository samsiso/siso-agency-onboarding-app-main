import React, { useState } from 'react';
import { useUIPrompts } from '@/hooks/useUIPrompts';
import {
  UIPromptStep,
  PromptStatus,
  UIPrompt,
  UI_PROMPT_STEP_LABELS,
  UI_PROMPT_STEP_DESCRIPTIONS,
  UI_PROMPT_STEP_TIMES,
  UI_PROMPT_STEP_ORDER
} from '@/types/ui-prompts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  File,
  Plus,
  Sparkles,
  Code,
  List,
  Clipboard,
  PlaneTakeoff,
  Lightbulb,
  Smartphone,
  Accessibility,
  Paintbrush,
  Search
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';

interface UIPromptViewProps {
  projectId: string;
  pageName?: string;
  pageRoute?: string;
  pageId?: string;
  onPromptSelect?: (prompt: UIPrompt) => void;
}

// Icon mappings for different steps
const STEP_ICONS: Record<UIPromptStep, React.ReactNode> = {
  [UIPromptStep.AnalyzeCodebase]: <Code className="h-4 w-4" />,
  [UIPromptStep.ListIssues]: <List className="h-4 w-4" />,
  [UIPromptStep.ReviewPDR]: <Clipboard className="h-4 w-4" />,
  [UIPromptStep.CreatePlan]: <PlaneTakeoff className="h-4 w-4" />,
  [UIPromptStep.ProposeEnhancements]: <Lightbulb className="h-4 w-4" />,
  [UIPromptStep.ImplementResponsiveness]: <Smartphone className="h-4 w-4" />,
  [UIPromptStep.ImplementAccessibility]: <Accessibility className="h-4 w-4" />,
  [UIPromptStep.ImplementDesignEnhancements]: <Paintbrush className="h-4 w-4" />,
  [UIPromptStep.ReviewUpdates]: <Search className="h-4 w-4" />
};

export function UIPromptView({
  projectId,
  pageName,
  pageRoute,
  pageId,
  onPromptSelect
}: UIPromptViewProps) {
  const [notes, setNotes] = useState('');
  const [newPageName, setNewPageName] = useState('');
  const [newPageRoute, setNewPageRoute] = useState('');
  const [newPageDescription, setNewPageDescription] = useState('');
  const {
    isLoading,
    error,
    page,
    pageWithPrompts,
    currentStep,
    nextStep,
    progress,
    isInitialized,
    initializePage,
    advanceToNextStep,
    createPrompt,
    updatePromptStatus,
    updatePromptResponse,
    refresh
  } = useUIPrompts({
    projectId,
    pageName,
    pageRoute,
    pageId,
    autoInit: false
  });

  const handleNewPrompt = async () => {
    if (currentStep) {
      await createPrompt(currentStep, notes);
      setNotes('');
    }
  };

  const handleAdvance = async () => {
    await advanceToNextStep(notes);
    setNotes('');
  };

  const handleInitializePage = async () => {
    if (!newPageName || !newPageRoute) {
      return;
    }
    
    await initializePage(newPageName, newPageRoute, newPageDescription);
    setNewPageName('');
    setNewPageRoute('');
    setNewPageDescription('');
  };

  // Format timestamp string
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get current step prompts
  const getCurrentStepPrompts = (): UIPrompt[] => {
    if (!pageWithPrompts || !currentStep) {
      return [];
    }
    return pageWithPrompts.prompts[currentStep] || [];
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!isInitialized) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Initialize UI Prompts</CardTitle>
          <CardDescription>
            Start the 9-step UI development process for a page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pageName">Page Name</Label>
                <Input 
                  id="pageName" 
                  placeholder="Dashboard" 
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pageRoute">Page Route</Label>
                <Input 
                  id="pageRoute" 
                  placeholder="/dashboard" 
                  value={newPageRoute}
                  onChange={(e) => setNewPageRoute(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pageDescription">Description (Optional)</Label>
              <Textarea 
                id="pageDescription" 
                placeholder="Brief description of the page and its purpose"
                value={newPageDescription}
                onChange={(e) => setNewPageDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">9-Step UI Development Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {UI_PROMPT_STEP_ORDER.map((step) => (
                <Card key={step} className="bg-muted/50">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium flex items-center">
                      {STEP_ICONS[step]} 
                      <span className="ml-2">{UI_PROMPT_STEP_LABELS[step]}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground">
                      {UI_PROMPT_STEP_DESCRIPTIONS[step]}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      <Clock className="h-3 w-3 mr-1" /> {UI_PROMPT_STEP_TIMES[step]}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleInitializePage} 
            className="w-full"
            disabled={!newPageName || !newPageRoute}
          >
            <Sparkles className="h-4 w-4 mr-2" /> Initialize UI Development Process
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // We have an initialized page
  const currentStepPrompts = getCurrentStepPrompts();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>
                {page?.name} UI Development
                <Badge className="ml-2" variant={progress === 100 ? "default" : "secondary"}>
                  {progress}% Complete
                </Badge>
              </CardTitle>
              <CardDescription>
                {page?.route} • {currentStep && UI_PROMPT_STEP_LABELS[currentStep]}
                {currentStep && ` • ${UI_PROMPT_STEP_TIMES[currentStep]}`}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end">
              <Progress value={progress} className="w-[180px] mb-2" />
              <div className="flex space-x-1">
                {UI_PROMPT_STEP_ORDER.map((step) => {
                  const isCurrentStep = currentStep === step;
                  const hasPrompts = pageWithPrompts?.prompts[step]?.length > 0;
                  const allCompleted = pageWithPrompts?.prompts[step]?.every(
                    p => p.status === 'completed'
                  );
                  
                  return (
                    <div
                      key={step}
                      title={UI_PROMPT_STEP_LABELS[step]}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isCurrentStep 
                          ? 'bg-primary text-primary-foreground'
                          : allCompleted
                            ? 'bg-green-500 text-white'
                            : hasPrompts
                              ? 'bg-amber-500 text-white'
                              : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {UI_PROMPT_STEP_ORDER.indexOf(step) + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentStep && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                {STEP_ICONS[currentStep]}
                <span className="ml-2">{UI_PROMPT_STEP_LABELS[currentStep]}</span>
              </h3>
              <p className="text-muted-foreground mb-4">{UI_PROMPT_STEP_DESCRIPTIONS[currentStep]}</p>
            </div>
          )}

          <div className="mb-6">
            <h4 className="font-medium mb-2">Current Step Prompts</h4>
            {currentStepPrompts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prompt</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStepPrompts.map((prompt) => (
                    <TableRow 
                      key={prompt.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onPromptSelect?.(prompt)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {prompt.content.length > 100 
                              ? prompt.content.substring(0, 100) + '...' 
                              : prompt.content}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatTimestamp(prompt.created_at)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={prompt.status === 'completed' ? 'default' : 'secondary'}
                        >
                          {prompt.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPromptSelect?.(prompt);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="bg-muted/30 border border-border rounded-md p-6 text-center">
                <p className="text-muted-foreground">No prompts created for this step yet.</p>
                <Button variant="outline" className="mt-4" onClick={handleNewPrompt}>
                  <Plus className="h-4 w-4 mr-2" /> Create First Prompt
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Create New Prompt</h4>
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Enter any specific notes or requirements for this prompt..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleNewPrompt}
            disabled={isLoading || !currentStep}
          >
            <Plus className="h-4 w-4 mr-2" /> Create Prompt
          </Button>
          <Button 
            onClick={handleAdvance}
            disabled={isLoading || !currentStep || currentStepPrompts.length === 0}
          >
            {currentStepPrompts.some(prompt => prompt.status === 'completed') ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" /> Complete Step
              </>
            ) : (
              <>
                Advance to Next Step <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Prompts</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Development Prompts</CardTitle>
              <CardDescription>
                View all prompts across all steps in the UI development process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prompt</TableHead>
                    <TableHead>Step</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageWithPrompts && Object.values(pageWithPrompts.prompts)
                    .flat()
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((prompt) => (
                      <TableRow 
                        key={prompt.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => onPromptSelect?.(prompt)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <File className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {prompt.content.length > 100 
                                ? prompt.content.substring(0, 100) + '...' 
                                : prompt.content}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center">
                            {STEP_ICONS[prompt.step]}
                            <span className="ml-1">{UI_PROMPT_STEP_LABELS[prompt.step]}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{formatTimestamp(prompt.created_at)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={prompt.status === 'completed' ? 'default' : 'secondary'}
                          >
                            {prompt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPromptSelect?.(prompt);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="issues" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>UI/UX Issues</CardTitle>
              <CardDescription>
                All identified UI/UX issues across development steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pageWithPrompts && Object.values(pageWithPrompts.prompts)
                .flat()
                .filter(prompt => prompt.issues && prompt.issues.length > 0)
                .length > 0 ? (
                <div className="space-y-4">
                  {pageWithPrompts && Object.values(pageWithPrompts.prompts)
                    .flat()
                    .filter(prompt => prompt.issues && prompt.issues.length > 0)
                    .map((prompt) => (
                      <Card key={prompt.id} className="bg-muted/30">
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm flex items-center">
                            {STEP_ICONS[prompt.step]}
                            <span className="ml-2">{UI_PROMPT_STEP_LABELS[prompt.step]}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-3">
                            {prompt.issues?.map((issue, index) => (
                              <div key={`${prompt.id}-issue-${index}`} className="border-l-2 border-red-500 pl-3">
                                <h4 className="font-medium text-sm">{issue.title || `Issue ${index + 1}`}</h4>
                                <p className="text-xs text-muted-foreground">{issue.description}</p>
                                {issue.priority && (
                                  <Badge 
                                    className="mt-1" 
                                    variant="outline"
                                    style={{ 
                                      color: issue.priority === 'high' || issue.priority === 'critical' 
                                        ? 'var(--color-destructive)' 
                                        : undefined 
                                    }}
                                  >
                                    {issue.priority}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  <p>No issues have been identified yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suggestions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Enhancement Suggestions</CardTitle>
              <CardDescription>
                Proposed UI/UX improvements and enhancements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pageWithPrompts && Object.values(pageWithPrompts.prompts)
                .flat()
                .filter(prompt => prompt.suggestions && prompt.suggestions.length > 0)
                .length > 0 ? (
                <div className="space-y-4">
                  {pageWithPrompts && Object.values(pageWithPrompts.prompts)
                    .flat()
                    .filter(prompt => prompt.suggestions && prompt.suggestions.length > 0)
                    .map((prompt) => (
                      <Card key={prompt.id} className="bg-muted/30">
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm flex items-center">
                            {STEP_ICONS[prompt.step]}
                            <span className="ml-2">{UI_PROMPT_STEP_LABELS[prompt.step]}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-3">
                            {prompt.suggestions?.map((suggestion, index) => (
                              <div key={`${prompt.id}-suggestion-${index}`} className="border-l-2 border-green-500 pl-3">
                                <h4 className="font-medium text-sm">{suggestion.title || `Suggestion ${index + 1}`}</h4>
                                <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                                <div className="flex space-x-2 mt-1">
                                  {suggestion.complexity && (
                                    <Badge variant="outline">
                                      Complexity: {suggestion.complexity}
                                    </Badge>
                                  )}
                                  {suggestion.impact && (
                                    <Badge 
                                      variant="outline"
                                      style={{ 
                                        color: suggestion.impact === 'high' ? 'var(--color-success)' : undefined 
                                      }}
                                    >
                                      Impact: {suggestion.impact}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  <p>No enhancement suggestions have been added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 