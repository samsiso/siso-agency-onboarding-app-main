
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SmartEarningSearch } from '@/components/earn/SmartEarningSearch';
import { EarningChatAssistant } from '@/components/earn/EarningChatAssistant';
import { EarnHeader } from '@/components/earn/header/EarnHeader';
import { EarnContent } from '@/components/earn/content/EarnContent';

const HowToEarn = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const navigate = useNavigate();

  const { data: pointConfigs, isLoading } = useQuery({
    queryKey: ['pointConfigurations'],
    queryFn: async () => {
      console.log('Fetching point configurations...');
      const { data, error } = await supabase
        .from('point_configurations')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching point configurations:', error);
        throw error;
      }
      
      console.log('Point configurations fetched:', data);
      return data;
    }
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <EarnHeader navigate={navigate} />
            <SmartEarningSearch onSearch={(query: string) => {}} />
            <EarnContent 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              pointConfigs={pointConfigs || []}
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
