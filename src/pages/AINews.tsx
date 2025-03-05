
import { useState, useEffect } from 'react';
import { useNewsItems } from '@/hooks/useNewsItems';
import NewsFilters from '@/components/ai-news/NewsFilters';
import FeaturedNewsHero from '@/components/ai-news/FeaturedNewsHero';
import { NewsContent } from '@/components/ai-news/NewsContent';
import { NewsHeader } from '@/components/ai-news/NewsHeader'; // Fixed import to use named export
import { NewsErrorBoundary } from '@/components/ai-news/NewsErrorBoundary';
import { DailyStatsOverview } from '@/components/ai-news/DailyStatsOverview';
import { DateNavigation } from '@/components/ai-news/DateNavigation';
import { NewsDateSection } from '@/components/ai-news/NewsDateSection';
import { Helmet } from 'react-helmet';
import { Sidebar } from '@/components/Sidebar';
import NewsPagination from '@/components/ai-news/NewsPagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  CalendarDays, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Database, 
  RefreshCw, 
  Bug, 
  Terminal,
  CalendarClock
} from 'lucide-react';
import { format, subDays, isToday } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';

// [Analysis] Main component for the AI News page with date-based navigation and testing panel
const AINews = () => {
  // [Analysis] State for filters, search, and pagination
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTestPanel, setShowTestPanel] = useState(true); // Changed to true to make it visible by default
  const [testKeyword, setTestKeyword] = useState('artificial intelligence');
  const [testLimit, setTestLimit] = useState(10);
  const [testSource, setTestSource] = useState<'event_registry' | 'news_api'>('event_registry');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [isApiResponseOpen, setIsApiResponseOpen] = useState(false);
  const [testMode, setTestMode] = useState(true); // Added state for test mode

  // Control toggle for fetch history panel visibility - now defaulting to false
  const [showFetchHistory, setShowFetchHistory] = useState(false);
  
  const itemsPerPage = 12; // Same as PAGE_SIZE in useNewsItems

  const { 
    newsItems, 
    summaries, 
    loadingSummaries, 
    generateSummary, 
    loading,
    initialLoading,
    syncingNews,
    hasMore,
    totalCount,
    lastSync,
    apiUsage,
    articleCount,
    activeNewsSource,
    currentDate,
    dateRange,
    goToNextDay,
    goToPreviousDay,
    goToDate,
    syncResult,
    error,
    refresh,
    syncNews
  } = useNewsItems(
    selectedCategory, 
    'published', 
    selectedDate, 
    currentPage, 
    itemsPerPage
  );

  console.log('Rendering AINews component with', newsItems.length, 'news items');
  console.log('Current date:', format(currentDate, 'yyyy-MM-dd'));
  console.log('Date range:', dateRange);
  console.log('Loading state:', loading);

  
  // [Analysis] Find featured article with priority on featured flag and then on views
  const featuredArticle = newsItems.find(item => item.featured) || 
    [...newsItems].sort((a, b) => (b.views || 0) - (a.views || 0))[0];

  
  // [Analysis] Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  
  // [Analysis] Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  
  // [Analysis] Handle category change
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  
  // [Analysis] Handle date change through direct date picker
  const handleDateChange = (date: string | null) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset to first page on date change
  };

  
  // [Analysis] Handle date navigation via date picker
  const handleSelectDate = (date: Date) => {
    if (date) {
      goToDate(date);
      // Clear any category filters when changing date
      if (selectedCategory) {
        setSelectedCategory(null);
      }
      // Clear search query when changing date
      if (searchQuery) {
        setSearchQuery('');
      }
    }
  };

  
  // [Analysis] Handle API test execution with enhanced error tracking
  const handleTestAPI = async () => {
    setApiResponse('');
    try {
      const startTime = Date.now();
      
      // Capture raw response for debugging
      const result = await syncNews(testKeyword, testLimit, testSource, testMode);
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      setApiResponse(JSON.stringify(result, null, 2));
      
      toast({
        title: `API ${testMode ? 'Test' : 'Import'} ${result.success ? 'Succeeded' : 'Failed'}`,
        description: `Request took ${duration.toFixed(2)}s. ${result.count || 0} articles ${testMode ? 'found' : 'imported'}.`,
        variant: result.success ? 'default' : 'destructive'
      });
      
      // Auto-expand the API response section if there's an error or no articles
      if (!result.success || (result.articles && result.articles.length === 0)) {
        setIsApiResponseOpen(true);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setApiResponse(JSON.stringify({ 
        error: errorMessage,
        timestamp: new Date().toISOString()
      }, null, 2));
      setIsApiResponseOpen(true);
      
      // Error is already handled in syncNews
    }
  };

  
  // [Analysis] Calculate total pages
  const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : 0;

  // Determine when to show the stats - we'll pass this to NewsHeader instead of using duplicate components
  const showStats = isToday(currentDate) && !searchQuery && !selectedCategory;

  // [Analysis] Added here to handle tab state for NewsHeader component
  const [activeTab, setActiveTab] = useState('all');
  
  // [Analysis] Handle tab change for NewsHeader
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset other filters when changing tabs
    if (searchQuery) {
      setSearchQuery('');
    }
    // We could potentially add other filtering logic here based on the active tab
  };

  return (
    <div className="flex min-h-screen bg-siso-bg">
      <Helmet>
        <title>AI News | Your One-Stop AI Knowledge Source</title>
        <meta name="description" content="Stay updated with the latest news in artificial intelligence, machine learning, and AI tools." />
      </Helmet>
      
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20">
        <div className="flex justify-between items-center">
          <NewsHeader 
            title="AI News" 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            showStats={false} // Don't show stats here - it's creating duplicates
            showApiStatus={false} // Don't show API status here - it's creating duplicates
            showFetchHistory={false} // Don't show fetch history here - it's creating duplicates
            newsItems={newsItems}
            lastSync={lastSync}
            articleCount={articleCount}
            apiUsage={apiUsage}
            syncingNews={syncingNews}
            activeNewsSource={activeNewsSource}
            syncNews={syncNews}
          />
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-8">
                  <Database className="h-4 w-4" />
                  API Status
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">News API Status</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span>{lastSync || 'Never'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Active Source:</span>
                      <span className="capitalize">{activeNewsSource}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">API Usage:</span>
                      <span>{apiUsage.toFixed(1)}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Articles this month:</span>
                      <span>{articleCount}</span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 h-8 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50"
              onClick={() => setShowFetchHistory(!showFetchHistory)}
            >
              <CalendarClock className="h-4 w-4" />
              {showFetchHistory ? 'Hide Automation' : 'Fetch History'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 h-8 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 border-yellow-500/50"
              onClick={() => setShowTestPanel(!showTestPanel)}
            >
              <Sparkles className="h-4 w-4" />
              {showTestPanel ? 'Hide Test Panel' : 'Test API'}
            </Button>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "There was an error loading the news."}
            </AlertDescription>
          </Alert>
        )}
        
        {showFetchHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <FetchHistoryPanel onRefresh={() => syncNews('artificial intelligence', 30, 'event_registry', false)} />
          </motion.div>
        )}
        
        
        {showTestPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card className="border-dashed border-yellow-500/30 bg-yellow-950/10">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  API Testing Panel
                </CardTitle>
                <CardDescription>
                  Test the Event Registry API integration to retrieve fresh news articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="test" className="w-full">
                  <TabsList>
                    <TabsTrigger value="test">Test API</TabsTrigger>
                    <TabsTrigger value="results">Test Results</TabsTrigger>
                    <TabsTrigger value="debug">Debug</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="test" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="keyword">Keyword</Label>
                        <Input 
                          id="keyword" 
                          value={testKeyword} 
                          onChange={(e) => setTestKeyword(e.target.value)}
                          placeholder="e.g., artificial intelligence"
                          className="w-full" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="limit">Article Limit</Label>
                        <Input 
                          id="limit" 
                          type="number" 
                          value={testLimit} 
                          onChange={(e) => setTestLimit(parseInt(e.target.value) || 10)}
                          min={1}
                          max={50}
                          className="w-full" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="source">News Source</Label>
                        <Select 
                          value={testSource} 
                          onValueChange={(value) => setTestSource(value as 'event_registry' | 'news_api')}
                        >
                          <SelectTrigger id="source" className="w-full">
                            <SelectValue placeholder="Select news source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="event_registry">Event Registry</SelectItem>
                            <SelectItem value="news_api">News API</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="testMode">Mode</Label>
                        <div className="flex items-center justify-between border rounded p-3">
                          <span className="text-sm">Test Only Mode</span>
                          <Switch 
                            id="testMode" 
                            checked={testMode} 
                            onCheckedChange={setTestMode} 
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {testMode 
                            ? "Test mode only retrieves articles without saving to database" 
                            : "Import mode will save articles to the database"}
                        </p>
                      </div>
                    </div>
                    
                    <Collapsible 
                      open={isApiResponseOpen}
                      onOpenChange={setIsApiResponseOpen}
                      className="mt-4 border rounded-md"
                    >
                      <CollapsibleTrigger asChild>
                        <div className="p-3 border-b flex justify-between items-center cursor-pointer hover:bg-white/5">
                          <div className="flex items-center gap-2">
                            <Terminal className="h-4 w-4 text-blue-400" />
                            <h4 className="text-sm font-medium">Raw API Response</h4>
                          </div>
                          <Badge variant="outline" className={apiResponse ? "bg-blue-500/10" : "bg-gray-500/10"}>
                            {apiResponse ? "Data Available" : "No Data"}
                          </Badge>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-3">
                          <Textarea
                            value={apiResponse}
                            readOnly
                            className="font-mono text-xs h-48 bg-slate-950"
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </TabsContent>
                  
                  <TabsContent value="results" className="mt-4">
                    {syncResult ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className={`text-lg font-medium ${syncResult.success ? 'text-green-400' : 'text-red-400'}`}>
                              {syncResult.success ? 'Success' : 'Error'}
                            </h3>
                            <p className="text-sm text-muted-foreground">{syncResult.message}</p>
                          </div>
                          
                          {syncResult.success && (
                            <Badge variant="outline" className={
                              syncResult.count && syncResult.count > 0 
                                ? "bg-green-500/10 text-green-400" 
                                : "bg-orange-500/10 text-orange-400"
                            }>
                              {syncResult.count || 0} articles {testMode ? 'found' : 'imported'}
                            </Badge>
                          )}
                        </div>
                        
                        {syncResult.articles && syncResult.articles.length > 0 ? (
                          <div className="border rounded-md">
                            <h4 className="text-sm font-medium p-3 border-b">Sample Articles</h4>
                            <ScrollArea className="h-60">
                              <div className="divide-y">
                                {syncResult.articles.slice(0, 5).map((article, index) => (
                                  <div key={article.id || index} className="p-3 hover:bg-white/5">
                                    <h5 className="font-medium truncate">{article.title}</h5>
                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                      <span>{article.date ? new Date(article.date).toLocaleDateString() : 'No date'}</span>
                                      <span className="capitalize">{article.source}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        ) : (
                          <Alert variant="default" className="bg-orange-950/10 border-orange-500/30 text-orange-300">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>No Articles Found</AlertTitle>
                            <AlertDescription>
                              The API request was successful, but no articles were returned. This could be due to:
                              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                                <li>API key configuration issues</li>
                                <li>No articles matching your search criteria</li>
                                <li>No articles matching your search criteria</li>
                                <li>API rate limiting or quota restrictions</li>
                                <li>Date range limitations</li>
                              </ul>
                              Check the Debug tab for more details.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No test results yet. Run a test to see results here.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="debug" className="mt-4">
                    <div className="space-y-4">
                      <Alert variant="default" className="bg-blue-950/10 border-blue-500/30 text-blue-300">
                        <Bug className="h-4 w-4" />
                        <AlertTitle>Debug Information</AlertTitle>
                        <AlertDescription>
                          This panel shows debugging information to help troubleshoot API issues.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-slate-950/50">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm">API Status</CardTitle>
                          </CardHeader>
                          <CardContent className="py-0">
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Sync</span>
                                <span>{lastSync || 'Never'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Active Source</span>
                                <span>{activeNewsSource}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Database Articles</span>
                                <span>{articleCount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Current Date</span>
                                <span>{new Date().toISOString().split('T')[0]}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-slate-950/50">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm">Test Parameters</CardTitle>
                          </CardHeader>
                          <CardContent className="py-0">
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Keyword</span>
                                <span>{testKeyword}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Limit</span>
                                <span>{testLimit}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Source</span>
                                <span>{testSource}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Mode</span>
                                <span>{testMode ? 'Test Only' : 'Import'}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="border rounded-md overflow-hidden">
                        <div className="bg-slate-950 p-3 border-b">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Terminal className="h-4 w-4" />
                            Check Edge Function Logs
                          </h4>
                        </div>
                        <div className="p-4 text-sm">
                          <p className="mb-4">If your test is failing, check the Edge Function logs in the Supabase dashboard for detailed error information.</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`https://supabase.com/dashboard/project/fzuwsjxjymwcjsbpwfsl/functions/fetch-ai-news/logs`, '_blank')}
                            className="gap-2"
                          >
                            <Terminal className="h-4 w-4" />
                            View Logs in Supabase
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="justify-end pt-0">
                <Button 
                  onClick={handleTestAPI} 
                  disabled={syncingNews}
                  className="gap-2"
                  variant={testMode ? "default" : "destructive"}
                >
                  {syncingNews ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      {testMode ? 'Testing...' : 'Importing...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {testMode ? 'Test API' : 'Import Articles'}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
        
        
        <DateNavigation 
          currentDate={currentDate}
          dateRange={dateRange}
          onPreviousDay={goToPreviousDay}
          onNextDay={goToNextDay}
          onSelectDate={handleSelectDate}
          loading={loading}
        />
        
        
        <div className="mb-6">
          <div className="w-full">
            <NewsFilters
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onDateChange={handleDateChange}
              selectedDate={selectedDate}
            />
          </div>
        </div>
        
        
        {/* Show the DailyStatsOverview component here if needed */}
        {showStats && (
          <DailyStatsOverview 
            newsItems={newsItems} 
            lastSync={lastSync}
            articleCount={articleCount}
            loading={loading}
          />
        )}
        
        
        {featuredArticle && showStats && (
          <FeaturedNewsHero 
            article={featuredArticle}
            onGenerateSummary={generateSummary}
            summary={summaries[featuredArticle.id] || ""}
            loadingSummary={loadingSummaries[featuredArticle.id] || false}
          />
        )}
        
        
        <NewsErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDate.toISOString() + (searchQuery || '') + (selectedCategory || '')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {searchQuery ? (
                
                <NewsContent
                  newsItems={newsItems}
                  searchQuery={searchQuery}
                  summaries={summaries}
                  loadingSummaries={loadingSummaries}
                  onGenerateSummary={generateSummary}
                  loading={loading}
                  hasMore={hasMore}
                  onLoadMore={refresh}
                />
              ) : (
                
                <NewsDateSection
                  date={format(currentDate, 'yyyy-MM-dd')}
                  newsItems={newsItems}
                  summaries={summaries}
                  loadingSummaries={loadingSummaries}
                  onGenerateSummary={generateSummary}
                  loading={loading}
                />
              )}
            </motion.div>
          </AnimatePresence>
          
          
          {searchQuery && totalPages > 1 && (
            <div className="mt-8">
              <NewsPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </NewsErrorBoundary>
      </main>
    </div>
  );
};

export default AINews;
