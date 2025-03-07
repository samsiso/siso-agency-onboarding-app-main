
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
