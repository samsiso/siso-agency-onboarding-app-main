
import { useState, useEffect } from 'react';
import { useNewsItems } from '@/hooks/useNewsItems';
import NewsFilters from '@/components/ai-news/NewsFilters';
import FeaturedNewsHero from '@/components/ai-news/FeaturedNewsHero';
import { NewsContent } from '@/components/ai-news/NewsContent';
import NewsHeader from '@/components/ai-news/NewsHeader';
import { NewsErrorBoundary } from '@/components/ai-news/NewsErrorBoundary';
import { DailyStatsOverview } from '@/components/ai-news/DailyStatsOverview';
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
import { CalendarDays, Clock, AlertCircle, Sparkles, Database, RefreshCw } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

// [Analysis] Main component for the AI News page with improved visualization for news metrics
const AINews = () => {
  // [Analysis] State for filters, search, and pagination
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRecent, setShowRecent] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(true); // Changed to true to make it visible by default
  const [testKeyword, setTestKeyword] = useState('artificial intelligence');
  const [testLimit, setTestLimit] = useState(10);
  const [testSource, setTestSource] = useState<'event_registry' | 'news_api'>('event_registry');
  const itemsPerPage = 12; // Same as PAGE_SIZE in useNewsItems

  const { 
    newsItems, 
    summaries, 
    loadingSummaries, 
    generateSummary, 
    loading,
    syncingNews,
    hasMore,
    totalCount,
    lastSync,
    apiUsage,
    articleCount,
    activeNewsSource,
    syncResult,
    error,
    refresh,
    syncNews
  } = useNewsItems(
    selectedCategory, 
    'published', 
    showRecent ? format(subDays(new Date(), 7), 'yyyy-MM-dd') : selectedDate, 
    currentPage, 
    itemsPerPage
  );

  console.log('Rendering AINews component with', newsItems.length, 'news items');
  console.log('Last sync:', lastSync);
  console.log('Article count:', articleCount);
  console.log('Loading state:', loading);
  console.log('Error state:', error ? (error instanceof Error ? error.message : String(error)) : 'none');

  // [Analysis] Find featured article with priority on featured flag and then on views
  const featuredArticle = newsItems.find(item => item.featured) || 
    [...newsItems].sort((a, b) => (b.views || 0) - (a.views || 0))[0];

  if (featuredArticle) {
    console.log('Featured article found:', featuredArticle.id, featuredArticle.title);
  } else {
    console.log('No featured article available');
  }

  // [Analysis] Add scroll restoration to preserve user's position
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCategory, selectedDate, currentPage, showRecent]);

  // [Analysis] Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
    
    // [Analysis] Disable recent filter when searching
    if (query && showRecent) {
      setShowRecent(false);
    }
  };

  // [Analysis] Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // [Analysis] Handle recent toggle
  const toggleRecent = () => {
    if (showRecent) {
      setShowRecent(false);
    } else {
      setShowRecent(true);
      setSelectedDate(null); // Clear any date filter
      setCurrentPage(1); // Reset to first page
      toast({
        title: "Showing recent articles",
        description: "Displaying articles published in the last 7 days",
      });
    }
  };

  // [Analysis] Handle category change
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  // [Analysis] Handle date change
  const handleDateChange = (date: string | null) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset to first page on date change
    
    // [Analysis] Disable recent filter when selecting a specific date
    if (date && showRecent) {
      setShowRecent(false);
    }
  };

  // [Analysis] Handle API test execution
  const handleTestAPI = async () => {
    try {
      await syncNews(testKeyword, testLimit, testSource, true);
    } catch (error) {
      // Error is already handled in syncNews
    }
  };

  // [Analysis] Calculate total pages
  const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : 0;

  // Determine when to show the stats and featured article
  const showStatsAndFeatured = !searchQuery && !selectedDate && !selectedCategory && currentPage === 1;

  return (
    <div className="flex min-h-screen bg-siso-bg">
      <Helmet>
        <title>AI News | Your One-Stop AI Knowledge Source</title>
        <meta name="description" content="Stay updated with the latest news in artificial intelligence, machine learning, and AI tools." />
      </Helmet>
      
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20">
        <div className="flex justify-between items-center">
          <NewsHeader title="AI News" />
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
                    </div>
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
                            <Badge variant="outline" className="bg-green-500/10 text-green-400">
                              {syncResult.count} articles
                            </Badge>
                          )}
                        </div>
                        
                        {syncResult.articles && syncResult.articles.length > 0 && (
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
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No test results yet. Run a test to see results here.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="justify-end pt-0">
                <Button 
                  onClick={handleTestAPI} 
                  disabled={syncingNews}
                  className="gap-2"
                >
                  {syncingNews ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Test API
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
        
        <div className="mb-8">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <Button 
                variant={showRecent ? "default" : "outline"}
                size="sm"
                onClick={toggleRecent}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Recently Published
              </Button>
              
              {showRecent && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Last 7 days</span>
                </div>
              )}
            </div>
            
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
        
        <NewsErrorBoundary>
          {/* Daily Stats Overview - Only show on homepage view */}
          {showStatsAndFeatured && (
            <div className="mb-8">
              <DailyStatsOverview 
                newsItems={newsItems} 
                lastSync={lastSync}
                articleCount={articleCount}
                loading={loading}
              />
            </div>
          )}
          
          {/* Featured Article - Only show on homepage view */}
          {featuredArticle && showStatsAndFeatured && !showRecent && (
            <div className="mb-8">
              <FeaturedNewsHero 
                article={featuredArticle}
                onGenerateSummary={generateSummary}
                summary={summaries[featuredArticle.id] || ""}
                loadingSummary={loadingSummaries[featuredArticle.id] || false}
              />
            </div>
          )}
          
          <NewsContent
            newsItems={showStatsAndFeatured && !showRecent && featuredArticle ? 
              newsItems.filter(item => item.id !== featuredArticle.id) : 
              newsItems}
            searchQuery={searchQuery}
            summaries={summaries}
            loadingSummaries={loadingSummaries}
            onGenerateSummary={generateSummary}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={refresh}
          />
          
          {totalPages > 1 && (
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
