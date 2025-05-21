import { supabase } from '@/integrations/supabase/client';
import { PromptStretch, PromptStretchInsert, PromptStretchUpdate, AutoPrompt } from '@/types/auto-prompts';

const TABLE_NAME = 'prompt_stretches';

// Mock data for testing
const MOCK_STRETCHES: PromptStretch[] = [
  // Page 1 - UbahCrypt Login Page
  {
    id: 'stretch-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: 'UbahCrypt',
    page_number: 1,
    title: 'Login Page Components',
    description: 'Components for the login page including form, validation, and authentication',
    sequence: 1,
    status: 'completed',
    prompts_count: 3
  },
  {
    id: 'stretch-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: 'UbahCrypt',
    page_number: 1,
    title: 'Login Page Styling',
    description: 'CSS and responsive design for the login page',
    sequence: 2,
    status: 'in_progress',
    prompts_count: 2
  },
  // Page 2 - UbahCrypt Dashboard
  {
    id: 'stretch-3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: 'UbahCrypt',
    page_number: 2,
    title: 'Portfolio Dashboard',
    description: 'Dashboard showing cryptocurrency portfolio and performance',
    sequence: 1,
    status: 'in_progress',
    prompts_count: 4
  },
  {
    id: 'stretch-4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: 'UbahCrypt',
    page_number: 2,
    title: 'Market Overview',
    description: 'Market data and trends visualization',
    sequence: 2,
    status: 'not_started',
    prompts_count: 2
  },
  // Page 1 - Crypto Trading Platform
  {
    id: 'stretch-5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: 'Crypto Trading Platform',
    page_number: 1,
    title: 'Trading Interface',
    description: 'Main trading interface with order book and chart',
    sequence: 1,
    status: 'in_progress',
    prompts_count: 3
  },
  {
    id: 'stretch-6',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: 'Crypto Trading Platform',
    page_number: 1,
    title: 'Order Form',
    description: 'Form for placing market and limit orders',
    sequence: 2,
    status: 'completed',
    prompts_count: 2
  },
  // More pages for each project...
  {
    id: 'stretch-7',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: 'Crypto Trading Platform',
    page_number: 3,
    title: 'User Settings',
    description: 'User profile and account settings',
    sequence: 1,
    status: 'not_started',
    prompts_count: 2
  },
  // AgencyOS stretches
  {
    id: 'stretch-8',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: 'AgencyOS',
    page_number: 1,
    title: 'Dashboard Analytics',
    description: 'Analytics dashboard for agency performance',
    sequence: 1,
    status: 'in_progress',
    prompts_count: 3
  }
];

// Map stretches to some of our existing prompts
const stretchToPromptsMap: Record<string, string[]> = {
  'stretch-1': ['1'], // UbahCrypt Login Form
  'stretch-2': [], // Empty for now
  'stretch-3': ['2'], // UbahCrypt Portfolio Chart
  'stretch-5': ['6', '7'], // Crypto Trading Platform Order Book and Matching Algorithm
  'stretch-6': ['8'], // 2FA Setup
  'stretch-8': ['9', '10'] // AgencyOS Dashboard and Aggregation
};

