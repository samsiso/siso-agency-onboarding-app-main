import React, { useEffect, useState } from 'react';
import { autoPromptsService } from '@/utils/auto-prompts-service';
import { ProjectPrompt } from '@/types/project-prompts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, ArrowDown, ArrowUp, Play, CheckCircle, X, Info, Eye, Wand2 } from 'lucide-react';
import { debounce } from 'lodash';
import { supabase } from '@/integrations/supabase/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PromptListProps {
  projectName: string;
}

// Cycle descriptions mapping
const cycleDescriptions: { [key: number]: { name: string; description: string; color: string } } = {
  1: { name: 'Research', description: 'Initial research and discovery phase', color: 'bg-blue-600' },
  2: { name: 'Innovate', description: 'Brainstorming and innovation phase', color: 'bg-purple-600' },
  3: { name: 'Plan', description: 'Detailed planning and strategy phase', color: 'bg-amber-600' },
  4: { name: 'Execute 1', description: 'First execution phase', color: 'bg-green-600' },
  5: { name: 'Execute 2', description: 'Second execution phase', color: 'bg-green-700' },
  6: { name: 'Execute 3', description: 'Final execution phase', color: 'bg-green-800' },
  7: { name: 'Review', description: 'Review and retrospective phase', color: 'bg-pink-600' }
};

type SortField = 'id' | 'page' | 'domain' | 'prompt_cycle_number' | 'times_used' | 'created_at' | 'last_used' | 'model';
type SortDirection = 'asc' | 'desc';

