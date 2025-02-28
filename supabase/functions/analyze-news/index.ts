
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// [Analysis] Configure environment variables for API access
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const openAIKey = Deno.env.get("OPENAI_API_KEY");

interface NewsSection {
  id: string;
  content: string;
  title: string;
  key_details: string[];
  implications: string[];
  section_id?: string;
  news_id?: string;
}

// [Analysis] Analyze news content using available analysis methods
async function analyzeContent(content: string, title: string): Promise<any> {
  if (openAIKey) {
    // If OpenAI API key is available, use it for more sophisticated analysis
    try {
      const prompt = `
      Analyze this AI news article content and provide structured insights:
      
      Title: ${title}
      
      Content: ${content.substring(0, 3000)}
      
      Please provide:
      1. Key insights (3-5 bullet points)
      2. Market impact assessment (1-2 sentences)
      3. Technical predictions (2-3 bullet points)
      4. Related technologies (list of keywords)
      5. Confidence score (between 0 and 1)
      
      Format as JSON with these keys: key_insights (array), market_impact (string), tech_predictions (array), related_technologies (array), confidence_score (number)
      `;
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an AI technology analyst that provides structured insights in JSON format."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${data.error?.message || response.statusText}`);
      }
      
      try {
        // Try to parse the JSON response
        const aiResponse = data.choices[0]?.message?.content || "";
        const jsonStartIdx = aiResponse.indexOf('{');
        const jsonEndIdx = aiResponse.lastIndexOf('}');
        
        if (jsonStartIdx >= 0 && jsonEndIdx > jsonStartIdx) {
          const jsonStr = aiResponse.substring(jsonStartIdx, jsonEndIdx + 1);
          return JSON.parse(jsonStr);
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
      }
    } catch (error) {
      console.error("Error using OpenAI for analysis:", error);
      // Fall back to the simple analysis if OpenAI fails
    }
  }
  
  // Simple rule-based analysis as fallback
  const keyTerms = {
    "neural network": "deep learning",
    "transformer": "large language models",
    "generative ai": "content creation",
    "computer vision": "image processing",
    "nlp": "language understanding",
    "reinforcement learning": "autonomous systems",
    "chatgpt": "conversational AI",
    "robotics": "automation",
  };
  
  // Extract key insights based on frequency and relevance
  const keyInsights = [];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const contentLower = content.toLowerCase();
  
  // Check for key terms in content
  const foundTerms = Object.keys(keyTerms).filter(term => 
    contentLower.includes(term.toLowerCase())
  );
  
  // Generate related technologies
  const relatedTech = foundTerms.map(term => keyTerms[term as keyof typeof keyTerms]);
  
  // Extract key sentences with important terms
  for (const term of foundTerms) {
    const relevantSentence = sentences.find(s => 
      s.toLowerCase().includes(term.toLowerCase())
    );
    if (relevantSentence && keyInsights.length < 5) {
      keyInsights.push(relevantSentence.trim());
    }
  }
  
  // Fill up insights if needed
  if (keyInsights.length < 3 && sentences.length > 3) {
    for (let i = 0; i < Math.min(3, sentences.length); i++) {
      if (!keyInsights.includes(sentences[i].trim())) {
        keyInsights.push(sentences[i].trim());
      }
      if (keyInsights.length >= 3) break;
    }
  }
  
  // Generate simple predictions
  const techPredictions = [
    "Continued growth in this area of AI technology is expected.",
    "Integration with existing systems will be a primary focus.",
    "Further research will improve performance and capabilities."
  ];
  
  return {
    key_insights: keyInsights,
    market_impact: "This technology could have significant impact on industry adoption and market growth.",
    tech_predictions: techPredictions,
    related_technologies: [...new Set(relatedTech)].filter(t => t), // Remove duplicates and empty values
    confidence_score: 0.7, // Default confidence for rule-based analysis
  };
}

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const { content, title, key_details = [], implications = [], section_id, news_id } = await req.json() as NewsSection;
    
    if (!content || !title) {
      throw new Error("Missing required fields: content and title");
    }
    
    // Analyze the content
    const analysis = await analyzeContent(content, title);
    
    // Store the analysis in the database
    if (section_id || news_id) {
      const { error } = await supabase.from("news_ai_analysis").insert({
        section_id: section_id || null,
        news_id: news_id || null,
        market_impact: analysis.market_impact,
        tech_predictions: analysis.tech_predictions,
        related_technologies: analysis.related_technologies,
        key_insights: analysis.key_insights,
        confidence_score: analysis.confidence_score,
        business_implications: key_details.length > 0 ? key_details.join(' ') : "No specific business implications noted.",
      });
      
      if (error) {
        console.error("Error storing analysis:", error);
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        analysis,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-news:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});