export const promptStretchesService = {
  /**
   * Get all prompt stretches
   */
  getAll: async (): Promise<PromptStretch[]> => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('page_number', { ascending: true })
        .order('sequence', { ascending: true });

      if (error) {
        console.error('Error fetching prompt stretches:', error);
        return MOCK_STRETCHES;
      }

      return data as PromptStretch[];
    } catch (err) {
      console.error('Exception fetching prompt stretches:', err);
      return MOCK_STRETCHES;
    }
  },

  /**
   * Get prompt stretches for a specific project
   */
  getByProject: async (project: string): Promise<PromptStretch[]> => {
    if (!project) {
      console.error('Project name is undefined or empty');
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('project', project)
        .order('page_number', { ascending: true })
        .order('sequence', { ascending: true });

      if (error) {
        console.error(`Error fetching prompt stretches for project ${project}:`, error);
        return MOCK_STRETCHES.filter(item => item.project === project);
      }

      return data as PromptStretch[];
    } catch (err) {
      console.error(`Exception fetching prompt stretches for project ${project}:`, err);
      return MOCK_STRETCHES.filter(item => item.project === project);
    }
  },

  /**
   * Get prompt stretches for a specific project and page
   */
  getByProjectAndPage: async (project: string, pageNumber: number): Promise<PromptStretch[]> => {
    if (!project || !pageNumber) {
      console.error('Project name or page number is undefined or empty');
      return [];
    }
    
    try {
      // Try to use RPC function if available
      const { data, error } = await supabase.rpc(
        'get_prompt_stretches_by_page',
        { p_project: project, p_page_number: pageNumber }
      );
      
      if (error) {
        console.error(`Error using RPC for prompt stretches by page:`, error);
        
        // Fallback to direct query
        try {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('project', project)
            .eq('page_number', pageNumber)
            .order('sequence', { ascending: true });
            
          if (fallbackError) {
            console.error('Error in fallback stretch fetch:', fallbackError);
            return MOCK_STRETCHES.filter(item => 
              item.project === project && item.page_number === pageNumber
            );
          }
          
          return fallbackData as PromptStretch[];
        } catch (fallbackErr) {
          console.error('Exception in fallback approach:', fallbackErr);
          return MOCK_STRETCHES.filter(item => 
            item.project === project && item.page_number === pageNumber
          );
        }
      }
      
      return data as PromptStretch[];
    } catch (err) {
      console.error('Exception getting prompt stretches by page:', err);
      return MOCK_STRETCHES.filter(item => 
        item.project === project && item.page_number === pageNumber
      );
    }
  },

  /**
   * Get distinct page numbers for a project
   */
  getPageNumbersByProject: async (project: string): Promise<number[]> => {
    if (!project) {
      console.error('Project name is undefined or empty');
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('page_number')
        .eq('project', project)
        .order('page_number', { ascending: true });

      if (error) {
        console.error(`Error fetching page numbers for project ${project}:`, error);
        const mockPages = Array.from(
          new Set(
            MOCK_STRETCHES
              .filter(item => item.project === project)
              .map(item => item.page_number)
          )
        );
        return mockPages;
      }

      // Get unique page numbers
      const uniquePages = Array.from(new Set(data.map(item => item.page_number)));
      return uniquePages;
    } catch (err) {
      console.error(`Exception fetching page numbers for project ${project}:`, err);
      const mockPages = Array.from(
        new Set(
          MOCK_STRETCHES
            .filter(item => item.project === project)
            .map(item => item.page_number)
        )
      );
      return mockPages;
    }
  },

  /**
   * Get prompts for a specific stretch
   */
  getPromptsByStretch: async (stretchId: string): Promise<AutoPrompt[]> => {
    if (!stretchId) {
      console.error('Stretch ID is undefined or empty');
      return [];
    }
    
    try {
      // Try to use RPC function if available
      const { data, error } = await supabase.rpc(
        'get_prompts_by_stretch',
        { p_stretch_id: stretchId }
      );
      
      if (error) {
        console.error(`Error using RPC for prompts by stretch:`, error);
        
        // Fallback to direct query
        try {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('auto_prompts')
            .select('*')
            .eq('stretch_id', stretchId)
            .order('iteration', { ascending: true })
            .order('created_at', { ascending: true });
            
          if (fallbackError) {
            console.error('Error in fallback prompts fetch:', fallbackError);
            
            // Use our mock mapping as a fallback
            const promptIds = stretchToPromptsMap[stretchId] || [];
            const { data: autoPrompts } = await import('@/utils/auto-prompts-service');
            
            if (promptIds.length > 0) {
              return (await autoPrompts.autoPromptsService.getAll())
                .filter(p => promptIds.includes(p.id));
            }
            
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
      console.error('Exception getting prompts by stretch:', err);
      
      // Use our mock mapping as a final fallback
      const promptIds = stretchToPromptsMap[stretchId] || [];
      if (promptIds.length > 0) {
        const { autoPromptsService } = await import('@/utils/auto-prompts-service');
        return (await autoPromptsService.getAll())
          .filter(p => promptIds.includes(p.id));
      }
      
      return [];
    }
  },

  /**
   * Create a new prompt stretch
   */
  create: async (stretch: PromptStretchInsert): Promise<PromptStretch> => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([stretch])
        .select()
        .single();

      if (error) {
        console.error('Error creating prompt stretch:', error);
        // Return a mock created stretch
        const mockCreated: PromptStretch = {
          id: `stretch-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          prompts_count: 0,
          ...stretch
        };
        // Add to mock data for future operations
        MOCK_STRETCHES.push(mockCreated);
        return mockCreated;
      }

      return data as PromptStretch;
    } catch (err) {
      console.error('Exception creating prompt stretch:', err);
      // Return a mock created stretch
      const mockCreated: PromptStretch = {
        id: `stretch-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        prompts_count: 0,
        ...stretch
      };
      // Add to mock data for future operations
      MOCK_STRETCHES.push(mockCreated);
      return mockCreated;
    }
  },

  /**
   * Update an existing prompt stretch
   */
  update: async (id: string, updates: PromptStretchUpdate): Promise<PromptStretch> => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating prompt stretch ${id}:`, error);
        
        // Update the mock data and return the updated item
        const mockIndex = MOCK_STRETCHES.findIndex(item => item.id === id);
        if (mockIndex !== -1) {
          MOCK_STRETCHES[mockIndex] = {
            ...MOCK_STRETCHES[mockIndex],
            ...updates,
            updated_at: new Date().toISOString()
          };
          return MOCK_STRETCHES[mockIndex];
        }
        throw new Error(`Stretch with ID ${id} not found`);
      }

      return data as PromptStretch;
    } catch (err) {
      console.error(`Exception updating prompt stretch ${id}:`, err);
      
      // Update the mock data and return the updated item
      const mockIndex = MOCK_STRETCHES.findIndex(item => item.id === id);
      if (mockIndex !== -1) {
        MOCK_STRETCHES[mockIndex] = {
          ...MOCK_STRETCHES[mockIndex],
          ...updates,
          updated_at: new Date().toISOString()
        };
        return MOCK_STRETCHES[mockIndex];
      }
      throw new Error(`Stretch with ID ${id} not found`);
    }
  },

  /**
   * Delete a prompt stretch
   */
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting prompt stretch ${id}:`, error);
      }
      
      // Also remove from mock data
      const mockIndex = MOCK_STRETCHES.findIndex(item => item.id === id);
      if (mockIndex !== -1) {
        MOCK_STRETCHES.splice(mockIndex, 1);
      }
    } catch (err) {
      console.error(`Exception deleting prompt stretch ${id}:`, err);
      
      // Remove from mock data
      const mockIndex = MOCK_STRETCHES.findIndex(item => item.id === id);
      if (mockIndex !== -1) {
        MOCK_STRETCHES.splice(mockIndex, 1);
      }
    }
  }
}; 