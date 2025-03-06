
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAiDailySummary } from '@/hooks/useAiDailySummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SummaryContent } from './SummaryContent';

// [Analysis] Test component to verify summary generation with detailed feedback
export function TestSummaryGenerator() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('generator');
  const [logs, setLogs] = useState<string[]>([]);
  const [jsonView, setJsonView] = useState<string>('');
  
  // [Analysis] Use the hook with admin privileges to allow generation
  const {
    summaryData,
    loading,
    generating,
    error,
    fetchSummary,
    generateSummary
  } = useAiDailySummary(date, true);
  
  // Handler to add a log message with timestamp
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };
  
  // Handler for date input change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };
  
  // Handler to fetch summary for the selected date
  const handleFetchSummary = async () => {
    addLog(`Fetching summary for date: ${date}`);
    try {
      await fetchSummary();
      addLog(`Summary fetch completed`);
      
      // Update JSON view
      if (summaryData) {
        setJsonView(JSON.stringify(summaryData, null, 2));
      }
    } catch (err) {
      addLog(`Error fetching summary: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Handler to generate a new summary
  const handleGenerateSummary = async () => {
    addLog(`Generating summary for date: ${date}`);
    try {
      await generateSummary(true); // Force refresh
      addLog(`Summary generation completed`);
      
      // Update JSON view
      if (summaryData) {
        setJsonView(JSON.stringify(summaryData, null, 2));
      }
    } catch (err) {
      addLog(`Error generating summary: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Format the date for display
  const formattedDate = date ? format(new Date(date), 'MMMM d, yyyy') : 'Select a date';
  
  // Update JSON view when summaryData changes
  React.useEffect(() => {
    if (summaryData) {
      setJsonView(JSON.stringify(summaryData, null, 2));
    }
  }, [summaryData]);

  return (
    <Card className="border-green-500/30 bg-green-950/10">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Summary Generator Test Tool</span>
            <span className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : generating ? 'Generating...' : 'Ready'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setLogs([]);
                setJsonView('');
              }}
            >
              Clear
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator" className="space-y-4 mt-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-sm mb-1 block">Date</label>
                <Input 
                  type="date" 
                  value={date} 
                  onChange={handleDateChange} 
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={handleFetchSummary} 
                variant="outline"
                disabled={loading || generating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Fetch
              </Button>
              <Button 
                onClick={handleGenerateSummary} 
                variant="default"
                disabled={loading || generating}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {generating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="rounded border p-4 bg-card">
              <h3 className="font-medium mb-1">Current Status</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Date:</div>
                <div>{formattedDate}</div>
                
                <div className="font-medium">Summary Exists:</div>
                <div>{summaryData ? 'Yes' : 'No'}</div>
                
                <div className="font-medium">Loading:</div>
                <div>{loading ? 'Yes' : 'No'}</div>
                
                <div className="font-medium">Generating:</div>
                <div>{generating ? 'Yes' : 'No'}</div>
                
                <div className="font-medium">Error:</div>
                <div className="text-red-400">{error || 'None'}</div>
                
                {summaryData && (
                  <>
                    <div className="font-medium">Generated With:</div>
                    <div>{summaryData.generated_with}</div>
                    
                    <div className="font-medium">Article Count:</div>
                    <div>{summaryData.article_count}</div>
                    
                    <div className="font-medium">Created At:</div>
                    <div>{new Date(summaryData.created_at).toLocaleString()}</div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-4">
            {summaryData ? (
              <SummaryContent 
                loading={loading} 
                summaryData={summaryData} 
                activeTab="summary" 
                setActiveTab={() => {}} 
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No summary data available. Generate or fetch a summary first.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="logs" className="mt-4">
            <div className="h-[400px] overflow-y-auto border rounded p-2 bg-black/20 font-mono text-xs">
              {logs.length > 0 ? logs.map((log, i) => (
                <div key={i} className="pb-1 border-b border-border/30 mb-1">
                  {log}
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  No logs yet. Actions will be recorded here.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="json" className="mt-4">
            <Textarea 
              value={jsonView} 
              readOnly 
              className="font-mono text-xs h-[400px] bg-black/20"
              placeholder="JSON response will appear here after fetching or generating a summary."
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
