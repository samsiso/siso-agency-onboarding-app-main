/**
 * App Plan Agent Service
 * AI-powered app plan generation from business requirements
 */

import { 
  AppPlanInput, 
  GeneratedAppPlan, 
  AppPlanGenerationOptions,
  FeaturePlan,
  DevelopmentPhase,
  TechnicalRequirements,
  CostBreakdown,
  UIUXPlan
} from '@/types/appPlan.types';
import { getBusinessOnboardingData } from '@/utils/clientData';
import { supabase } from '@/integrations/supabase/client';

/**
 * Mock AI model responses for development
 * In production, this would call actual AI APIs
 */
class AppPlanAgent {
  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Convert business onboarding data to App Plan Input
   */
  public createInputFromOnboardingData(): AppPlanInput | null {
    const businessData = getBusinessOnboardingData();
    if (!businessData) return null;

    return {
      businessName: businessData.businessName,
      appPurpose: businessData.appPurpose,
      industry: businessData.industry,
      targetAudience: businessData.targetAudience,
      communicationPreference: businessData.communicationPreference
    };
  }

  /**
   * Generate AI prompt for app plan creation
   */
  private generatePlanPrompt(input: AppPlanInput, options: AppPlanGenerationOptions): string {
    return `
You are an expert app development consultant. Create a comprehensive app plan based on these requirements:

BUSINESS REQUIREMENTS:
- Company: ${input.businessName}
- App Purpose: ${input.appPurpose}
- Industry: ${input.industry}
- Target Audience: ${input.targetAudience}
- Budget: ${input.budget || 'Not specified'}
- Timeline: ${input.timeline || 'Flexible'}

ANALYSIS FOCUS: ${options.focusAreas.join(', ')}
DETAIL LEVEL: ${options.detailLevel}

Please provide a detailed analysis including:
1. Executive Summary
2. Recommended features with priorities
3. Technical architecture recommendations
4. Development phases and timeline
5. Cost breakdown
6. UI/UX recommendations
7. Market analysis (if requested: ${options.includeMarketAnalysis})
8. Risk assessment and mitigation

Structure your response as a comprehensive app development plan that a client can understand and a development team can implement.
    `;
  }

  /**
   * Call AI model via Supabase Edge Function
   */
  private async callAIModel(prompt: string, model: string, input: AppPlanInput): Promise<string> {
    console.log(`🤖 Calling real AI model ${model} via Supabase...`);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-app-plan', {
        body: {
          businessData: {
            businessName: input.businessName,
            appPurpose: input.appPurpose,
            industry: input.industry,
            targetAudience: input.targetAudience,
            budget: input.budget,
            timeline: input.timeline
          },
          options: {
            model: model,
            includeMarketAnalysis: true,
            includeCostEstimates: true,
            detailLevel: 'detailed'
          }
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`AI generation failed: ${error.message}`);
      }

      if (!data || !data.success) {
        throw new Error('AI generation returned no data');
      }

