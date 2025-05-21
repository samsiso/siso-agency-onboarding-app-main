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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search,
  Home,
  Clock,
  ArrowRight,
  LayoutDashboard,
  LineChart,
  Wallet,
  ArrowLeftRight,
  Coins,
  Users,
  GraduationCap,
  MessageSquare,
  Bell,
  HelpCircle,
  Settings,
  UserCircle,
  TrendingUp,
  BarChart2,
  Gift,
  Shield,
  Bot,
  Users2,
  Rocket,
  Image,
  DollarSign,
  Crown,
  Trophy,
  MapPin,
  Key,
  BellRing,
  Plus,
  Server,
  BookOpen,
  ChevronRight,
  Database,
  ExternalLink,
  Layers,
  RefreshCcw,
  CheckCircle
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { getPagesByProject, getPromptsByPage, getPromptTemplates, advancePageStep } from '@/api/ui-prompts';
import { UIPrompt, UIPromptStep, Page } from '@/types/ui-prompts';
import { PageCycleView } from './PageCycleView';

interface PagePromptsViewProps {
  projectName: string;
  onPromptCreate?: (prompt: Partial<UIPrompt>) => void;
  onPromptSelect?: (prompt: UIPrompt) => void;
}

// Default page icons by category
const categoryIcons: Record<string, React.ReactNode> = {
  'Core Trading': <ArrowLeftRight className="h-6 w-6" />,
  'Market Data': <LineChart className="h-6 w-6" />,
  'Wallet & Assets': <Wallet className="h-6 w-6" />,
  'Portfolio': <BarChart2 className="h-6 w-6" />,
  'Account': <UserCircle className="h-6 w-6" />,
  'Developer': <Database className="h-6 w-6" />,
  'Support': <HelpCircle className="h-6 w-6" />,
  'Information': <MessageSquare className="h-6 w-6" />,
  'Advanced Trading': <TrendingUp className="h-6 w-6" />,
  'Earning': <Coins className="h-6 w-6" />,
  'NFT': <Image className="h-6 w-6" />,
  'New Assets': <Rocket className="h-6 w-6" />,
  'Mobile': <ExternalLink className="h-6 w-6" />,
  'Growth': <TrendingUp className="h-6 w-6" />
};

// Get icon for a specific step
const getStepIcon = (step: string) => {
  if (step.includes('analyze_codebase')) return <Layers className="h-4 w-4" />;
  if (step.includes('extract_pdr')) return <BookOpen className="h-4 w-4" />;
  if (step.includes('plan_innovation')) return <Layers className="h-4 w-4" />;
  if (step.includes('execute_plan')) return <Server className="h-4 w-4" />;
  if (step.includes('review_update')) return <CheckCircle className="h-4 w-4" />;
  return <ChevronRight className="h-4 w-4" />;
};

