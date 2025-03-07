
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

// [Analysis] Custom interface for API token usage data
// [Framework] Data Transfer Object pattern for type safety
interface TokenUsage {
  tokens_used: number;
  operations: Array<{type: string, count: number}>;
  date: string;
}

// [Analysis] Component to monitor API token usage and stay within limits
export const ApiUsageMonitor = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState({
    daily: {
      used: 0,
      limit: 66, // Daily safe limit from tokenBudgetManager
      percentage: 0
    },
    monthly: {
      used: 0,
      limit: 2000, // Monthly token limit from tokenBudgetManager
      percentage: 0
    },
    operations: [] as {type: string, count: number}[]
  });
  
  useEffect(() => {
    const fetchTokenUsage = async () => {
      try {
        setLoading(true);
        
        // Get today's usage
        const today = new Date().toISOString().split('T')[0];
        
        // [Analysis] Direct fetch with type casting to bypass TypeScript limitations
        // [Q] Should we create a custom RPC function for more type safety?
        const { data: todayUsageData, error: todayError } = await supabase
          .from('api_token_usage' as any)
          .select('tokens_used, operations, date')
          .eq('date', today)
          .single() as unknown as { 
            data: TokenUsage | null, 
            error: any 
          };
        
        if (todayError && todayError.code !== 'PGSQL_ERROR_NO_ROWS') {
          throw todayError;
        }
        
        // Get monthly usage by summing daily usage for current month
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        const firstDayStr = firstDayOfMonth.toISOString().split('T')[0];
        
        const { data: monthlyUsageData, error: monthlyError } = await supabase
          .from('api_token_usage' as any)
          .select('tokens_used, date')
          .gte('date', firstDayStr) as unknown as {
            data: TokenUsage[] | null,
            error: any
          };
        
        if (monthlyError) {
          throw monthlyError;
        }
        
        // Calculate usage
        const dailyUsed = todayUsageData?.tokens_used || 0;
        const monthlyUsed = monthlyUsageData?.reduce((sum, day) => sum + day.tokens_used, 0) || 0;
        
        setUsage({
          daily: {
            used: dailyUsed,
            limit: 66,
            percentage: Math.min(Math.round((dailyUsed / 66) * 100), 100)
          },
          monthly: {
            used: monthlyUsed,
            limit: 2000,
            percentage: Math.min(Math.round((monthlyUsed / 2000) * 100), 100)
          },
          operations: todayUsageData?.operations || []
        });
        
        setError(null);
      } catch (err: any) {
        console.error("Error fetching token usage:", err);
        setError("Failed to load API usage data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTokenUsage();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchTokenUsage, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Loading API usage data...</span>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  const getDailyUsageColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 75) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getMonthlyUsageColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 85) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <span>API Token Usage Monitor</span>
          {usage.daily.percentage < 80 && usage.monthly.percentage < 80 && (
            <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
          )}
          {(usage.daily.percentage >= 80 || usage.monthly.percentage >= 80) && (
            <AlertCircle className="h-5 w-5 text-amber-500 ml-2" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Daily Usage</span>
            <span className="text-sm font-medium">
              {usage.daily.used} / {usage.daily.limit} tokens ({usage.daily.percentage}%)
            </span>
          </div>
          <Progress 
            value={usage.daily.percentage} 
            className={`h-2 ${getDailyUsageColor(usage.daily.percentage)}`} 
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Monthly Usage</span>
            <span className="text-sm font-medium">
              {usage.monthly.used} / {usage.monthly.limit} tokens ({usage.monthly.percentage}%)
            </span>
          </div>
          <Progress 
            value={usage.monthly.percentage} 
            className={`h-2 ${getMonthlyUsageColor(usage.monthly.percentage)}`} 
          />
        </div>
        
        {usage.operations.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Today's Operations</h4>
            <div className="grid grid-cols-2 gap-2">
              {usage.operations.map((op, index) => (
                <div key={index} className="text-sm flex justify-between bg-muted p-2 rounded">
                  <span>{op.type}</span>
                  <span className="font-medium">{op.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {usage.daily.percentage >= 90 && (
          <Alert className="mt-4 bg-red-500/10 border-red-500/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Daily limit almost reached</AlertTitle>
            <AlertDescription>
              You've used {usage.daily.percentage}% of your daily token budget. 
              Further operations may be limited.
            </AlertDescription>
          </Alert>
        )}
        
        {usage.monthly.percentage >= 85 && (
          <Alert className="mt-4 bg-red-500/10 border-red-500/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Monthly limit approaching</AlertTitle>
            <AlertDescription>
              You've used {usage.monthly.percentage}% of your monthly token budget.
              Consider adjusting fetch frequency.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
