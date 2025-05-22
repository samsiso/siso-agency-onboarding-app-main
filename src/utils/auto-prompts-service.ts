import { supabase } from '@/integrations/supabase/client';
import { AutoPrompt, AutoPromptInsert, AutoPromptUpdate, CycleStep, CycleStatus } from '@/types/auto-prompts';
import { ProjectPrompt, ProjectPromptInsert, ProjectPromptUpdate, ProjectPromptResponse } from '@/types/project-prompts';

// Table name for project prompts
const TABLE_NAME = 'project_prompts';
// Secondary table name - try this if primary doesn't work
const SECONDARY_TABLE_NAME = 'ui_prompts';

// Mock data for testing
const MOCK_DATA: AutoPrompt[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: 'Ubah Inc.',
    project: 'UbahCrypt',
    domain: 'Frontend',
    module: 'Authentication',
    feature: 'User Login',
    component: 'LoginForm',
    prompt: 'Create a React component for user login with email and password fields, with proper validation using zod schema. It should connect to the Supabase auth.signIn method and include error handling for invalid credentials.',
    response: '',
    cycle_number: 1,
    cycle_step: CycleStep.Planning,
    cycle_status: CycleStatus.InProgress,
    status: 'completed',
    priority: 'high',
    notes: 'Login feature for cryptocurrency exchange',
    tags: ['authentication', 'form', 'validation'],
    step: 1,
    stage: 'Implementation',
    stretch_id: 'stretch-1',
    iteration: 1
  },
  {
    id: '1b',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    client: 'Ubah Inc.',
    project: 'UbahCrypt',
    domain: 'Frontend',
    module: 'Authentication',
    feature: 'User Login',
    component: 'LoginForm',
    prompt: 'Add social login options (Google, GitHub) to the login component. Use the Supabase auth.signIn method with the provider parameter. Include proper styling for the social login buttons with icons.',
    status: 'in_progress',
    priority: 'medium',
    notes: 'Enhancement to the login feature',
    tags: ['authentication', 'social-login', 'UI'],
    step: 2,
    stage: 'Implementation',
    stretch_id: 'stretch-1',
    iteration: 2
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: 'Ubah Inc.',
    project: 'UbahCrypt',
    domain: 'Frontend',
    module: 'Dashboard',
    feature: 'Portfolio Overview',
    component: 'PortfolioChart',
    prompt: 'Create a responsive chart component using recharts that displays cryptocurrency holdings with price history. Include tooltips for detailed information and color coding based on performance.',
    status: 'in_progress',
    priority: 'medium',
    notes: 'Main dashboard visualization for the crypto portfolio',
    tags: ['data-visualization', 'charts', 'dashboard'],
    step: 2,
    stage: 'Implementation',
    stretch_id: 'stretch-3',
    iteration: 1
  },
  {
    id: '2b',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: 'Ubah Inc.',
    project: 'UbahCrypt',
    domain: 'Frontend',
    module: 'Dashboard',
    feature: 'Portfolio Overview',
    component: 'PortfolioChart',
    prompt: 'Update the portfolio chart to include time range selectors (1D, 1W, 1M, 1Y, All) and add animation for data transitions. Implement loading states and error handling for API data fetching.',
    status: 'draft',
    priority: 'low',
    notes: 'Enhancement for better user experience',
    tags: ['data-visualization', 'charts', 'UX'],
    step: 3,
    stage: 'Planning',
    stretch_id: 'stretch-3',
    iteration: 2
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: 'Ubah Inc.',
    project: 'UbahCrypt',
    domain: 'Backend',
    module: 'API',
    feature: 'Price Fetching',
    prompt: 'Implement a serverless function to fetch current cryptocurrency prices from CoinGecko API. Include caching to minimize API calls and rate limiting to prevent overuse.',
    status: 'draft',
    priority: 'critical',
    notes: 'Core functionality for price tracking',
    tags: ['api', 'pricing', 'serverless'],
    step: 1,
    stage: 'Planning'
  },
  {
    id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: 'SISO',
    project: 'SisoAgency',
    domain: 'Backend',
    module: 'Client Management',
    feature: 'Client Onboarding',
    component: 'OnboardingFlow',
    prompt: 'Create a step-by-step onboarding flow for agency clients with progress tracking and data validation at each step. The flow should include company information, project requirements, and billing details.',
    status: 'in_progress',
    priority: 'high',
    notes: 'Critical onboarding process for new clients',
    step: 1,
    stage: 'Development'
  },
  {
    id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: 'SISO',
    project: 'SisoAgency',
    domain: 'Frontend',
    module: 'Analytics',
    feature: 'Performance Dashboard',
    component: 'MetricsDisplay',
    prompt: 'Build an analytics dashboard that displays key performance metrics for agency clients, including project status, timeline adherence, and budget tracking. Use nivo charts for data visualization.',
    status: 'draft',
    priority: 'medium',
    notes: 'Dashboard for client performance tracking',
    step: 2,
    stage: 'Design'
  },
  {
    id: '6',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: 'ExchangePro Ltd',
    project: 'Crypto Trading Platform',
    domain: 'Frontend',
    module: 'Trading Interface',
    feature: 'Order Book',
    component: 'OrderBookDisplay',
    prompt: 'Create a real-time order book component that shows bid and ask orders with depth visualization. Use WebSockets for live updates and include animations for price changes.',
    status: 'in_progress',
    priority: 'high',
    notes: 'Core trading functionality for the exchange platform',
    tags: ['trading', 'real-time', 'websockets'],
    step: 1,
    stage: 'Development',
    stretch_id: 'stretch-5',
    iteration: 1
  },
  {
    id: '7',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: 'ExchangePro Ltd',
    project: 'Crypto Trading Platform',
    domain: 'Backend',
    module: 'Trading Engine',
    feature: 'Order Matching',
    component: 'MatchingAlgorithm',
    prompt: 'Implement a high-performance order matching algorithm for the trading engine. It should support market, limit, stop, and iceberg orders with optimized matching logic.',
    status: 'draft',
    priority: 'critical',
    notes: 'Critical component for exchange functionality',
    tags: ['algorithm', 'performance', 'trading-engine'],
    step: 2,
    stage: 'Planning',
    stretch_id: 'stretch-5',
    iteration: 1
  },
  {
    id: '8',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: 'ExchangePro Ltd',
    project: 'Crypto Trading Platform',
    domain: 'Security',
    module: 'Authentication',
    feature: 'Two-Factor Authentication',
    component: '2FASetup',
    prompt: 'Implement a comprehensive 2FA system with support for authenticator apps, SMS, and hardware keys. Include a recovery process and proper security measures.',
    status: 'completed',
    priority: 'high',
    notes: 'Security enhancement for user accounts',
    tags: ['security', '2fa', 'authentication'],
    step: 3,
    stage: 'Testing',
    stretch_id: 'stretch-6',
    iteration: 1
  },
  {
    id: '9',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: 'SISO',
    project: 'AgencyOS',
    domain: 'Frontend',
    module: 'Admin Portal',
    feature: 'Dashboard Overview',
    component: 'MetricsCards',
    prompt: 'Create a responsive dashboard overview with key metrics cards that display agency performance data. Include visualizations for revenue, client satisfaction, and project completion rates.',
    status: 'in_progress',
    priority: 'high',
    notes: 'Main dashboard for agency admins',
    tags: ['dashboard', 'metrics', 'visualization'],
    step: 1,
    stage: 'Development'
  },
  {
    id: '10',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: 'SISO',
    project: 'AgencyOS',
    domain: 'Backend',
    module: 'Analytics',
    feature: 'Data Aggregation',
    component: 'AggregationService',
    prompt: 'Implement a data aggregation service that collects metrics from various sources (Stripe, project management tools, CRM) and prepares consolidated reports for the dashboard.',
    status: 'draft',
    priority: 'medium',
    notes: 'Backend service for metrics collection',
    tags: ['analytics', 'integration', 'data-processing'],
    step: 2,
    stage: 'Planning'
  },
  {
    id: '11',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: 'SISO',
    project: 'AgencyOS',
    domain: 'DevOps',
    module: 'Deployment',
    feature: 'CI/CD Pipeline',
    component: 'GithubActions',
    prompt: 'Set up a GitHub Actions workflow for continuous integration and deployment. Include automated testing, build optimization, and deployment to Vercel for preview and production environments.',
    status: 'completed',
    priority: 'high',
    notes: 'Automation for deployment process',
    tags: ['devops', 'ci-cd', 'automation'],
    step: 3,
    stage: 'Implementation'
  }
];