// Format step name for display
const formatStepName = (step: string) => {
  return step
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Interface for prompt table props
interface PromptTableProps {
  prompts: UIPrompt[];
  onPromptSelect?: (prompt: UIPrompt) => void;
  onAdvanceStep?: (pageId: string) => void;
}

const PromptTable: React.FC<PromptTableProps> = ({ prompts, onPromptSelect, onAdvanceStep }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Prompt Step</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prompts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No prompts found for this page
            </TableCell>
          </TableRow>
        ) : (
          prompts.map((prompt) => (
            <TableRow 
              key={prompt.id}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell>
                <div className="flex items-center">
                  {getStepIcon(prompt.step)}
                  <span className="ml-2 font-medium">{formatStepName(prompt.step)}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    prompt.status === 'completed' ? 'default' :
                    prompt.status === 'in_progress' ? 'secondary' :
                    prompt.status === 'draft' ? 'outline' :
                    'destructive'
                  }
                >
                  {prompt.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {new Date(prompt.updated_at).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPromptSelect?.(prompt);
                    }}
                  >
                    View
                  </Button>
                  {prompt.status !== 'completed' && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdvanceStep?.(prompt.page_id);
                      }}
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      Next Step
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export const PagePromptsView: React.FC<PagePromptsViewProps> = ({
  projectName,
  onPromptCreate,
  onPromptSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isCycleViewOpen, setIsCycleViewOpen] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [pagePrompts, setPagePrompts] = useState<Record<string, UIPrompt[]>>({});
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch pages and templates on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all pages for the project
        const fetchedPages = await getPagesByProject('ubahcrypt');
        setPages(fetchedPages);
        
        // Fetch templates
        const fetchedTemplates = await getPromptTemplates();
        setTemplates(fetchedTemplates);
        
        // Fetch prompts for each page
        const promptsMap: Record<string, UIPrompt[]> = {};
        for (const page of fetchedPages) {
          const pagePrompts = await getPromptsByPage(page.id);
          promptsMap[page.id] = pagePrompts;
        }
        setPagePrompts(promptsMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter pages based on search query
  const filteredPages = pages.filter((page) => {
    const searchLower = searchQuery.toLowerCase();
    return page.name.toLowerCase().includes(searchLower) ||
           page.description?.toLowerCase().includes(searchLower) ||
           page.category?.toLowerCase().includes(searchLower);
  });

  const handleViewCycle = (page: Page) => {
    setSelectedPage(page.name);
    setSelectedPageId(page.id);
    setIsCycleViewOpen(true);
  };

  const handleAdvanceStep = async (pageId: string) => {
    setIsLoading(true);
    try {
      await advancePageStep(pageId);
      
      // Refresh prompts for this page
      const updatedPrompts = await getPromptsByPage(pageId);
      setPagePrompts(prev => ({
        ...prev,
        [pageId]: updatedPrompts
      }));
    } catch (error) {
      console.error('Error advancing step:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group pages by category
  const pagesByCategory: Record<string, Page[]> = {};
  filteredPages.forEach(page => {
    const category = page.category || 'Uncategorized';
    if (!pagesByCategory[category]) {
      pagesByCategory[category] = [];
    }
    pagesByCategory[category].push(page);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Crypto Trading Platform</h2>
        <Button onClick={() => navigate('/admin/database-setup')}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh Database
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search pages..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <RefreshCcw className="h-5 w-5 animate-spin" />
            <span>Loading pages and prompts...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(pagesByCategory).map(([category, categoryPages]) => (
            <Card key={category} className="w-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-md bg-primary/10">
                    {categoryIcons[category] || <Layers className="h-6 w-6" />}
                  </div>
                  <CardTitle>{category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryPages.map(page => (
                    <Card key={page.id} className="w-full">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{page.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {page.description || `Route: ${page.route}`}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">{page.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <PromptTable 
                          prompts={pagePrompts[page.id] || []} 
                          onPromptSelect={onPromptSelect}
                          onAdvanceStep={handleAdvanceStep}
                        />
                        <div className="flex justify-end mt-4">
                          <Button 
                            onClick={() => handleViewCycle(page)}
                          >
                            View Complete Development Cycle
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cycle View Dialog */}
      <Dialog open={isCycleViewOpen} onOpenChange={setIsCycleViewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPage} Development Cycle</DialogTitle>
            <DialogDescription>
              This page shows the complete development cycle for this component
            </DialogDescription>
          </DialogHeader>

          {selectedPageId && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {templates.map(template => (
                  <Card key={template.id} className="w-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center">
                        {getStepIcon(template.step)}
                        <span className="ml-2">{template.title}</span>
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{template.estimated_time}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>{template.description}</p>
                      
                      {pagePrompts[selectedPageId]?.some(p => p.step === template.step) ? (
                        <Badge className="mt-2" variant="default">Prompt Generated</Badge>
                      ) : (
                        <Badge className="mt-2" variant="outline">Not Started</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleAdvanceStep(selectedPageId)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Advance to Next Step
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 