
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SmartEarningSearch } from '@/components/earn/SmartEarningSearch';
import { EarningChatAssistant } from '@/components/earn/EarningChatAssistant';
import { EarnHeader } from '@/components/earn/header/EarnHeader';
import { SkillTreeContent } from '@/components/earn/content/SkillTreeContent';
import { SkillPath, Skill, UserSkillProgress } from '@/types/skills';
import { useAuthSession } from '@/hooks/useAuthSession';

const HowToEarn = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthSession();

  const { data: skillPaths, isLoading: isLoadingPaths } = useQuery({
    queryKey: ['skillPaths'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skill_paths')
        .select('*')
        .order('level', { ascending: true });
      
      if (error) throw error;
      return data as SkillPath[];
    }
  });

  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ['skills', selectedPath],
    queryFn: async () => {
      const query = supabase
        .from('skills')
        .select('*')
        .order('level', { ascending: true });
        
      if (selectedPath) {
        query.eq('path_id', selectedPath);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Skill[];
    },
    enabled: !!skillPaths
  });

  const { data: userProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['userSkillProgress', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_skill_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as UserSkillProgress[];
    },
    enabled: !!user?.id
  });

  const isLoading = isLoadingPaths || isLoadingSkills || isLoadingProgress;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <EarnHeader navigate={navigate} />
            <SmartEarningSearch onSearch={(query: string) => {}} />
            <SkillTreeContent 
              skillPaths={skillPaths || []}
              skills={skills || []}
              userProgress={userProgress || []}
              selectedPath={selectedPath}
              setSelectedPath={setSelectedPath}
              isLoading={isLoading}
            />
          </div>
        </div>
        <EarningChatAssistant />
      </div>
    </SidebarProvider>
  );
};

export default HowToEarn;
