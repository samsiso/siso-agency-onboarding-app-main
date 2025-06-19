
// [Analysis] Scheduled function to fetch AI news while respecting token limits
// [Plan] This runs on a schedule via Supabase cron jobs

import { tokenBudgetManager, trackTokenUsage } from "../_shared/token-budget.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

// Configuration
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Main function
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Running scheduled news fetch");
    
    // Check if we've exceeded our token budget
    const { data: todayUsage, error: usageError } = await supabase
      .from('api_token_usage')
      .select('tokens_used')
      .eq('date', new Date().toISOString().split('T')[0])
      .single();
    
    if (usageError && usageError.code !== 'PGSQL_ERROR_NO_ROWS') {
      console.error("Error checking token usage:", usageError);
    }
      
    const currentUsage = todayUsage?.tokens_used || 0;
    
    if (!tokenBudgetManager.hasEnoughBudget(currentUsage, 'fetch')) {
      console.log("Daily token budget exceeded, skipping scheduled fetch");
      return new Response(JSON.stringify({
        success: false,
        message: "Daily token budget exceeded"
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      });
    }
    
    // Determine how many articles to fetch based on remaining budget
    const maxArticles = Math.min(tokenBudgetManager.getMaxDailyArticles(), 10);
    
    // Define agency-focused keywords for better targeting
    const keywords = [
      "ai for agencies",
      "ai client solutions",
      "agency ai implementation",
      "ai marketing tools",
      "ai business strategy"
    ];
    
    // Select a random keyword for variety
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    // Call the fetch-ai-news edge function
    const { data, error } = await supabase.functions.invoke('fetch-ai-news', {
      body: {
        keyword,
        limit: maxArticles,
        testMode: false,
        source: 'event_registry',
        skipDuplicates: true,
        minRelevanceScore: 20 // Higher threshold for automatic fetches
      }
    });
    
    if (error) {
      console.error("Error invoking fetch-ai-news:", error);
      throw error;
    }
    
    // Update token usage
    await trackTokenUsage(supabase, 'scheduled_fetch', tokenBudgetManager.ARTICLE_ESTIMATE);
    
    console.log(`Scheduled fetch completed: ${data.count} articles added`);
    
    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: `Scheduled fetch completed: ${data.count} articles added`,
      articles_count: data.count
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    });
  } catch (error) {
    console.error("Error in scheduled news fetch:", error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      error: error
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500 
    });
  }
});
