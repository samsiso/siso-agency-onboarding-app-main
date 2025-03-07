import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { NewsItem } from '@/types/blog';
import { DuplicatesCheckDialog } from './DuplicatesCheckDialog';

// [Analysis] Enhanced admin panel with more visualization of where articles come from
interface AdminControlsProps {
  dateRange?: string[];
  syncNews?: (keyword?: string, limit?: number, source?: 'event_registry' | 'news_api', testMode?: boolean, skipDuplicates?: boolean, dateOverride?: string | null) => Promise<any>;
  syncingNews?: boolean;
  syncResult?: {
    success: boolean;
    message: string;
    count?: number;
    articles?: NewsItem[];
    duplicatesSkipped?: number;
    sourceDetails?: any;
  } | null;
  apiUsage?: number;
  lastSync?: string | null;
  articleCount?: number;
}

export const AdminControls = ({
  dateRange,
  syncNews = async () => ({}),
  syncingNews = false,
  syncResult = null,
  apiUsage = 0,
  lastSync = null,
  articleCount = 0
}: AdminControlsProps) => {
  const [keyword, setKeyword] = useState('artificial intelligence');
  const [limit, setLimit] = useState('100');
  const [showDuplicatesDialog, setShowDuplicatesDialog] = useState(false);
  const [source, setSource] = useState<'event_registry' | 'news_api'>('event_registry');
  const [testMode, setTestMode] = useState(false);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bulkStartDate, setBulkStartDate] = useState<Date | undefined>(new Date());
  const [bulkEndDate, setBulkEndDate] = useState<Date | undefined>(new Date());
  const [bulkArticlesPerDay, setBulkArticlesPerDay] = useState('100');
  const [bulkGenerating, setBulkGenerating] = useState(false);
  
  const handleSync = async () => {
    if (syncingNews) return;
    
    try {
      // Format date as YYYY-MM-DD if selected
      const dateOverride = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
      
      await syncNews(
        keyword, 
        parseInt(limit), 
        source, 
        testMode, 
        skipDuplicates, 
        dateOverride
      );
    } catch (error) {
      console.error('Error syncing news:', error);
    }
  };
  
  // Bulk generation function to create articles for a date range
  const handleBulkGeneration = async () => {
    if (syncingNews || bulkGenerating || !bulkStartDate || !bulkEndDate) return;
    
    try {
      setBulkGenerating(true);
      
      // Calculate the number of days between start and end dates
      const startTimestamp = bulkStartDate.getTime();
      const endTimestamp = bulkEndDate.getTime();
      const dayDiff = Math.ceil((endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24)) + 1;
      
      if (dayDiff <= 0) {
        alert('End date must be after or the same as start date');
        setBulkGenerating(false);
        return;
      }
      
      // Generate articles for each day in the range
      const articlesPerDay = parseInt(bulkArticlesPerDay) || 100;
      let totalGenerated = 0;
      
      for (let i = 0; i < dayDiff; i++) {
        const currentDate = new Date(startTimestamp + (i * 24 * 60 * 60 * 1000));
        const dateOverride = format(currentDate, 'yyyy-MM-dd');
        
        // Generate articles for this date
        const result = await syncNews(
          keyword,
          articlesPerDay,
          source,
          false, // Not in test mode for bulk generation
          skipDuplicates,
          dateOverride
        );
        
        if (result && result.count) {
          totalGenerated += result.count;
        }
      }
      
      alert(`Successfully generated ${totalGenerated} articles across ${dayDiff} days. Each day now has approximately ${articlesPerDay} articles.`);
    } catch (error) {
      console.error('Error in bulk generation:', error);
      alert(`Error during bulk generation: ${error.message || 'Unknown error'}`);
    } finally {
      setBulkGenerating(false);
    }
  };
  
  return (
    <Card className="bg-gray-900/30 border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          API Testing Panel
          <span className="text-xs bg-yellow-900/40 text-yellow-400 px-2 py-0.5 rounded-full">
            Mock Data Generation
          </span>
        </CardTitle>
        <CardDescription>
          Test API integration and generate mock news articles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="settings">
          <TabsList className="mb-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="status">API Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Search Keyword</Label>
                <Input 
                  id="keyword" 
                  value={keyword} 
                  onChange={(e) => setKeyword(e.target.value)} 
                  placeholder="artificial intelligence"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limit">Number of Articles</Label>
                <Input 
                  id="limit" 
                  type="number" 
                  value={limit} 
                  onChange={(e) => setLimit(e.target.value)}
                  min="1"
                  max="100"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>API Source</Label>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setSource('event_registry')} 
                    variant={source === 'event_registry' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Event Registry
                  </Button>
                  <Button 
                    onClick={() => setSource('news_api')}
                    variant={source === 'news_api' ? 'default' : 'outline'}
                    size="sm"
                  >
                    News API
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Generation Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={() => setTestMode(!testMode)}
                    variant={testMode ? 'default' : 'outline'}
                    size="sm"
                  >
                    {testMode ? 'Test Mode ON' : 'Test Mode OFF'}
                  </Button>
                  <Button 
                    onClick={() => setSkipDuplicates(!skipDuplicates)}
                    variant={skipDuplicates ? 'default' : 'outline'}
                    size="sm"
                  >
                    {skipDuplicates ? 'Skip Duplicates' : 'Allow Duplicates'}
                  </Button>
                </div>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSync}
                  disabled={syncingNews}
                  className="w-full"
                >
                  {syncingNews ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Articles'
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-4">
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-md p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-400">Bulk Generation Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    This will generate multiple articles for each day in the selected date range. 
                    Use this to populate your database with mock data for testing purposes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bulkStartDate ? format(bulkStartDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bulkStartDate}
                      onSelect={setBulkStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bulkEndDate ? format(bulkEndDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bulkEndDate}
                      onSelect={setBulkEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="articlesPerDay">Articles Per Day</Label>
                <Input 
                  id="articlesPerDay" 
                  type="number" 
                  value={bulkArticlesPerDay} 
                  onChange={(e) => setBulkArticlesPerDay(e.target.value)}
                  min="1"
                  max="200"
                />
                <p className="text-xs text-muted-foreground">
                  Number of articles to generate for each day in the range (max 200)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="keyword">Search Keyword</Label>
                <Input 
                  id="keyword" 
                  value={keyword} 
                  onChange={(e) => setKeyword(e.target.value)} 
                  placeholder="artificial intelligence"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleBulkGeneration}
              disabled={bulkGenerating || syncingNews || !bulkStartDate || !bulkEndDate}
              className="w-full mt-4"
              variant="default"
            >
              {bulkGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Bulk Content...
                </>
              ) : (
                'Generate Articles for Date Range'
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            {syncResult ? (
              <div className={`bg-${syncResult.success ? 'green' : 'red'}-900/20 border border-${syncResult.success ? 'green' : 'red'}-800 rounded-md p-4`}>
                <div className="flex items-start gap-2">
                  {syncResult.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-medium text-${syncResult.success ? 'green' : 'red'}-400`}>
                      {syncResult.success ? 'Success' : 'Error'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {syncResult.message}
                    </p>
                    {syncResult.sourceDetails && (
                      <div className="mt-2 text-xs bg-gray-800/50 p-2 rounded">
                        <p><strong>Generation Type:</strong> {syncResult.sourceDetails.generationType}</p>
                        <p><strong>Generated For:</strong> {syncResult.sourceDetails.generatedFor}</p>
                        <p><strong>Generated At:</strong> {new Date(syncResult.sourceDetails.generated_at).toLocaleString()}</p>
                      </div>
                    )}
                    {syncResult.count !== undefined && (
                      <p className="mt-2 text-sm">
                        <span className="font-medium">Articles Added:</span> {syncResult.count}
                      </p>
                    )}
                    {syncResult.duplicatesSkipped !== undefined && (
                      <p className="text-sm">
                        <span className="font-medium">Duplicates Skipped:</span> {syncResult.duplicatesSkipped}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Run a generation to see results here
              </p>
            )}
            
            {syncResult && syncResult.articles && syncResult.articles.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Generated Articles</h4>
                  {syncResult.articles.some((article: NewsItem) => article.isDuplicate) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDuplicatesDialog(true)}
                    >
                      Check Duplicates
                    </Button>
                  )}
                </div>
                <div className="bg-gray-800/50 rounded-md p-3 max-h-[300px] overflow-y-auto">
                  <ul className="space-y-2">
                    {syncResult.articles.map((article: NewsItem, index: number) => (
                      <li key={article.id} className={`text-sm p-2 rounded border ${article.isDuplicate ? 'border-yellow-800 bg-yellow-900/20' : 'border-gray-700'}`}>
                        <div className="flex justify-between items-start">
                          <div className="font-medium">
                            {article.title}
                            {article.isDuplicate && (
                              <span className="ml-2 text-xs bg-yellow-900/40 text-yellow-400 px-1.5 py-0.5 rounded-full">
                                Duplicate
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {article.date}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Source: {article.source} | Category: {article.category?.replace(/_/g, ' ')}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="status" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>API Usage</Label>
                <span className="text-sm">{apiUsage.toFixed(1)}%</span>
              </div>
              <Progress value={apiUsage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-800/50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Database Info</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Articles:</span>
                    <span>{articleCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Sync:</span>
                    <span>{lastSync || 'Never'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available Dates:</span>
                    <span>{dateRange?.length || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Data Sources</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Mock Data Generator (Event Registry)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Mock Data Generator (News API)</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Note: All data is currently generated using mock generators for testing purposes.
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {showDuplicatesDialog && syncResult?.articles && (
        <DuplicatesCheckDialog
          open={showDuplicatesDialog}
          articles={syncResult.articles}
          onClose={() => setShowDuplicatesDialog(false)}
          onRefresh={() => syncNews(keyword, parseInt(limit), source, testMode)}
          loading={syncingNews}
          onImport={async (skipDuplicates) => {
            await syncNews(keyword, parseInt(limit), source, false, skipDuplicates);
          }}
        />
      )}
    </Card>
  );
};
