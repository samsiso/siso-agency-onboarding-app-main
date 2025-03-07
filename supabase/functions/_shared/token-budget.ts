
// [Analysis] Token budget management system to stay within API limits
// [Plan] This will help track and manage our monthly API token usage

/**
 * Token budget management for API calls
 * Helps prevent overages by tracking usage and providing limits
 */
export const tokenBudgetManager = {
  // [Analysis] Constants based on actual API limits
  MONTHLY_TOKEN_LIMIT: 2000,
  DAILY_SAFE_LIMIT: 66, // ~2000/30 - safe daily budget
  ARTICLE_ESTIMATE: 5, // Estimated tokens per article fetch
  ANALYSIS_ESTIMATE: 20, // Estimated tokens per analysis

  // [Analysis] Calculate maximum articles we can fetch per day
  getMaxDailyArticles: (analysisCount: number = 0) => {
    const analysisTokens = analysisCount * tokenBudgetManager.ANALYSIS_ESTIMATE;
    const remainingTokens = tokenBudgetManager.DAILY_SAFE_LIMIT - analysisTokens;
    return Math.max(Math.floor(remainingTokens / tokenBudgetManager.ARTICLE_ESTIMATE), 1);
  },

  // [Analysis] Calculate if we have enough budget for an operation
  hasEnoughBudget: (currentUsage: number, operation: 'fetch' | 'analyze') => {
    const operationCost = operation === 'fetch' 
      ? tokenBudgetManager.ARTICLE_ESTIMATE 
      : tokenBudgetManager.ANALYSIS_ESTIMATE;
    
    return (currentUsage + operationCost) <= tokenBudgetManager.DAILY_SAFE_LIMIT;
  },

  // [Q] Should we implement a more granular tracking system with database persistence?
  // [Plan] Consider implementing actual token tracking in production
};

/**
 * Track token usage in the database
 * @param supabase Supabase client
 * @param operation Operation type (fetch, analyze, etc)
 * @param tokenCost Cost in tokens
 */
export async function trackTokenUsage(supabase: any, operation: string, tokenCost: number) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get current usage for today
    const { data, error } = await supabase
      .from('api_token_usage')
      .select('*')
      .eq('date', today)
      .single();
      
    if (error && error.code !== 'PGSQL_ERROR_NO_ROWS') {
      console.error("Error tracking token usage:", error);
      return;
    }
    
    // If no record exists for today, create one
    if (!data) {
      const { error: insertError } = await supabase
        .from('api_token_usage')
        .insert([{
          date: today,
          tokens_used: tokenCost,
          operations: [{type: operation, count: 1}]
        }]);
        
      if (insertError) {
        console.error("Error creating token usage record:", insertError);
      }
    } else {
      // Update existing record
      const operations = data.operations || [];
      const existingOpIdx = operations.findIndex((op: any) => op.type === operation);
      
      if (existingOpIdx >= 0) {
        operations[existingOpIdx].count += 1;
      } else {
        operations.push({type: operation, count: 1});
      }
      
      const { error: updateError } = await supabase
        .from('api_token_usage')
        .update({
          tokens_used: (data.tokens_used || 0) + tokenCost,
          operations
        })
        .eq('date', today);
        
      if (updateError) {
        console.error("Error updating token usage record:", updateError);
      }
    }
  } catch (error) {
    console.error("Error in trackTokenUsage function:", error);
  }
}