      console.log('✅ AI plan generated successfully');
      return data.rawResponse;

    } catch (error) {
      console.error('Error calling AI model:', error);
      
      // Fallback to enhanced mock for development/testing
      console.log('🔄 Falling back to enhanced mock response...');
      return this.getEnhancedMockResponse(input);
    }
  }

  /**
   * Enhanced mock response as fallback
   */
  private getEnhancedMockResponse(input: AppPlanInput): string {
    return `
# EXECUTIVE SUMMARY

We recommend developing a comprehensive ${input.appPurpose} solution for ${input.businessName} targeting ${input.targetAudience} in the ${input.industry} industry. This app will leverage modern technology to deliver exceptional user experience while addressing key business objectives.

# FEATURE RECOMMENDATIONS

## Core Features (High Priority)
- **User Authentication & Profiles**: Secure registration, login, and profile management
- **${input.appPurpose} Core Functions**: Main application functionality tailored to business needs
- **Dashboard & Analytics**: User insights and performance tracking
- **Real-time Notifications**: Push notifications and in-app messaging

## Secondary Features (Medium Priority)  
- **Payment Integration**: Secure payment processing (if applicable)
- **Social Features**: User interaction and community building
- **Admin Panel**: Content and user management tools

# TECHNICAL ARCHITECTURE

## Platform Recommendation
- **Approach**: Cross-platform development for iOS and Android
- **Framework**: React Native with TypeScript for code reusability
- **Backend**: Node.js with Express.js API

## Technology Stack
- **Frontend**: React Native, TypeScript, Redux
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: PostgreSQL with Redis caching
- **Storage**: AWS S3 for file storage
- **Hosting**: AWS EC2 or Google Cloud Platform

# DEVELOPMENT PHASES

## Phase 1: Foundation (6-8 weeks)
- User authentication system
- Core app functionality
- Basic UI/UX implementation
- Database setup and API development

## Phase 2: Enhancement (4-6 weeks)
- Advanced features integration
- Payment system (if required)
- Admin panel development
- Testing and optimization

# COST BREAKDOWN (GBP)

- **Development**: £18,000
- **UI/UX Design**: £4,000  
- **Testing & QA**: £2,500
- **Deployment & Setup**: £1,500
- **First Year Maintenance**: £3,000
- **Total Project Cost**: £29,000

# MARKET ANALYSIS

The ${input.industry} industry shows strong growth in mobile adoption. ${input.targetAudience} users are increasingly expecting mobile-first solutions with intuitive interfaces and real-time capabilities.

# RISKS AND MITIGATION

- **Technical Complexity**: Mitigate with experienced development team
- **Timeline Risks**: Build in 20% buffer for unexpected challenges  
- **Market Competition**: Focus on unique value proposition and user experience
    `;
  }

  /**
   * Parse AI response into structured plan data
   */
  private parseAIResponse(response: string, input: AppPlanInput): Partial<GeneratedAppPlan> {
    // In production, this would be more sophisticated parsing
    // For now, creating structured data from the mock response
    
    const features: FeaturePlan[] = [
      {
        id: this.generateUniqueId(),
        name: 'User Authentication',
        description: 'Secure user registration, login, and profile management',
        priority: 'high',
        complexity: 'moderate',
        estimatedHours: 40,
        dependencies: [],
        userStories: [
          'As a user, I want to create an account so I can access the app',
          'As a user, I want to securely log in to my account'
        ]
      },
      {
        id: this.generateUniqueId(),
        name: 'Core App Features',
        description: `Main functionality for ${input.appPurpose}`,
        priority: 'high',
        complexity: 'complex',
        estimatedHours: 120,
        dependencies: [],
        userStories: [
          `As a user, I want to ${input.appPurpose.toLowerCase()}`
        ]
      },
      {
        id: this.generateUniqueId(),
        name: 'Notifications',
        description: 'Push notifications and in-app messaging',
        priority: 'medium',
        complexity: 'moderate',
        estimatedHours: 32,
        dependencies: [],
        userStories: [
          'As a user, I want to receive notifications about important updates'
        ]
      }
    ];

    const technicalRequirements: TechnicalRequirements = {
      platform: 'cross-platform',
      techStack: {
        frontend: ['React Native', 'TypeScript'],
        backend: ['Node.js', 'Express'],
        database: ['PostgreSQL', 'Redis'],
        apis: ['REST API', 'WebSocket']
      },
      architecture: 'Microservices with API Gateway',
      scalability: 'Horizontal scaling with load balancing',
      security: ['JWT Authentication', 'HTTPS', 'Data Encryption'],
      integrations: ['Payment Gateway', 'Push Notifications', 'Analytics']
    };

    const developmentPhases: DevelopmentPhase[] = [
      {
        id: this.generateUniqueId(),
        name: 'Phase 1: Foundation',
        description: 'Core authentication and basic functionality',
        features: [features[0].id, features[1].id],
        estimatedDuration: '4-6 weeks',
        milestones: ['User registration complete', 'Core features functional'],
        deliverables: ['MVP Backend', 'Basic UI/UX', 'Authentication System']
      },
      {
        id: this.generateUniqueId(),
        name: 'Phase 2: Enhancement',
        description: 'Additional features and polish',
        features: [features[2].id],
        estimatedDuration: '4-6 weeks',
        milestones: ['Notifications working', 'UI polish complete'],
        deliverables: ['Complete App', 'Testing', 'App Store Preparation']
      }
    ];

    const costBreakdown: CostBreakdown = {
      development: 18000,
      design: 4000,
      testing: 2000,
      deployment: 1000,
      maintenance: 3000,
      total: 28000,
      currency: 'GBP'
    };

    const uiuxPlan: UIUXPlan = {
      designSystem: 'Modern Material Design with custom branding',
      colorScheme: `Professional palette suitable for ${input.industry}`,
      typography: 'Clean, readable fonts optimized for mobile',
      userFlow: ['Onboarding → Authentication → Main Features → Settings'],
      wireframes: ['Welcome Screen', 'Login/Register', 'Dashboard', 'Core Features'],
      accessibility: ['Screen reader support', 'High contrast mode', 'Large text options']
    };

    return {
      executiveSummary: `Comprehensive ${input.appPurpose} solution for ${input.businessName} targeting ${input.targetAudience} in the ${input.industry} industry.`,
      features,
      technicalRequirements,
      developmentPhases,
      costBreakdown,
      uiuxPlan,
      totalTimelineWeeks: 14,
      mvpTimelineWeeks: 8,
      recommendedMVPFeatures: [features[0].id, features[1].id],
      marketAnalysis: `The ${input.industry} industry shows strong mobile adoption with ${input.targetAudience} being primary users.`,
      competitorInsights: ['Focus on user experience', 'Mobile-first approach', 'Strong onboarding'],
      revenueModel: ['Subscription model', 'In-app purchases', 'Premium features'],
      risksAndMitigation: ['Technical complexity - mitigate with experienced team', 'Market competition - focus on unique value proposition']
    };
  }

  /**
   * Main method to generate app plan
   */
  public async generatePlan(
    input: AppPlanInput, 
    options: AppPlanGenerationOptions = {
      model: 'gpt-4',
      includeMarketAnalysis: true,
      includeCostEstimates: true,
      includeWireframes: false,
      detailLevel: 'detailed',
      focusAreas: ['technical', 'business']
    }
  ): Promise<GeneratedAppPlan> {
    try {
      // Generate AI prompt
      const prompt = this.generatePlanPrompt(input, options);
      
      // Call AI model (mock for now)
      const aiResponse = await this.callAIModel(prompt, options.model, input);
      
      // Parse response into structured data
      const parsedPlan = this.parseAIResponse(aiResponse, input);
      
      // Create complete plan object
      const plan: GeneratedAppPlan = {
        id: this.generateUniqueId(),
        clientId: input.businessName.toLowerCase().replace(/\s+/g, '-'),
        businessName: input.businessName,
        generatedAt: new Date().toISOString(),
        modelUsed: options.model,
        version: '1.0',
        confidence: 85, // Mock confidence score
        status: 'draft',
        ...parsedPlan
      } as GeneratedAppPlan;
      
      // Store the plan
      this.storePlan(plan);
      
      return plan;
      
    } catch (error) {
      console.error('Error generating app plan:', error);
      throw new Error('Failed to generate app plan');
    }
  }

  /**
   * Store generated plan in localStorage
   */
  private storePlan(plan: GeneratedAppPlan): void {
    try {
      const existingPlans = this.getAllStoredPlans();
      existingPlans.push(plan);
      localStorage.setItem('generated-app-plans', JSON.stringify(existingPlans));
      
      // Also store the latest plan for quick access
      localStorage.setItem('latest-app-plan', JSON.stringify(plan));
      
      console.log('✅ App plan stored successfully:', plan.id);
    } catch (error) {
      console.error('Error storing app plan:', error);
    }
  }

  /**
   * Get stored plan by ID
   */
  public getStoredPlan(planId: string): GeneratedAppPlan | null {
    try {
      const plans = this.getAllStoredPlans();
      return plans.find(plan => plan.id === planId) || null;
    } catch (error) {
      console.error('Error retrieving plan:', error);
      return null;
    }
  }

  /**
   * Get all stored plans
   */
  public getAllStoredPlans(): GeneratedAppPlan[] {
    try {
      const data = localStorage.getItem('generated-app-plans');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving all plans:', error);
      return [];
    }
  }

  /**
   * Get latest generated plan
   */
  public getLatestPlan(): GeneratedAppPlan | null {
    try {
      const data = localStorage.getItem('latest-app-plan');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving latest plan:', error);
      return null;
    }
  }

  /**
   * Refine existing plan with user feedback
   */
  public async refinePlan(planId: string, feedback: string): Promise<GeneratedAppPlan> {
    const existingPlan = this.getStoredPlan(planId);
    if (!existingPlan) {
      throw new Error('Plan not found');
    }

    // In production, this would send the feedback to AI for plan refinement
    const refinedPlan: GeneratedAppPlan = {
      ...existingPlan,
      id: this.generateUniqueId(),
      version: (parseFloat(existingPlan.version) + 0.1).toFixed(1),
      generatedAt: new Date().toISOString(),
      status: 'draft'
    };

    this.storePlan(refinedPlan);
    return refinedPlan;
  }
}

// Export singleton instance
export const appPlanAgent = new AppPlanAgent(); 