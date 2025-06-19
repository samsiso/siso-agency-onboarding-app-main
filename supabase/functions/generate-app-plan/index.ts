import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { businessData, options } = await req.json()
    
    // Validate required data
    if (!businessData || !businessData.businessName) {
      return new Response(
        JSON.stringify({ error: 'Business data is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get Google Gemini API key from environment (NEW: Using Gemini instead of OpenAI)
    const geminiApiKey = Deno.env.get('GOOGLE_API_KEY')
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Google Gemini API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate enhanced industry-specific prompt
    const prompt = generateEnhancedPrompt(businessData, options)

    // Call Google Gemini API (NEW: Using Gemini 2.0 Flash - FREE!)
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a senior app development consultant with 10+ years of experience. Create comprehensive, actionable app development plans that clients can understand and development teams can implement.\n\n${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 4000,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    })

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text()
      console.error('Google Gemini API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to generate app plan with Gemini' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const geminiData = await geminiResponse.json()
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiResponse) {
      console.error('No response from Gemini:', geminiData)
      return new Response(
        JSON.stringify({ error: 'No response from AI' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse AI response into structured data
    const structuredPlan = parseAIResponse(aiResponse, businessData)

    return new Response(
      JSON.stringify({ 
        success: true, 
        generatedPlan: structuredPlan,
        rawResponse: aiResponse,
        apiProvider: 'Google Gemini 2.0 Flash',
        costSavings: 'FREE - 100% cost reduction vs OpenAI'
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateEnhancedPrompt(businessData: any, options: any): string {
  const { businessName, appPurpose, industry, targetAudience, budget, timeline } = businessData
  
  return `
# APP DEVELOPMENT PLAN REQUEST

## BUSINESS REQUIREMENTS
- **Company**: ${businessName}
- **App Purpose**: ${appPurpose}
- **Industry**: ${industry}
- **Target Audience**: ${targetAudience}
- **Budget**: ${budget || 'Not specified'}
- **Timeline**: ${timeline || 'Flexible'}

## ANALYSIS REQUIREMENTS
Create a comprehensive app development plan with the following sections:

### 1. EXECUTIVE SUMMARY
Provide a 2-3 paragraph overview of the recommended app solution, highlighting the key value proposition and business impact.

### 2. FEATURE RECOMMENDATIONS
List 6-8 core features with:
- Feature name and description
- Priority level (High/Medium/Low)
- Estimated development complexity
- User stories
- MVP vs future release classification

### 3. TECHNICAL ARCHITECTURE
Recommend:
- Platform approach (Native iOS/Android, Cross-platform, Web)
- Technology stack (Frontend, Backend, Database)
- Key integrations and APIs
- Security requirements
- Scalability considerations

### 4. DEVELOPMENT PHASES
Break down into 2-3 phases with:
- Phase objectives and deliverables
- Feature groupings
- Timeline estimates
- Key milestones

### 5. COST BREAKDOWN (GBP)
Provide realistic UK market pricing for:
- Development costs
- Design costs  
- Testing and QA
- Deployment and setup
- First year maintenance
- Total project cost

### 6. UI/UX RECOMMENDATIONS
Suggest:
- Design approach and style
- User experience flow
- Accessibility considerations
- Mobile optimization

### 7. MARKET ANALYSIS
For ${industry} industry:
- Current market trends
- Competitor landscape
- Opportunities and differentiators
- Target user behavior patterns

### 8. RISKS AND MITIGATION
Identify:
- Technical risks and solutions
- Timeline risks and buffers
- Budget risks and alternatives
- Market risks and positioning

Format your response as a professional business document that a client can present to stakeholders and a development team can use for implementation planning.

Focus on ${industry} industry best practices and ${targetAudience} user needs.
`
}

function parseAIResponse(response: string, businessData: any): any {
  // Enhanced parsing with multiple format support for testing
  const parsedData = {
    executiveSummary: extractSection(response, 'EXECUTIVE SUMMARY') || extractBetweenMarkers(response, 'START_EXECUTIVE_SUMMARY', 'END_EXECUTIVE_SUMMARY') || 'AI-generated comprehensive app development plan',
    aiGeneratedContent: response,
    businessName: businessData.businessName,
    industry: businessData.industry,
    targetAudience: businessData.targetAudience,
    generatedAt: new Date().toISOString(),
    aiProvider: 'Google Gemini 2.0 Flash (Free)',
    // Enhanced feature extraction with multiple format support
    features: extractFeaturesEnhanced(response),
    costBreakdown: extractCostBreakdownEnhanced(response),
    timeline: extractTimelineEnhanced(response),
    technicalStack: extractTechnicalStack(response),
    developmentPhases: extractDevelopmentPhases(response),
    // Parsing success indicators
    parsingMetrics: {
      sectionsFound: countSections(response),
      formatType: detectFormatType(response),
      structuredDataExtracted: true
    }
  };

  return parsedData;
}

function extractBetweenMarkers(text: string, startMarker: string, endMarker: string): string | null {
  const startIndex = text.indexOf(startMarker);
  const endIndex = text.indexOf(endMarker);
  
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    return text.substring(startIndex + startMarker.length, endIndex).trim();
  }
  return null;
}

function extractFeaturesEnhanced(text: string): any[] {
  const features = [];
  
  // Try different feature extraction methods
  
  // Method 1: Standard bullet points
  const standardFeatures = extractFeatures(text);
  if (standardFeatures.length > 0) {
    return standardFeatures;
  }
  
  // Method 2: Numbered features
  const numberedRegex = /(\d+\.\s*\*\*([^*]+)\*\*[^(\n]*(?:\([^)]*\))?)/g;
  let match;
  while ((match = numberedRegex.exec(text)) !== null) {
    features.push({
      name: match[2].trim(),
      description: match[1].replace(/\d+\.\s*\*\*[^*]+\*\*\s*-?\s*/, '').trim(),
      priority: determinePriority(match[1], text),
      userStory: extractUserStory(match[1])
    });
  }
  
  // Method 3: Between markers format
  const markerFeatures = extractBetweenMarkers(text, 'START_FEATURES', 'END_FEATURES');
  if (markerFeatures) {
    const lines = markerFeatures.split('\n');
    let currentPriority = 'medium';
    
    for (const line of lines) {
      if (line.includes('HIGH_PRIORITY:')) {
        currentPriority = 'high';
        continue;
      }
      if (line.includes('MEDIUM_PRIORITY:')) {
        currentPriority = 'medium';
        continue;
      }
      if (line.includes('LOW_PRIORITY:')) {
        currentPriority = 'low';
        continue;
      }
      if (line.trim().startsWith('-')) {
        features.push({
          name: line.replace('-', '').trim(),
          priority: currentPriority,
          description: `${currentPriority} priority feature`,
          userStory: 'To be defined'
        });
      }
    }
  }
  
  return features.slice(0, 8); // Limit to 8 features
}

function extractCostBreakdownEnhanced(text: string): any {
  // Try multiple cost extraction methods
  
  // Method 1: Standard GBP format
  const standardCosts = extractCostBreakdown(text);
  
  // Method 2: Between markers
  const markerCosts = extractBetweenMarkers(text, 'START_COSTS', 'END_COSTS');
  if (markerCosts) {
    const lines = markerCosts.split('\n');
    const costs: any = { currency: 'GBP', apiCost: 'FREE (Google Gemini)' };
    
    for (const line of lines) {
      if (line.includes('Development:')) {
        const match = line.match(/£([\d,]+)/);
        if (match) costs.development = parseInt(match[1].replace(',', ''));
      }
      if (line.includes('Design:')) {
        const match = line.match(/£([\d,]+)/);
        if (match) costs.design = parseInt(match[1].replace(',', ''));
      }
      if (line.includes('Testing:')) {
        const match = line.match(/£([\d,]+)/);
        if (match) costs.testing = parseInt(match[1].replace(',', ''));
      }
      if (line.includes('Total:')) {
        const match = line.match(/£([\d,]+)/);
        if (match) costs.total = parseInt(match[1].replace(',', ''));
      }
    }
    
    return costs;
  }
  
  // Method 3: Table format detection
  const tableMatch = text.match(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|[\s\S]*?\|\s*Development\s*\|\s*£([\d,]+)\s*\|/);
  if (tableMatch) {
    const developmentCost = parseInt(tableMatch[3].replace(',', ''));
    return {
      development: developmentCost,
      design: Math.round(developmentCost * 0.2),
      testing: Math.round(developmentCost * 0.15),
      total: Math.round(developmentCost * 1.35),
      currency: 'GBP',
      apiCost: 'FREE (Google Gemini)',
      extractionMethod: 'table'
    };
  }
  
  return standardCosts;
}

function extractTimelineEnhanced(text: string): string {
  // Method 1: Standard timeline extraction
  const standardTimeline = extractTimeline(text);
  
  // Method 2: Between markers
  const markerTimeline = extractBetweenMarkers(text, 'START_TIMELINE', 'END_TIMELINE');
  if (markerTimeline) {
    const durationMatch = markerTimeline.match(/Total Duration:\s*(\d+\s*weeks?)/i);
    if (durationMatch) return durationMatch[1];
  }
  
  // Method 3: Table or structured format
  const structuredMatch = text.match(/\*\*Total Duration\*\*:\s*(\d+\s*weeks?)/i);
  if (structuredMatch) return structuredMatch[1];
  
  return standardTimeline;
}

function extractTechnicalStack(text: string): any {
  const stack: any = {};
  
  // Method 1: Between markers
  const markerStack = extractBetweenMarkers(text, 'START_TECH_STACK', 'END_TECH_STACK');
  if (markerStack) {
    const lines = markerStack.split('\n');
    for (const line of lines) {
      if (line.includes('Platform:')) stack.platform = line.split(':')[1].trim();
      if (line.includes('Frontend:')) stack.frontend = line.split(':')[1].trim();
      if (line.includes('Backend:')) stack.backend = line.split(':')[1].trim();
      if (line.includes('Database:')) stack.database = line.split(':')[1].trim();
    }
  }
  
  // Method 2: Markdown format
  const platformMatch = text.match(/\*\*Platform\*\*:\s*([^\n]+)/i);
  if (platformMatch) stack.platform = platformMatch[1].trim();
  
  const frontendMatch = text.match(/\*\*Frontend\*\*:\s*([^\n]+)/i);
  if (frontendMatch) stack.frontend = frontendMatch[1].trim();
  
  const backendMatch = text.match(/\*\*Backend\*\*:\s*([^\n]+)/i);
  if (backendMatch) stack.backend = backendMatch[1].trim();
  
  const databaseMatch = text.match(/\*\*Database\*\*:\s*([^\n]+)/i);
  if (databaseMatch) stack.database = databaseMatch[1].trim();
  
  return stack;
}

function extractDevelopmentPhases(text: string): any[] {
  const phases = [];
  
  // Look for phase patterns
  const phaseRegex = /(?:Phase\s+(\d+)|Phase\s+(\d+)\s*\([^)]+\)):\s*([^\n]+)/gi;
  let match;
  
  while ((match = phaseRegex.exec(text)) !== null) {
    phases.push({
      number: match[1] || match[2],
      title: match[3].trim(),
      description: extractPhaseDetails(text, match.index)
    });
  }
  
  return phases;
}

function extractPhaseDetails(text: string, startIndex: number): string {
  // Extract a few lines after the phase title for details
  const fromPhase = text.substring(startIndex);
  const nextPhaseIndex = fromPhase.search(/Phase\s+\d+/i);
  const phaseSection = nextPhaseIndex > 0 ? fromPhase.substring(0, nextPhaseIndex) : fromPhase.substring(0, 300);
  
  return phaseSection.split('\n').slice(1, 4).join(' ').trim();
}

function determinePriority(featureText: string, fullText: string): string {
  const beforeFeature = fullText.substring(0, fullText.indexOf(featureText));
  
  if (beforeFeature.toLowerCase().includes('high priority') || beforeFeature.toLowerCase().includes('priority: high')) {
    return 'high';
  }
  if (beforeFeature.toLowerCase().includes('low priority') || beforeFeature.toLowerCase().includes('priority: low')) {
    return 'low';
  }
  return 'medium';
}

function extractUserStory(featureText: string): string {
  const userStoryMatch = featureText.match(/\(User Story:\s*([^)]+)\)/i);
  if (userStoryMatch) return userStoryMatch[1].trim();
  
  const asUserMatch = featureText.match(/\(As a\s+[^)]+\)/i);
  if (asUserMatch) return asUserMatch[0];
  
  return 'User story to be defined';
}

function countSections(text: string): number {
  const sections = [
    'EXECUTIVE SUMMARY',
    'FEATURES',
    'TECHNICAL',
    'COST',
    'TIMELINE',
    'PHASES'
  ];
  
  return sections.filter(section => 
    text.toUpperCase().includes(section) || 
    text.includes('START_' + section.replace(' ', '_')) ||
    text.includes('##') && text.toUpperCase().includes(section)
  ).length;
}

function detectFormatType(text: string): string {
  if (text.includes('START_') && text.includes('END_')) {
    return 'marker-based';
  }
  if (text.includes('##') && text.includes('**')) {
    return 'markdown';
  }
  if (text.includes('|') && text.includes('---')) {
    return 'table-enhanced';
  }
  return 'standard';
}

function extractSection(text: string, sectionName: string): string | null {
  const regex = new RegExp(`### ?\\d+\\.? ?${sectionName}[\\s\\S]*?(?=###|$)`, 'i')
  const match = text.match(regex)
  return match ? match[0].replace(/### ?\d+\.? ?${sectionName}/i, '').trim() : null
}

function extractFeatures(text: string): any[] {
  // Enhanced feature extraction optimized for Gemini's response format
  const features = []
  const lines = text.split('\n')
  let inFeatureSection = false
  
  for (const line of lines) {
    if (line.toLowerCase().includes('feature') && line.includes('###')) {
      inFeatureSection = true
      continue
    }
    if (inFeatureSection && line.startsWith('###')) {
      break
    }
    if (inFeatureSection && line.trim().startsWith('-')) {
      features.push({
        name: line.replace('-', '').trim(),
        priority: 'medium',
        description: 'AI-recommended feature'
      })
    }
  }
  
  return features.slice(0, 8) // Limit to 8 features
}

function extractCostBreakdown(text: string): any {
  // Enhanced cost extraction with better pattern matching
  const costMatches = text.match(/£[\d,]+/g) || []
  const costs = costMatches.map(cost => parseInt(cost.replace(/[£,]/g, '')))
  
  return {
    development: costs[0] || 15000,
    design: costs[1] || 3000,
    testing: costs[2] || 2000,
    deployment: costs[3] || 1000,
    maintenance: costs[4] || 2000,
    total: costs.reduce((sum, cost) => sum + cost, 0) || 23000,
    currency: 'GBP',
    apiCost: 'FREE (Google Gemini)'
  }
}

function extractTimeline(text: string): string {
  // Enhanced timeline extraction
  const timelineMatches = text.match(/(\d+)[\s-]*(weeks?|months?)/gi) || []
  return timelineMatches[0] || '12-16 weeks'
} 