// Update all mock data entries to include required fields
MOCK_DATA.forEach(prompt => {
  if (!prompt.response) prompt.response = '';
  if (!prompt.cycle_number) prompt.cycle_number = 1;
  if (!prompt.cycle_step) prompt.cycle_step = CycleStep.Planning;
  if (!prompt.cycle_status) prompt.cycle_status = CycleStatus.InProgress;
});

// Add to our mock data some page_name and prompt_type values
MOCK_DATA.forEach((prompt, index) => {
  if (index < 3) { // First 3 prompts for UbahCrypt
    prompt.page_name = 'Login Page';
    prompt.page_route = '/auth';
    prompt.prompt_type = ['analyze', 'plan', 'code'][index % 3] as any;
  } else if (index >= 3 && index < 6) { // Next 3 prompts for UbahCrypt
    prompt.page_name = 'Dashboard Page';
    prompt.page_route = '/dashboard';
    prompt.prompt_type = ['plan', 'code', 'review'][index % 3] as any;
  } else if (index >= 6 && index < 9) { // Next 3 prompts for Crypto Trading Platform
    prompt.page_name = 'Trading View';
    prompt.page_route = '/trade';
    prompt.prompt_type = ['analyze', 'plan', 'code'][index % 3] as any;
  } else if (index >= 9) { // Remaining prompts
    prompt.page_name = 'Settings Page';
    prompt.page_route = '/settings';
    prompt.prompt_type = ['analyze', 'code', 'improve'][index % 3] as any;
  }
});

