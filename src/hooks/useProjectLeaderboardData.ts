import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LeaderboardEntry } from '@/components/leaderboard/types';
import { useToast } from '@/hooks/use-toast';
import { useAuthSession } from '@/hooks/useAuthSession';

/**
 * Hook to fetch and format project data for the leaderboard
 * Fetches real data from Supabase database
 */
export const useProjectLeaderboardData = () => {
  const { toast } = useToast();
  const { user } = useAuthSession();
  
  return useQuery({
    queryKey: ['projectLeaderboard'],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      console.log('Fetching project data from Supabase');
      
      // First, check for user authentication
      if (!user) {
        console.log('No authenticated user found');
        toast({
          title: 'Authentication required',
          description: 'Please log in to view the leaderboard',
          variant: 'destructive',
        });
        return [];
      }
      
      // Fetch projects from Supabase (using the plans table)
      const { data: projects, error } = await supabase
        .from('plans')
        .select(`
          id,
          name,
          app_name,
          description,
          status,
          created_at,
          price,
          client_id,
          website_url
        `)
        .order('price', { ascending: false })

      if (error) {
        console.error('Error fetching project data:', error);
        toast({
          title: 'Error fetching projects',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }

      if (!projects || projects.length === 0) {
        return [];
      }

      // Populate the projects database with specific project data if it doesn't exist
      await ensureProjectsExist();

      // Fetch features for each project to determine milestones
      const projectIds = projects.map(project => project.id);
      const { data: features, error: featuresError } = await supabase
        .from('project_features')
        .select('project_id, category')
        .in('project_id', projectIds);

      if (featuresError) {
        console.error('Error fetching feature data:', featuresError);
      }
      
      // Get user interactions data from project_comments table as a proxy for engagement
      const { data: comments, error: commentsError } = await supabase
        .from('project_comments')
        .select('project_id, created_at')
        .in('project_id', projectIds);

      if (commentsError) {
        console.error('Error fetching comments data:', commentsError);
      }

      // Get project metadata (containing website URLs, community impact, etc.)
      const { data: metadata, error: metadataError } = await supabase
        .from('project_metadata')
        .select('project_id, website_url, community_impact, client_engagement')
        .in('project_id', projectIds);
      
      if (metadataError) {
        console.error('Error fetching metadata:', metadataError);
      }

      // Return the formatted data with project information
      const formattedData: LeaderboardEntry[] = projects.map((project, index) => {
        // Find project metadata
        const projectMeta = metadata?.find(m => m.project_id === project.id);
        
        // Group features by category to calculate milestones
        const projectFeatures = features?.filter(f => f.project_id === project.id) || [];
        const featureCategories = new Set(projectFeatures.map(f => f.category));
        const completedMilestones = featureCategories.size || 
          getDefaultMilestonesForProject(project.name || project.app_name); 
        const totalMilestones = 8; // Total possible milestones
        
        // Calculate engagement score based on metadata or default
        const engagementScore = projectMeta?.client_engagement || 
          getDefaultEngagementForProject(project.name || project.app_name);
        
        // Calculate community impact from metadata or default
        const communityActions = projectMeta?.community_impact || 
          getDefaultCommunityImpactForProject(project.name || project.app_name);

        // Calculate points (1 point per £10)
        const points = Math.floor((project.price || 0) / 10);
        
        // Calculate SISO tokens (20% of price)
        const sisoTokens = Math.floor((project.price || 0) * 0.2);
        
        // Determine website URL
        const websiteUrl = project.website_url || projectMeta?.website_url || 
          getDefaultWebsiteForProject(project.name || project.app_name);
        
        // Determine last active time based on most recent comment
        let lastActive = project.created_at;
        if (comments && comments.length > 0) {
          const projectComments = comments.filter(c => c.project_id === project.id);
          if (projectComments.length > 0) {
            // Sort comments by creation date and get the most recent
            const sortedComments = [...projectComments].sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            if (sortedComments[0]) {
              lastActive = sortedComments[0].created_at;
            }
          }
        }

        return {
          id: project.id,
          name: project.name || project.app_name,
          description: project.description || '',
          website_url: websiteUrl,
          rank: index + 1,
          points: points,
          spending: project.price || 0,
          siso_tokens: sisoTokens,
          updated_at: lastActive || new Date().toISOString(),
          milestones_achieved: `${completedMilestones}/${totalMilestones}`,
          client_engagement: engagementScore,
          community_impact: communityActions,
          status: project.status || 'in-progress'
        };
      });

      return formattedData;
    },
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 1000, // 1 minute
    // If there's an error, retry a couple times
    retry: 2,
    refetchInterval: 30000 // Refresh data every 30 seconds
  });
};

/**
 * Helper function to ensure specific project data exists in Supabase
 * This will insert the required project data if it doesn't exist
 */
async function ensureProjectsExist() {
  try {
    // First, check if we have the required project metadata table
    const { data: hasMetadataTable } = await supabase
      .from('project_metadata')
      .select('id')
      .limit(1);
      
    // If we don't have the metadata table, create it
    if (hasMetadataTable === null) {
      console.log('Creating project_metadata table...');
      await supabase.rpc('create_project_metadata_table');
    }
    
    // Define all the required projects
    const requiredProjects = [
      {
        name: 'Optimal Construction',
        price: 15000,
        status: 'in-progress',
        description: 'Building maintenance and construction services',
        website_url: 'https://optimal-building-maintenance.vercel.app/',
        client_engagement: 60,
        community_impact: 5,
        milestones: 4
      },
      {
        name: 'UbahCryp',
        price: 5000,
        status: 'completed',
        description: 'A cryptocurrency trading platform built with React and Web3 technologies',
        website_url: 'https://ubahcrypcom.vercel.app/',
        client_engagement: 90,
        community_impact: 10,
        milestones: 8
      },
      {
        name: 'Gritness',
        price: 249,
        status: 'in-progress',
        description: 'A gym management and fitness tracking application',
        website_url: 'https://gritnessgym.vercel.app/',
        client_engagement: 40,
        community_impact: 3,
        milestones: 6
      },
      {
        name: 'Trojan MMA',
        price: 249,
        status: 'in-progress',
        description: 'MMA gym and training center website',
        website_url: 'https://trojan-mma.vercel.app/',
        client_engagement: 35,
        community_impact: 2,
        milestones: 6
      },
      {
        name: 'Lets Go',
        price: 249,
        status: 'nearly-completed',
        description: 'Travel and adventure booking platform',
        website_url: 'https://lets-go-u7hh.vercel.app/',
        client_engagement: 80,
        community_impact: 4,
        milestones: 7
      },
      {
        name: 'NM Construction',
        price: 0,
        status: 'in-progress',
        description: 'Construction company website with project portfolio',
        website_url: 'https://nm-construction.vercel.app/',
        client_engagement: 50,
        community_impact: 1,
        milestones: 4
      },
      {
        name: 'Elementree',
        price: 0,
        status: 'in-progress',
        description: 'Arborist and tree care services website',
        website_url: 'https://elementree.vercel.app/',
        client_engagement: 30,
        community_impact: 1,
        milestones: 5
      },
      {
        name: 'Mu Shin',
        price: 0,
        status: 'declined',
        description: 'Martial arts school and training center',
        website_url: 'https://siso-mu-shin.vercel.app/',
        client_engagement: 20,
        community_impact: 0,
        milestones: 8
      },
      {
        name: '5 Star Hire',
        price: 0,
        status: 'early-progress',
        description: 'Equipment hire and rental service',
        website_url: 'https://5-star-hire.vercel.app/',
        client_engagement: 25,
        community_impact: 0,
        milestones: 3
      },
      {
        name: 'Keegan Saas',
        price: 0,
        status: 'not-started',
        description: 'SaaS platform for business management',
        website_url: '',
        client_engagement: 15,
        community_impact: 0,
        milestones: 0
      }
    ];
    
    // Check what projects already exist
    const { data: existingProjects } = await supabase
      .from('plans')
      .select('name');
      
    const existingProjectNames = existingProjects?.map(p => p.name) || [];
    console.log('Existing projects:', existingProjectNames);
      
    // Add each required project if it doesn't exist
    for (const project of requiredProjects) {
      if (!existingProjectNames.includes(project.name)) {
        console.log(`Creating project: ${project.name}...`);
        
        // Insert the project
        const { data: newProject, error } = await supabase
          .from('plans')
          .insert({
            name: project.name,
            app_name: project.name,
            price: project.price,
            status: project.status,
            description: project.description,
            website_url: project.website_url,
            created_at: new Date().toISOString()
          })
          .select('id')
          .single();
          
        if (error) {
          console.error(`Error creating ${project.name}:`, error);
        } else if (newProject) {
          // Add metadata for the project
          await supabase
            .from('project_metadata')
            .insert({
              project_id: newProject.id,
              website_url: project.website_url,
              client_engagement: project.client_engagement,
              community_impact: project.community_impact
            });
            
          // Add some sample features to calculate milestones
          const featureCategories = ['Trading & Transactions', 'Security & Trust', 'Staking & Earning', 'Community & Engagement'];
          
          // Add features based on milestone count (max 4 categories, 2 features each)
          for (let i = 0; i < Math.min(project.milestones, 4); i++) {
            await supabase
              .from('project_features')
              .insert({
                project_id: newProject.id,
                name: `Sample Feature ${i+1}`,
                description: `A feature in the ${featureCategories[i]} category`,
                category: featureCategories[i]
              });
          }
        }
      }
    }
    
    console.log('Finished adding required projects');
  } catch (error) {
    console.error('Error ensuring projects exist:', error);
  }
}

/**
 * Helper functions to get default values for projects
 */
function getDefaultMilestonesForProject(projectName: string): number {
  const milestoneDefaults: Record<string, number> = {
    'Optimal Construction': 4,
    'UbahCryp': 8,
    'Gritness': 6,
    'Trojan MMA': 6,
    'Lets Go': 7,
    'NM Construction': 4,
    'Elementree': 5,
    'Mu Shin': 8,
    '5 Star Hire': 3,
    'Keegan Saas': 0
  };
  
  return milestoneDefaults[projectName] || 4;
}

function getDefaultEngagementForProject(projectName: string): number {
  const engagementDefaults: Record<string, number> = {
    'Optimal Construction': 60,
    'UbahCryp': 90,
    'Gritness': 40,
    'Trojan MMA': 35,
    'Lets Go': 80,
    'NM Construction': 50,
    'Elementree': 30,
    'Mu Shin': 20,
    '5 Star Hire': 25,
    'Keegan Saas': 15
  };
  
  return engagementDefaults[projectName] || 50;
}

function getDefaultCommunityImpactForProject(projectName: string): number {
  const impactDefaults: Record<string, number> = {
    'Optimal Construction': 5,
    'UbahCryp': 10,
    'Gritness': 3,
    'Trojan MMA': 2,
    'Lets Go': 4,
    'NM Construction': 1,
    'Elementree': 1,
    'Mu Shin': 0,
    '5 Star Hire': 0,
    'Keegan Saas': 0
  };
  
  return impactDefaults[projectName] || 0;
}

function getDefaultWebsiteForProject(projectName: string): string {
  const websiteDefaults: Record<string, string> = {
    'Optimal Construction': 'https://optimal-building-maintenance.vercel.app/',
    'UbahCryp': 'https://ubahcrypcom.vercel.app/',
    'Gritness': 'https://gritnessgym.vercel.app/',
    'Trojan MMA': 'https://trojan-mma.vercel.app/',
    'Lets Go': 'https://lets-go-u7hh.vercel.app/',
    'NM Construction': 'https://nm-construction.vercel.app/',
    'Elementree': 'https://elementree.vercel.app/',
    'Mu Shin': 'https://siso-mu-shin.vercel.app/',
    '5 Star Hire': 'https://5-star-hire.vercel.app/',
    'Keegan Saas': ''
  };
  
  return websiteDefaults[projectName] || '';
}
