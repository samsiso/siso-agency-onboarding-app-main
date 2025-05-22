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
import { getPagesByProject, getPromptsByPage, getPromptTemplates, advancePageStep } from '@/api/prompt-agent';
import { UIPrompt, UIPromptStep, Page } from '@/types/ui-prompts';
import { PageCycleView } from './PageCycleView';
import { supabase } from '@/integrations/supabase';

interface PagePromptsViewProps {
  projectId: string;
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
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(prompts.length / pageSize);
  
  const paginatedPrompts = prompts.slice((page - 1) * pageSize, page * pageSize);
  
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">All Prompts</h3>
          <Badge variant="outline" className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 border-blue-200">
            Total Prompts: {prompts.length}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Input 
            type="search"
            placeholder="Filter prompts..."
            className="w-64"
          />
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Feature</TableHead>
              <TableHead className="font-semibold text-gray-700">Module</TableHead>
              <TableHead className="font-semibold text-gray-700">Component</TableHead>
              <TableHead className="font-semibold text-gray-700">Step</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700">Priority</TableHead>
              <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prompts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Search className="h-8 w-8 text-gray-400" />
                    <p>No prompts found</p>
                    <Button variant="outline" size="sm">Add New Prompt</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedPrompts.map((prompt) => (
                <TableRow 
                  key={prompt.id}
                  className="group cursor-pointer transition-colors hover:bg-blue-50/50"
                >
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStepIcon(prompt.step)}
                      <span className="font-medium text-gray-900">{prompt.page?.name || prompt.page_id || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{prompt.template?.title || prompt.step || 'N/A'}</TableCell>
                  <TableCell className="text-gray-700">{prompt.page?.category || 'N/A'}</TableCell>
                  <TableCell className="text-gray-700">{prompt.cycle_number}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        prompt.status === 'completed' ? 'default' :
                        prompt.status === 'in_progress' ? 'secondary' :
                        'outline'
                      }
                      className={
                        prompt.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        prompt.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }
                    >
                      {prompt.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        (prompt.template?.step && prompt.template?.step.includes('execute')) ? 'destructive' :
                        (prompt.template?.step && prompt.template?.step.includes('plan')) ? 'secondary' :
                        'default'
                      }
                      className={
                        (prompt.template?.step && prompt.template?.step.includes('execute')) ? 'bg-red-100 text-red-800 border-red-200' :
                        (prompt.template?.step && prompt.template?.step.includes('plan')) ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        'bg-blue-100 text-blue-800 border-blue-200'
                      }
                    >
                      {(prompt.template?.step && prompt.template?.step.includes('execute') ? 'High' :
                       prompt.template?.step && prompt.template?.step.includes('plan') ? 'Medium' :
                       'Low')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="hover:bg-blue-100 hover:text-blue-700"
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
                          className="bg-blue-600 hover:bg-blue-700 text-white"
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
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing {Math.min(prompts.length, (page - 1) * pageSize + 1)} to {Math.min(prompts.length, page * pageSize)} of {prompts.length} prompts
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="hover:bg-blue-50"
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({length: Math.min(totalPages, 5)}, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button 
                    key={i}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    className={`w-8 h-8 p-0 ${
                      pageNum === page 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'hover:bg-blue-50'
                    }`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="mx-1">...</span>}
              {totalPages > 5 && (
                <Button 
                  variant={totalPages === page ? "default" : "outline"}
                  size="sm"
                  className={`w-8 h-8 p-0 ${
                    totalPages === page 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'hover:bg-blue-50'
                  }`}
                  onClick={() => setPage(totalPages)}
                >
                  {totalPages}
                </Button>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="hover:bg-blue-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const PagePromptsView: React.FC<PagePromptsViewProps> = ({ projectId }) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [allPrompts, setAllPrompts] = useState<UIPrompt[]>([]);
  const [pagePrompts, setPagePrompts] = useState<Record<string, UIPrompt[]>>({});
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [isCycleViewOpen, setIsCycleViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debugInfo, setDebugInfo] = useState<string>('');
  const location = window.location;
  const navigate = useNavigate();

  // Add comprehensive debug output to help diagnose
  useEffect(() => {
    // Capture route information
    const routeInfo = {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      projectId,
      href: location.href,
    };
    console.log("Route debug info:", routeInfo);
    
    // Check if we're in the correct route for UbahCrypt
    const isUbahCryptRoute = location.pathname.toLowerCase().includes('ubahcrypt');
    console.log(`Is this an UbahCrypt route? ${isUbahCryptRoute}`);
    
    // Parse route to extract specific project if present
    const segments = location.pathname.split('/');
    const projectSegment = segments.find(s => 
      s.toLowerCase() === 'ubahcrypt' || 
      decodeURIComponent(s).toLowerCase() === 'ubahcrypt'
    );
    
    console.log(`Project segment found in URL: ${projectSegment || 'none'}`);
    
    // If we're on a UbahCrypt route, immediately trigger a query with the right case
    if (isUbahCryptRoute) {
      console.log("UbahCrypt route detected, will use 'UbahCrypt' for queries");
    }
    
    setDebugInfo(JSON.stringify({
      ...routeInfo,
      isUbahCryptRoute,
      projectSegment,
      effectiveProject: isUbahCryptRoute ? 'UbahCrypt' : projectId
    }, null, 2));
  }, [location, projectId]);

  // Function to directly fetch all prompts from project_prompts table
  const fetchAllPrompts = async () => {
    try {
      console.log(`ProjectId passed to component: "${projectId}"`);
      
      // UbahCrypt is a special case - our component receives a projectId but the database 
      // uses a specific project name string
      const isUbahCryptRoute = location.pathname.toLowerCase().includes('ubahcrypt');
      const effectiveProjectName = isUbahCryptRoute ? 'UbahCrypt' : projectId;
      
      console.log(`Using effective project name for query: "${effectiveProjectName}"`);
      
      // Query project_prompts table with the effective project name
      const { data, error } = await supabase
        .from('project_prompts')
        .select('*')
        .eq('project', effectiveProjectName)
        .order('id');

      if (error) {
        console.error('Error fetching all prompts:', error);
        setError(`Failed to fetch prompts: ${error.message}`);
        return [];
      }

      console.log(`Successfully loaded ${data?.length || 0} prompts for project=${effectiveProjectName}`);

      // Format the prompts for display
      const formattedPrompts = data.map(prompt => ({
        ...prompt,
        id: prompt.id.toString(),
        page_id: prompt.page,
        cycle_number: prompt.prompt_cycle_number,
        template: { 
          step: `cycle_${prompt.prompt_cycle_number}`,
          title: prompt.page 
        },
        page: { 
          name: prompt.page,
          category: prompt.domain,
          id: prompt.page
        },
        status: prompt.is_done ? 'completed' : prompt.times_used > 0 ? 'in_progress' : 'not_started',
        step: `cycle_${prompt.prompt_cycle_number}`
      }));

      return formattedPrompts;
    } catch (e) {
      console.error('Exception fetching all prompts:', e);
      setError(`Exception fetching prompts: ${e instanceof Error ? e.message : String(e)}`);
      return [];
    }
  };

  // Function to directly fetch all pages
  const fetchAllPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching pages:', error);
        setError(`Failed to fetch pages: ${error.message}`);
        return [];
      }

      console.log(`Successfully loaded ${data.length} pages`);
      return data;
    } catch (e) {
      console.error('Exception fetching pages:', e);
      setError(`Exception fetching pages: ${e instanceof Error ? e.message : String(e)}`);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load prompts directly from the project_prompts table
        const allPromptsData = await fetchAllPrompts();
        setAllPrompts(allPromptsData);
        
        // Group prompts by page
        const pages = Array.from(new Set(allPromptsData.map(p => p.page_id)))
          .map(pageId => {
            const pagePrompts = allPromptsData.filter(p => p.page_id === pageId);
            const firstPrompt = pagePrompts[0];
            const pageName = firstPrompt?.page?.name || pageId;
            return {
              id: pageId,
              name: pageName,
              category: firstPrompt?.page?.category || 'Uncategorized',
              status: pagePrompts.every(p => p.status === 'completed') ? 'completed' : 'in_progress',
              project_id: projectId,
              route: firstPrompt?.page?.route || `/${pageName.toLowerCase().replace(/\s+/g, '-')}`,
              created_at: firstPrompt?.page?.created_at || new Date().toISOString(),
              updated_at: firstPrompt?.page?.updated_at || new Date().toISOString()
            } as Page;
          });
        
        setPages(pages);
        
        // Organize prompts by page
        const promptsByPage: Record<string, UIPrompt[]> = {};
        allPromptsData.forEach(prompt => {
          if (prompt.page_id) {
            if (!promptsByPage[prompt.page_id]) {
              promptsByPage[prompt.page_id] = [];
            }
            promptsByPage[prompt.page_id].push(prompt);
          }
        });
        setPagePrompts(promptsByPage);
      } catch (e) {
        console.error('Error loading data:', e);
        setError(`Failed to load data: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [projectId]);

  const filteredPages = pages.filter(page => 
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCycle = async (page: Page) => {
    console.log('Opening cycle view for page:', page);
    setSelectedPage(page.name);
    setSelectedPageId(page.id);
    setIsCycleViewOpen(true);

    try {
      // Get the prompts from the already loaded data
      const existingPrompts = pagePrompts[page.id] || [];
      
      if (existingPrompts.length === 0) {
        // If no prompts are loaded, try to fetch them
        const { data: newPrompts, error } = await supabase
          .from('project_prompts')
          .select('*')
          .eq('page', page.name)
          .order('prompt_cycle_number');

        if (error) {
          throw error;
        }

        // Format the prompts
        const formattedPrompts = newPrompts.map(prompt => ({
          ...prompt,
          id: prompt.id.toString(),
          page_id: prompt.page,
          cycle_number: prompt.prompt_cycle_number,
          template: { 
            step: `cycle_${prompt.prompt_cycle_number}`,
            title: prompt.page 
          },
          page: { 
            name: prompt.page,
            category: prompt.domain,
            id: prompt.page
          },
          status: prompt.is_done ? 'completed' : prompt.times_used > 0 ? 'in_progress' : 'not_started',
          step: `cycle_${prompt.prompt_cycle_number}`
        }));

        setPagePrompts(prev => ({
          ...prev,
          [page.id]: formattedPrompts
        }));
      }
    } catch (error) {
      console.error('Error loading prompts:', error);
      setError(`Failed to load prompts: ${error instanceof Error ? error.message : String(error)}`);
    }
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
        <div className="flex space-x-3">
          <Badge variant="outline" className="px-2 py-1 text-sm">
            Total Prompts: {allPrompts.length}
          </Badge>
          <Button onClick={() => navigate('/admin/database-setup')}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh Database
          </Button>
          <Button 
            variant="outline" 
            onClick={async () => {
              try {
                // Try case-specific UbahCrypt query
                const { count: ubahCryptCount, error: ubahCryptError } = await supabase
                  .from('project_prompts')
                  .select('*', { count: 'exact', head: true })
                  .eq('project', 'UbahCrypt');
                
                if (ubahCryptError) {
                  console.error("Error querying 'UbahCrypt':", ubahCryptError);
                  return;
                }
                
                // Check if we got the right count
                if (ubahCryptCount === 210) {
                  console.log("Found 210 records with 'UbahCrypt'!");
                  alert(`Success! Found ${ubahCryptCount} records with project='UbahCrypt'`);
                  
                  // Now refresh the data with this specific value
                  setIsLoading(true);
                  const allPromptsData = await fetchAllPrompts();
                  setAllPrompts(allPromptsData);
                  setIsLoading(false);
                } else {
                  console.log(`Found ${ubahCryptCount} records with 'UbahCrypt', expected 210`);
                  alert(`Found ${ubahCryptCount} records with project='UbahCrypt'`);
                }
              } catch (e) {
                console.error('Exception in debug:', e);
              }
            }}
          >
            <Database className="h-4 w-4 mr-2" />
            Force UbahCrypt
          </Button>
          <Button 
            variant="secondary"
            onClick={() => {
              // Log detailed component state for debugging
              const state = {
                projectId,
                pagesCount: pages.length,
                allPromptsCount: allPrompts.length,
                pagePromptsCount: Object.keys(pagePrompts).length,
                searchTerm,
                url: window.location.href,
                routeParams: location.pathname.split('/'),
              };
              console.log("Component State:", state);
              
              // Display in alert for easy viewing
              alert(
                `Debug Info:\n\n` +
                `URL: ${window.location.href}\n` +
                `Project ID: ${projectId}\n` + 
                `Pages: ${pages.length}\n` +
                `Prompts: ${allPrompts.length}\n` +
                `Route: ${location.pathname}\n\n` +
                `Route Analysis: ${JSON.stringify(location.pathname.split('/'), null, 2)}`
              );
            }}
          >
            <Search className="h-4 w-4 mr-2" />
            Debug Routes
          </Button>
        </div>
      </div>

      {debugInfo && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs font-mono">
          <div className="font-semibold mb-1">Debug Info:</div>
          <pre>{debugInfo}</pre>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search pages..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error Loading Data</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <RefreshCcw className="h-5 w-5 animate-spin" />
            <span>Loading pages and prompts...</span>
          </div>
        </div>
      ) : (
        <>
          <PromptTable 
            prompts={allPrompts} 
            onPromptSelect={(prompt) => {
              setSelectedPage(prompt.page?.name || '');
              setSelectedPageId(prompt.page_id);
              setIsCycleViewOpen(true);
            }}
            onAdvanceStep={handleAdvanceStep}
          />

          <div className="space-y-8">
            {Object.entries(pagesByCategory).map(([category, pages]) => (
              <div key={category}>
                <h3 className="mb-4 text-lg font-semibold">{category}</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      className="rounded-lg border bg-card text-card-foreground shadow-sm"
                    >
                      <div className="p-6">
                        <h4 className="text-lg font-semibold">{page.name}</h4>
                        {page.description && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {page.description}
                          </p>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                          <Badge variant={page.status === 'completed' ? 'default' : 'secondary'}>
                            {page.status}
                          </Badge>
                          <Button
                            variant="outline"
                            onClick={() => handleViewCycle(page)}
                          >
                            View Cycle
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={isCycleViewOpen} onOpenChange={setIsCycleViewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedPage} Prompt Cycle</DialogTitle>
          </DialogHeader>
          {selectedPageId && (
            <PageCycleView
              projectName={projectId}
              pageName={selectedPage}
              pageRoute={pages.find(p => p.id === selectedPageId)?.route || ''}
              onPromptSelect={(prompt) => {
                // Handle prompt selection if needed
                console.log('Selected prompt:', prompt);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 