export const PromptList: React.FC<PromptListProps> = ({ projectName }) => {
  const [prompts, setPrompts] = useState<ProjectPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isDebugVisible, setIsDebugVisible] = useState(false);
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedPrompt, setSelectedPrompt] = useState<ProjectPrompt | null>(null);

  const fetchPrompts = async (search?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching prompts for project: "${projectName}" (exact case), search: ${search || 'none'}`);
      console.log(`Table name being used: ${autoPromptsService.getTableName ? autoPromptsService.getTableName() : 'Not available'}`);
      
      let response;
      
      if (search && search.trim().length > 2) {
        // Use search function if search term is provided and has at least 3 characters
        console.log('Using searchProjectPrompts method');
        response = await autoPromptsService.searchProjectPrompts(projectName, search.trim());
      } else {
        // Use regular fetch if no search term or search term is too short
        console.log('Using getProjectPrompts method');
        response = await autoPromptsService.getProjectPrompts(projectName);
      }
      
      const { data, error, count } = response;
      
      if (error) {
        console.error('Error fetching prompts:', error);
        setError(error.message);
        return;
      }
      
      console.log(`Fetched ${data?.length || 0} prompts out of ${count} total`);
      console.log('First prompt (if available):', data && data.length > 0 ? data[0] : 'No prompts found');
      setPrompts(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Failed to fetch prompts:', err);
      setError('Failed to fetch prompts');
    } finally {
      setLoading(false);
    }
  };

  // Direct database test bypassing the service layer
  const testDirectDatabaseConnection = async () => {
    setDebugInfo({ status: 'loading' });
    try {
      // Direct query to the database
      const { data, error, count } = await supabase
        .from('project_prompts')
        .select('*', { count: 'exact' })
        .ilike('project', projectName)
        .limit(5);
        
      setDebugInfo({
        status: 'success',
        result: {
          data: data,
          error: error ? String(error) : null,
          count: count || 0,
          query: `SELECT * FROM project_prompts WHERE project ILIKE '${projectName}' LIMIT 5`
        }
      });
    } catch (err) {
      setDebugInfo({
        status: 'error',
        error: String(err)
      });
    }
  };

  // Create a debounced version of fetchPrompts for search
  const debouncedSearch = React.useCallback(
    debounce((term: string) => {
      fetchPrompts(term);
    }, 300),
    [projectName]
  );

  // Initial fetch on component mount
  useEffect(() => {
    if (projectName) {
      fetchPrompts();
    }
  }, [projectName]);

  // Handle search changes
  useEffect(() => {
    if (projectName) {
      if (searchTerm.trim().length > 2) {
        debouncedSearch(searchTerm);
      } else if (searchTerm.trim().length === 0) {
        // When search is cleared, fetch all prompts
        fetchPrompts();
      }
    }
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleRefresh = () => {
    fetchPrompts(searchTerm.trim().length > 2 ? searchTerm : undefined);
  };

  const handleDebug = async () => {
    console.log('Running debug for project:', projectName);
    try {
      const debugResult = await autoPromptsService.debugProjectPrompts(projectName);
      console.log('Debug complete, check console for details');
    } catch (err) {
      console.error('Debug failed:', err);
    }
  };

  const toggleDebugView = () => {
    setIsDebugVisible(!isDebugVisible);
  };

  const togglePromptExpand = (promptId: number) => {
    if (expandedPrompt === promptId) {
      setExpandedPrompt(null);
    } else {
      setExpandedPrompt(promptId);
    }
  };

  // Function to truncate text
  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Function to handle column sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort the prompts based on current sort settings
  const sortedPrompts = [...prompts].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    // Handle different field types
    switch (sortField) {
      case 'id':
        valueA = a.id || 0;
        valueB = b.id || 0;
        break;
      case 'page':
        valueA = a.page?.toLowerCase() || '';
        valueB = b.page?.toLowerCase() || '';
        break;
      case 'domain':
        valueA = a.domain?.toLowerCase() || '';
        valueB = b.domain?.toLowerCase() || '';
        break;
      case 'prompt_cycle_number':
        valueA = a.prompt_cycle_number || 0;
        valueB = b.prompt_cycle_number || 0;
        break;
      case 'times_used':
        valueA = a.times_used || 0;
        valueB = b.times_used || 0;
        break;
      case 'created_at':
        valueA = a.created_at ? new Date(a.created_at).getTime() : 0;
        valueB = b.created_at ? new Date(b.created_at).getTime() : 0;
        break;
      case 'last_used':
        valueA = a.last_used ? new Date(a.last_used).getTime() : 0;
        valueB = b.last_used ? new Date(b.last_used).getTime() : 0;
        break;
      case 'model':
        valueA = 'Claude 3.5 Sonnet';
        valueB = 'Claude 3.5 Sonnet';
        break;
      default:
        valueA = a.prompt_cycle_number || 0;
        valueB = b.prompt_cycle_number || 0;
    }

    // Handle the sort direction
    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });

  // Render sort arrow for column headers
  const renderSortArrow = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-3 w-3 inline ml-1" /> : 
      <ArrowDown className="h-3 w-3 inline ml-1" />;
  };

  // Format date in a friendly way
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get cycle badge component
  const getCycleBadge = (cycleNumber?: number) => {
    if (!cycleNumber || !cycleDescriptions[cycleNumber]) return null;
    
    const { name, color } = cycleDescriptions[cycleNumber];
    
    return (
      <Badge className={`text-white ${color}`}>
        {name}
      </Badge>
    );
  };

  // Group prompts by page to generate unique color shades
  const pageGroups = React.useMemo(() => {
    const pages = new Set(prompts.map(p => p.page));
    const pageMap = new Map<string, { shade: string, color: string }>();
    
    // Define distinct colors for different pages
    const pageColors = [
      'border-blue-600 text-blue-500',
      'border-purple-600 text-purple-500',
      'border-amber-600 text-amber-500',
      'border-green-600 text-green-500',
      'border-pink-600 text-pink-500',
      'border-teal-600 text-teal-500',
      'border-indigo-600 text-indigo-500',
      'border-rose-600 text-rose-500',
    ];
    
    Array.from(pages).forEach((page, index) => {
      // Alternate between more distinct shade levels
      const shade = index % 2 === 0 ? 'bg-gray-800/40' : 'bg-gray-800/20';
      const color = pageColors[index % pageColors.length];
      pageMap.set(page, { shade, color });
    });
    
    return pageMap;
  }, [prompts]);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-gray-900 rounded-lg shadow-md border border-gray-800">
      {/* Header section */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 border-gray-700 bg-gray-800 text-gray-200"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            title="Refresh prompts"
            className="h-10 px-3 border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-400">
            {searchTerm.trim().length > 0 ? 
              `Found ${prompts.length} results` : 
              `Total prompts: ${totalCount}`
            }
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-3 border border-gray-800 rounded-md bg-gray-800">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-700" />
                  <Skeleton className="h-4 w-[200px] bg-gray-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6">
          <Card className="bg-red-900/30 border-red-800">
            <CardContent className="p-4">
              <p className="text-red-300">Error: {error}</p>
              <Button 
                variant="outline" 
                className="mt-2 border-red-800 text-gray-200 hover:bg-red-900/40" 
                onClick={handleRefresh}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-9 gap-1 px-4 py-3 bg-gray-800 border-y border-gray-700 text-xs font-medium sticky top-0 z-10">
            <div className="flex items-center cursor-pointer hover:text-blue-400 transition-colors w-12" onClick={() => handleSort('id')}>
              ID {renderSortArrow('id')}
            </div>
            <div className="flex items-center justify-center w-12">
              Status
            </div>
            <div className="col-span-2 flex items-center cursor-pointer hover:text-blue-400 transition-colors" onClick={() => handleSort('page')}>
              Page {renderSortArrow('page')}
            </div>
            <div className="flex items-center cursor-pointer hover:text-blue-400 transition-colors" onClick={() => handleSort('domain')}>
              Domain {renderSortArrow('domain')}
            </div>
            <div className="flex items-center cursor-pointer hover:text-blue-400 transition-colors w-24" onClick={() => handleSort('prompt_cycle_number')}>
              Cycle {renderSortArrow('prompt_cycle_number')}
            </div>
            <div className="flex items-center cursor-pointer hover:text-blue-400 transition-colors col-span-2" onClick={() => handleSort('model')}>
              Model {renderSortArrow('model')}
            </div>
            <div className="flex items-center cursor-pointer hover:text-blue-400 transition-colors w-28" onClick={() => handleSort('times_used')}>
              Used {renderSortArrow('times_used')}
            </div>
            <div className="flex items-center cursor-pointer hover:text-blue-400 transition-colors" onClick={() => handleSort('last_used')}>
              Last Used {renderSortArrow('last_used')}
            </div>
          </div>

          <ScrollArea className="flex-1">
            {sortedPrompts.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gray-800 mb-4">
                  <Info className="h-10 w-10 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-1 text-gray-300">No prompts found</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Try adjusting your search or filters to find what you're looking for
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {sortedPrompts.map((prompt) => {
                  const pageStyle = prompt.page ? pageGroups.get(prompt.page) : undefined;
                  return (
                    <div 
                      key={prompt.id} 
                      className={`grid grid-cols-9 gap-1 px-4 py-3 text-sm hover:bg-gray-800/50 transition-colors relative ${pageStyle?.shade || ''}`}
                    >
                      {/* Vertical color indicator */}
                      {pageStyle && (
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${pageStyle.color.split(' ')[0]}`}></div>
                      )}
                      <div className="flex items-center font-mono text-xs text-gray-500 w-12">
                        {prompt.id}
                      </div>
                      <div className="flex items-center justify-center w-12">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              {prompt.is_done ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Play className="h-5 w-5 text-amber-500" />
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              {prompt.is_done ? "Completed" : "Active"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className={`font-medium truncate ${pageStyle?.color.split(' ')[1] || 'text-gray-200'}`}>
                          {prompt.page}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="font-normal text-gray-300 border-gray-700">
                          {prompt.domain || 'N/A'}
                        </Badge>
                      </div>
                      <div className="flex items-center w-24">
                        {getCycleBadge(prompt.prompt_cycle_number)}
                      </div>
                      <div className="flex items-center col-span-2">
                        <Badge variant="outline" className="font-normal bg-gray-800 border-gray-700 text-purple-300 whitespace-nowrap">
                          <Wand2 className="h-3 w-3 mr-1" />
                          Claude 3.5 Sonnet
                        </Badge>
                      </div>
                      <div className="flex items-center text-gray-300 w-28">
                        {prompt.times_used || 0}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDate(prompt.last_used)}
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedPrompt(prompt)}
                              className="ml-2 hover:bg-gray-700 text-gray-300"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-gray-900 border-gray-800 text-gray-200">
                            <DialogHeader>
                              <DialogTitle className="flex items-center pb-2 border-b border-gray-800">
                                <div className="flex-1">
                                  <span className="text-lg">#{prompt.id} - {prompt.page}</span>
                                  {prompt.prompt_cycle_number && cycleDescriptions[prompt.prompt_cycle_number] && (
                                    <Badge variant="secondary" className={`ml-2 text-white ${cycleDescriptions[prompt.prompt_cycle_number].color}`}>
                                      {cycleDescriptions[prompt.prompt_cycle_number].name}
                                    </Badge>
                                  )}
                                </div>
                                <Badge variant={prompt.is_done ? "success" : "warning"} className="ml-2">
                                  {prompt.is_done ? "Completed" : "Active"}
                                </Badge>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-6">
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div className="border border-gray-800 rounded-md p-3 bg-gray-800/50">
                                  <span className="block text-xs uppercase text-gray-500 mb-1">Domain</span>
                                  <span className="font-medium">{prompt.domain || 'N/A'}</span>
                                </div>
                                <div className="border border-gray-800 rounded-md p-3 bg-gray-800/50">
                                  <span className="block text-xs uppercase text-gray-500 mb-1">Model</span>
                                  <span className="font-medium text-purple-300">Claude 3.5 Sonnet</span>
                                </div>
                                <div className="border border-gray-800 rounded-md p-3 bg-gray-800/50">
                                  <span className="block text-xs uppercase text-gray-500 mb-1">Times Used</span>
                                  <span className="font-medium">{prompt.times_used || 0}</span>
                                </div>
                                <div className="border border-gray-800 rounded-md p-3 bg-gray-800/50">
                                  <span className="block text-xs uppercase text-gray-500 mb-1">Last Used</span>
                                  <span className="font-medium">{formatDate(prompt.last_used)}</span>
                                </div>
                              </div>
                              
                              {prompt.prompt_cycle_number && cycleDescriptions[prompt.prompt_cycle_number] && (
                                <div className="bg-gray-800/30 p-4 rounded-md border border-gray-800">
                                  <h4 className="text-sm font-medium mb-2">Cycle Description</h4>
                                  <p className="text-sm text-gray-400">
                                    {cycleDescriptions[prompt.prompt_cycle_number].description}
                                  </p>
                                </div>
                              )}
                              
                              <div>
                                <h4 className="text-sm font-medium mb-2">Prompt Content</h4>
                                <div className="bg-gray-800 p-5 rounded-md whitespace-pre-wrap text-sm font-mono border border-gray-700 overflow-auto max-h-[300px] text-gray-300">
                                  {prompt.prompt}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}; 