
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

// [Analysis] Custom interface for API token usage data
// [Framework] Data Transfer Object pattern for type safety
interface TokenUsage {
  tokens_used: number;
  operations?: Array<{type: string, count: number}>;
  date?: string;
}

interface ApiUsage {
  daily: {
    used: number;
    limit: number;
    percentage: number;
  };
  monthly: {
    used: number;
    limit: number;
    percentage: number;
  };
  operations: Array<{type: string, count: number}>;
}

export function ApiUsageMonitor() {
  const [usage, setUsage] = useState<ApiUsage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchUsage = async () => {
    setLoading(true);
    setError(null);
    
    try {
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
          limit: 66, // Daily safe limit
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
      console.error('Error fetching API usage:', err);
      setError(err.message || 'Failed to fetch API usage');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsage();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchUsage, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading && !usage) {
    return (
      <Card className="bg-gray-900/30 border-gray-800">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading API usage...</span>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load API usage data: {error}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!usage) return null;
  
  return (
    <Card className="bg-gray-900/30 border-gray-800">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Daily API Usage</span>
              <span className="text-sm">{usage.daily.used} / {usage.daily.limit} tokens ({usage.daily.percentage}%)</span>
            </div>
            <Progress 
              value={usage.daily.percentage} 
              className="h-2" 
              indicatorClassName={usage.daily.percentage > 80 ? "bg-red-500" : usage.daily.percentage > 50 ? "bg-yellow-500" : "bg-green-500"}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Monthly API Usage</span>
              <span className="text-sm">{usage.monthly.used} / {usage.monthly.limit} tokens ({usage.monthly.percentage}%)</span>
            </div>
            <Progress 
              value={usage.monthly.percentage} 
              className="h-2" 
              indicatorClassName={usage.monthly.percentage > 80 ? "bg-red-500" : usage.monthly.percentage > 50 ? "bg-yellow-500" : "bg-green-500"}
            />
          </div>
          
          {usage.daily.percentage > 80 && (
            <Alert variant="warning" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Daily API usage is nearing the limit. Some operations may be restricted.
              </AlertDescription>
            </Alert>
          )}
          
          {usage.monthly.percentage > 80 && (
            <Alert variant="warning" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Monthly API usage is nearing the limit. Consider upgrading your plan.
              </AlertDescription>
            </Alert>
          )}
          
          {usage.daily.percentage <= 50 && usage.monthly.percentage <= 50 && (
            <div className="flex items-center text-sm text-green-400">
              <CheckCircle className="h-4 w-4 mr-2" />
              API usage is within safe limits
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
