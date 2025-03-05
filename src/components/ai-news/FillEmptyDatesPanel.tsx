
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

// [Analysis] Component for filling empty dates in the AI news database
export const FillEmptyDatesPanel = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const { toast } = useToast();

  // [Analysis] Function to fill empty dates for a specific month
  const fillEmptyDates = async (year: number, month: number) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setProgress(10);
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-ai-news', {
        body: {
          fillEmptyDates: true,
          year,
          month,
          keyword: "artificial intelligence, machine learning, AI, deep learning, generative AI",
          source: "both",
          testMode: false
        }
      });
      
      setProgress(100);
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No response from the function');
      }
      
      setResults(data.results || []);
      
      toast({
        title: "Operation completed",
        description: data.message || `Processed dates for ${year}-${month}`,
      });
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || 'Failed to process empty dates',
      });
    } finally {
      setLoading(false);
    }
  };

  // [Analysis] Calculate summary statistics for results
  const getResultsSummary = () => {
    if (!results || results.length === 0) return null;
    
    const totalFetched = results.reduce((sum, r) => sum + (r.fetched || 0), 0);
    const totalInserted = results.reduce((sum, r) => sum + (r.inserted || 0), 0);
    const totalSkipped = results.reduce((sum, r) => sum + (r.skipped || 0), 0);
    const totalErrors = results.reduce((sum, r) => sum + ((r.errors?.length || 0) > 0 ? 1 : 0), 0);
    
    return {
      dates: results.length,
      fetched: totalFetched,
      inserted: totalInserted,
      skipped: totalSkipped,
      errors: totalErrors
    };
  };

  // [Analysis] Get month name from number
  const getMonthName = (monthNum: number) => {
    return new Date(2000, monthNum - 1, 1).toLocaleString('default', { month: 'long' });
  };

  const summary = getResultsSummary();

  return (
    <Card className="border-slate-800 bg-slate-950/50 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-400" />
            Fill Empty Dates - {getMonthName(currentMonth)} {currentYear}
          </CardTitle>
        </div>
        <CardDescription>
          Fetch and populate AI news for dates with missing content
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        {loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              <span>Processing empty dates...</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {error && !loading && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {summary && !loading && (
          <div className="mb-4 space-y-4">
            <Alert className="bg-blue-950/20 border border-blue-500/20">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <AlertTitle className="text-blue-400">Process Complete</AlertTitle>
              <AlertDescription>
                Processed {summary.dates} dates, fetched {summary.fetched} articles, 
                inserted {summary.inserted} new articles, with {summary.errors} errors.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-2">
              {results?.map((result, index) => (
                <div key={index} className="border border-slate-800 bg-slate-900/50 rounded-md p-3 text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{result.date}</span>
                    <Badge variant="outline" className={
                      result.inserted > 0 
                        ? "bg-green-950/20 text-green-400 border-green-500/50" 
                        : "bg-gray-950/20 text-gray-400 border-gray-500/50"
                    }>
                      {result.inserted > 0 ? `Added ${result.inserted}` : "No new articles"}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Previous articles:</span>
                      <span>{result.previousCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fetched:</span>
                      <span>{result.fetched}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inserted:</span>
                      <span>{result.inserted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Skipped:</span>
                      <span>{result.skipped}</span>
                    </div>
                  </div>
                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-2 text-xs text-red-400">
                      <p>Errors: {result.errors.length}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Button 
            variant="outline" 
            className="text-sm" 
            onClick={() => fillEmptyDates(2025, 3)}
            disabled={loading}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Fill March 2025
          </Button>
          
          <Button 
            variant="outline" 
            className="text-sm" 
            onClick={() => fillEmptyDates(2025, 2)}
            disabled={loading}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Fill February 2025
          </Button>
          
          <Button 
            variant="outline" 
            className="text-sm" 
            onClick={() => fillEmptyDates(2025, 1)}
            disabled={loading}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Fill January 2025
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full text-xs text-muted-foreground">
          {loading ? 
            "Processing may take a few minutes..." :
            "Click on a month button to fill empty dates with AI news articles."
          }
        </div>
      </CardFooter>
    </Card>
  );
};
