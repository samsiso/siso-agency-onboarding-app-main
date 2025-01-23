import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { AssistantCard } from '@/components/assistants/AssistantCard';
import { AssistantDetails } from '@/components/assistants/AssistantDetails';
import { FloatingOrbs } from '@/components/effects/FloatingOrbs';

export default function ChatGPTAssistants() {
  const [selectedAssistant, setSelectedAssistant] = useState(null);

  const { data: assistants, isLoading } = useQuery({
    queryKey: ['gpt-assistants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gpt_resources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-b from-siso-bg via-black to-siso-bg relative overflow-hidden">
        <FloatingOrbs />
        
        <div className="container mx-auto p-6 relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text mb-6">
            GPT Assistants
          </h1>

          {isLoading ? (
            <div className="text-siso-text">Loading assistants...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {assistants?.map((assistant) => (
                <AssistantCard
                  key={assistant.id}
                  assistant={assistant}
                  onClick={setSelectedAssistant}
                />
              ))}
            </div>
          )}

          <AssistantDetails
            assistant={selectedAssistant}
            onClose={() => setSelectedAssistant(null)}
          />
        </div>
      </div>
    </div>
  );
}