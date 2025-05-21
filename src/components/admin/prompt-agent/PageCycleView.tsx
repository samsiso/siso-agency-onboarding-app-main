import React, { useState } from 'react';
import { useCyclePrompts } from '@/hooks/useCyclePrompts';
import { CycleStep, CycleStatus, AutoPrompt, CYCLE_STEP_LABELS } from '@/types/auto-prompts';
import { FRONTEND_CYCLE_TEMPLATES } from '@/types/cycle-prompts';
import { CycleStepper } from './CycleStepper';
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
  Sparkles
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface PageCycleViewProps {
  projectName: string;
  pageName: string;
  pageRoute: string;
  domain?: string;
  onPromptSelect?: (prompt: AutoPrompt) => void;
}

export function PageCycleView({
  projectName,
  pageName,
  pageRoute,
  domain = 'frontend',
  onPromptSelect
}: PageCycleViewProps) {
  const [notes, setNotes] = useState('');
  const {
    isLoading,
    error,
    cyclePrompts,
    currentStep,
    cycleNumber,
    cycleStatus,
    completedSteps,
    isInitialized,
    initializeCycle,
    advanceToNextStep,
    createNewPrompt
  } = useCyclePrompts({
    projectName,
    pageName,
    pageRoute,
    domain
  });

  const handleNewPrompt = async () => {
    await createNewPrompt(notes);
    setNotes('');
  };

  const handleAdvance = async () => {
    await advanceToNextStep();
  };

  // Get all the prompts for the current step
  const currentStepPrompts = cyclePrompts.filter(prompt => prompt.cycle_step === currentStep);
  
  // Format timestamp string
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get step metadata
  const currentStepTemplate = FRONTEND_CYCLE_TEMPLATES[currentStep];

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
          <CardTitle>Start Development Cycle</CardTitle>
          <CardDescription>
            Begin the development cycle for {pageName} ({pageRoute})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            No development cycle has been started for this page yet. Click the button below to initialize the cycle and begin with the initial review step.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.values(FRONTEND_CYCLE_TEMPLATES).map((template) => (
              <Card key={template.key} className="bg-muted/50">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium">{template.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                  <Badge variant="outline" className="mt-2">
                    <Clock className="h-3 w-3 mr-1" /> {template.estimatedTime}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={initializeCycle} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" /> Initialize Development Cycle
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>
                {pageName} Development Cycle
                <Badge className="ml-2" variant={cycleStatus === CycleStatus.Completed ? "default" : "secondary"}>
                  Cycle {cycleNumber}
                </Badge>
              </CardTitle>
              <CardDescription>
                Current step: {CYCLE_STEP_LABELS[currentStep]}
                {currentStepTemplate && ` • ${currentStepTemplate.estimatedTime}`}
              </CardDescription>
            </div>
            <CycleStepper
              currentStep={currentStep}
              cycleNumber={cycleNumber}
              cycleStatus={cycleStatus}
              className="min-w-[220px]"
            />
          </div>
        </CardHeader>
        <CardContent>
          {currentStepTemplate && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{currentStepTemplate.title}</h3>
              <p className="text-muted-foreground mb-4">{currentStepTemplate.description}</p>
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
                            {prompt.prompt.length > 100 
                              ? prompt.prompt.substring(0, 100) + '...' 
                              : prompt.prompt}
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
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" /> Create Prompt
          </Button>
          <Button 
            onClick={handleAdvance}
            disabled={isLoading || currentStepPrompts.length === 0 || cycleStatus === CycleStatus.Completed}
          >
            {completedSteps.includes(currentStep) ? (
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

      <Card>
        <CardHeader>
          <CardTitle>All Cycle Prompts</CardTitle>
          <CardDescription>
            View all prompts across all steps in this development cycle
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
              {cyclePrompts.map((prompt) => (
                <TableRow 
                  key={prompt.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onPromptSelect?.(prompt)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {prompt.prompt.length > 100 
                          ? prompt.prompt.substring(0, 100) + '...' 
                          : prompt.prompt}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {CYCLE_STEP_LABELS[prompt.cycle_step]}
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
    </div>
  );
} 