// Add domain information to mock data
MOCK_DATA.forEach((prompt) => {
  // Set domain based on the pattern in the data
  if (!prompt.domain) {
    if (prompt.project === 'UbahCrypt' || prompt.project === 'SisoAgency') {
      prompt.domain = 'Frontend';
    } else if (prompt.module === 'API' || prompt.module === 'Trading Engine') {
      prompt.domain = 'Backend';
    } else {
      prompt.domain = 'Research';
    }
  }
});

export const autoPromptsService = {
  /**
   * Get the current table name being used
   */
  getTableName: () => TABLE_NAME,

  /**
   * Debug function to test database connection and query for a specific project
   */
  debugProjectPrompts: async (project: string): Promise<any> => {
    console.log(`Debug query for project "${project}" on table "${TABLE_NAME}"`);
    
    try {
      // Test 1: Direct exact match
      const exactMatch = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact' })
        .eq('project', project);
      
      console.log('Exact match result:', {
        count: exactMatch.count,
        error: exactMatch.error,
        data: exactMatch.data?.length || 0,
        first: exactMatch.data?.[0]
      });
      
      // Test 2: Case-insensitive match
      const caseInsensitiveMatch = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact' })
        .ilike('project', project);
      
      console.log('Case-insensitive match result:', {
        count: caseInsensitiveMatch.count,
        error: caseInsensitiveMatch.error,
        data: caseInsensitiveMatch.data?.length || 0,
        first: caseInsensitiveMatch.data?.[0]
      });
      
      // Test 3: List all available projects
      const { data: projectNames, error: projectsError } = await supabase
        .from(TABLE_NAME)
        .select('project')
        .limit(10);
      
      const uniqueProjects = projectNames 
        ? Array.from(new Set(projectNames.map(item => item.project)))
        : [];
      
      console.log('Available projects in database:', {
        error: projectsError,
        projects: uniqueProjects
      });

      return {
        exactMatch: {
          count: exactMatch.count,
          hasError: !!exactMatch.error,
          errorMessage: exactMatch.error?.message,
          dataCount: exactMatch.data?.length || 0
        },
        caseInsensitiveMatch: {
          count: caseInsensitiveMatch.count,
          hasError: !!caseInsensitiveMatch.error,
          errorMessage: caseInsensitiveMatch.error?.message,
          dataCount: caseInsensitiveMatch.data?.length || 0
        },
        availableProjects: uniqueProjects
      };
    } catch (err) {
      console.error('Debug error:', err);
      return { error: String(err) };
    }
  },

  /**
   * Get all auto prompts
   */
  getAll: async (): Promise<AutoPrompt[]> => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching auto prompts:', error);
        // Return empty array instead of mock data
        return [];
      }

      return data as AutoPrompt[];
    } catch (err) {
      console.error('Exception fetching auto prompts:', err);
      return [];
    }
  },

  /**
   * Get auto prompts for a specific project
   */
  getByProject: async (project: string): Promise<ProjectPromptResponse> => {
    try {
      // First get the count
      const { count, error: countError } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true })
        .eq('project', project);

      if (countError) {
        console.error('Error getting count:', countError);
        return { data: null, error: countError, count: 0 };
      }

      // Then get the actual data
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('project', project)
        .order('prompt_cycle_number', { ascending: true });

      if (error) {
        console.error('Error fetching prompts:', error);
        return { data: null, error, count: 0 };
      }

      return { 
        data: data as ProjectPrompt[], 
        error: null, 
        count: count || 0 
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      return { 
        data: null, 
        error: error as Error, 
        count: 0 
      };
    }
  },

  /**
   * Get distinct projects from auto prompts
   */
  getProjects: async (): Promise<string[]> => {
    try {
      // Try to use RPC function if available
      const { data, error } = await supabase.rpc('get_distinct_projects');
      
      if (error) {
        console.error('Error using RPC for distinct projects:', error);
        
        // Fallback to direct query
        try {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from(TABLE_NAME)
            .select('project');
            
          if (fallbackError) {
            console.error('Error in fallback project fetch:', fallbackError);
            return [];
          }
          
          const uniqueProjects = Array.from(new Set(fallbackData.map(item => item.project)));
          return uniqueProjects;
        } catch (fallbackErr) {
          console.error('Exception in fallback approach:', fallbackErr);
          return [];
        }
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception getting projects:', err);
      return [];
    }
  },

  /**
   * Create a new auto prompt
   */
  create: async (prompt: ProjectPromptInsert): Promise<{ data: ProjectPrompt | null; error: Error | null }> => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([prompt])
        .select()
        .single();

      if (error) {
        console.error('Error creating prompt:', error);
        return { data: null, error };
      }

      return { data: data as ProjectPrompt, error: null };
    } catch (error) {
      console.error('Unexpected error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Update an existing auto prompt
   */
  update: async (id: number, updates: ProjectPromptUpdate): Promise<{ data: ProjectPrompt | null; error: Error | null }> => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating prompt:', error);
        return { data: null, error };
      }

      return { data: data as ProjectPrompt, error: null };
    } catch (error) {
      console.error('Unexpected error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Delete an auto prompt
   */
  delete: async (id: number): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting prompt:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error:', error);
      return { error: error as Error };
    }
  },

  /**
   * Get auto prompts for a specific page
   */
  getByPage: async (project: string, pageName: string): Promise<AutoPrompt[]> => {
    if (!project || !pageName) {
      console.error('Project or page name is undefined or empty');
      return [];
    }
    
    try {
      // Try to use RPC function if available
      const { data, error } = await supabase.rpc(
        'get_prompts_by_page',
        { p_project: project, p_page_name: pageName }
      );
      
      if (error) {
        console.error(`Error using RPC for prompts by page:`, error);
        
        // Fallback to direct query
        try {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('project', project)
            .eq('page_name', pageName)
            .order('prompt_type', { ascending: true })
            .order('created_at', { ascending: true });
            
          if (fallbackError) {
            console.error('Error in fallback prompts fetch:', fallbackError);
            return [];
          }
          
          return fallbackData as AutoPrompt[];
        } catch (fallbackErr) {
          console.error('Exception in fallback approach:', fallbackErr);
          return [];
        }
      }
      
      return data as AutoPrompt[];
    } catch (err) {
      console.error(`Exception fetching prompts for page ${pageName}:`, err);
      return [];
    }
  },

  /**
   * Get distinct page names for a project
   */
  getPagesByProject: async (project: string): Promise<string[]> => {
    if (!project) {
      console.error('Project name is undefined or empty');
      return [];
    }
    
    try {
      // Try to use RPC function if available
      const { data, error } = await supabase.rpc(
        'get_distinct_pages_by_project',
        { p_project: project }
      );
      
      if (error) {
        console.error(`Error using RPC for distinct pages:`, error);
        
        // Fallback to direct query
        try {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from(TABLE_NAME)
            .select('page_name')
            .eq('project', project)
            .is('page_name', 'not.null');
            
          if (fallbackError) {
            console.error('Error in fallback page names fetch:', fallbackError);
            return [];
          }
          
          // Extract unique page names
          const uniquePages = Array.from(
            new Set(
              fallbackData
                .filter(item => item.page_name)
                .map(item => item.page_name)
            )
          );
          
          return uniquePages;
        } catch (fallbackErr) {
          console.error('Exception in fallback approach:', fallbackErr);
          return [];
        }
      }
      
      return data || [];
    } catch (err) {
      console.error(`Exception fetching page names for project ${project}:`, err);
      return [];
    }
  },

  /**
   * Get distinct domains for a project
   */
  getDomainsByProject: async (project: string): Promise<string[]> => {
    if (!project) {
      console.error('Project name is undefined or empty');
      return [];
    }
    
    try {
      // Try direct query for distinct domains
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('domain')
        .eq('project', project)
        .is('domain', 'not.null');
        
      if (error) {
        console.error(`Error fetching domains for project ${project}:`, error);
        return [];
      }
      
      // Extract unique domains
      const uniqueDomains = Array.from(
        new Set(
          data
            .filter(item => item.domain)
            .map(item => item.domain)
        )
      );
      
      return uniqueDomains;
    } catch (err) {
      console.error(`Exception fetching domains for project ${project}:`, err);
      return [];
    }
  },
  
  /**
   * Get prompts by domain for a project
   */
  getPromptsByDomain: async (project: string, domain: string): Promise<AutoPrompt[]> => {
    if (!project || !domain) {
      console.error('Project or domain is undefined or empty');
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('project', project)
        .eq('domain', domain)
        .order('page_name', { ascending: true })
        .order('prompt_type', { ascending: true })
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error(`Error fetching prompts for domain ${domain}:`, error);
        return [];
      }
      
      return data as AutoPrompt[];
    } catch (err) {
      console.error(`Exception fetching prompts for domain ${domain}:`, err);
      return [];
    }
  },

  /**
   * Get project prompts by project name
   */
  getProjectPrompts: async (project: string): Promise<ProjectPromptResponse> => {
    if (!project) {
      console.error('Project name is undefined or empty');
      return { data: null, error: new Error('Project name is required'), count: 0 };
    }

    try {
      const { data, error, count } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact' })
        .ilike('project', project) // Using ilike for case-insensitive comparison
        .order('prompt_cycle_number', { ascending: true });

      if (error) {
        console.error('Error fetching project prompts:', error);
        return { data: null, error, count: 0 };
      }

      return { data: data as ProjectPrompt[], error: null, count: count || 0 };
    } catch (err) {
      console.error('Exception fetching project prompts:', err);
      return { data: null, error: err as Error, count: 0 };
    }
  },

  /**
   * Create a new project prompt
   */
  createProjectPrompt: async (prompt: ProjectPromptInsert): Promise<{ data: ProjectPrompt | null; error: Error | null }> => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(prompt)
        .select()
        .single();

      if (error) {
        console.error('Error creating project prompt:', error);
        return { data: null, error };
      }

      return { data: data as ProjectPrompt, error: null };
    } catch (err) {
      console.error('Exception creating project prompt:', err);
      return { data: null, error: err as Error };
    }
  },

  /**
   * Update a project prompt
   */
  updateProjectPrompt: async (id: number, updates: ProjectPromptUpdate): Promise<{ data: ProjectPrompt | null; error: Error | null }> => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project prompt:', error);
        return { data: null, error };
      }

      return { data: data as ProjectPrompt, error: null };
    } catch (err) {
      console.error('Exception updating project prompt:', err);
      return { data: null, error: err as Error };
    }
  },

  /**
   * Delete a project prompt
   */
  deleteProjectPrompt: async (id: number): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project prompt:', error);
        return { error };
      }

      return { error: null };
    } catch (err) {
      console.error('Exception deleting project prompt:', err);
      return { error: err as Error };
    }
  },

  /**
   * Search project prompts by keyword
   */
  searchProjectPrompts: async (project: string, searchTerm: string): Promise<ProjectPromptResponse> => {
    if (!project) {
      console.error('Project name is undefined or empty');
      return { data: null, error: new Error('Project name is required'), count: 0 };
    }

    try {
      // Use ilike for case-insensitive search across multiple columns
      const { data, error, count } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact' })
        .ilike('project', project) // Using ilike for case-insensitive comparison
        .or(`prompt.ilike.%${searchTerm}%,page.ilike.%${searchTerm}%,domain.ilike.%${searchTerm}%`)
        .order('prompt_cycle_number', { ascending: true });

      if (error) {
        console.error('Error searching project prompts:', error);
        return { data: null, error, count: 0 };
      }

      return { data: data as ProjectPrompt[], error: null, count: count || 0 };
    } catch (err) {
      console.error('Exception searching project prompts:', err);
      return { data: null, error: err as Error, count: 0 };
    }
  }
}; 