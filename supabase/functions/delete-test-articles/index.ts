
// [Analysis] Edge function to remove test articles from March 7th
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the date to delete - default to March 7th
    const targetDate = '2024-03-07';
    
    console.log(`Deleting test articles from date: ${targetDate}`);

    // Find the articles to delete
    const { data: articlesToDelete, error: selectError } = await supabase
      .from('ai_news')
      .select('id, title')
      .eq('date', targetDate);
    
    if (selectError) {
      throw selectError;
    }

    console.log(`Found ${articlesToDelete?.length || 0} articles to delete`);
    
    if (!articlesToDelete || articlesToDelete.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No articles found for deletion',
        count: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the IDs of articles to delete
    const articleIds = articlesToDelete.map(article => article.id);
    
    // Also delete associated summaries
    const { error: summaryDeleteError } = await supabase
      .from('ai_news_summaries')
      .delete()
      .in('news_id', articleIds);
    
    if (summaryDeleteError) {
      console.error('Error deleting summaries:', summaryDeleteError);
    }
    
    // Delete any AI analysis
    const { error: analysisDeleteError } = await supabase
      .from('news_ai_analysis')
      .delete()
      .in('news_id', articleIds);
    
    if (analysisDeleteError) {
      console.error('Error deleting analysis:', analysisDeleteError);
    }

    // Delete the articles
    const { error: deleteError } = await supabase
      .from('ai_news')
      .delete()
      .in('id', articleIds);
    
    if (deleteError) {
      throw deleteError;
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully deleted ${articlesToDelete.length} test articles from ${targetDate}`,
      deleted: articlesToDelete.map(a => a.title),
      count: articlesToDelete.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting test articles:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
