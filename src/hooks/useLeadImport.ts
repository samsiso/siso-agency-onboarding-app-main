
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ImportLead {
  username: string;
  full_name?: string | null;
  followers_count?: number | null;
  following_count?: number | null;
  posts_count?: number | null;
  bio?: string | null;
  profile_url?: string | null;
  status?: string;
}

export const useLeadImport = () => {
  const importLeads = useMutation({
    mutationFn: async (leads: ImportLead[]) => {
      // Basic validation of required fields
      const validLeads = leads.filter(lead => lead.username);
      
      if (validLeads.length === 0) {
        throw new Error('No valid leads to import');
      }

      // Insert leads in batches of 50
      const BATCH_SIZE = 50;
      const results: Array<any> = [];

      for (let i = 0; i < validLeads.length; i += BATCH_SIZE) {
        const batch = validLeads.slice(i, i + BATCH_SIZE);
        const formattedBatch = batch.map(lead => ({
          ...lead,
          username: lead.username,  // Ensure username is present
          status: lead.status || 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        
        const { data, error } = await supabase
          .from('instagram_leads')
          .upsert(formattedBatch, { onConflict: 'username' });

        if (error) throw error;
        if (data) results.push(...(data as Array<any>));
      }

      return results;
    },
    onSuccess: (data) => {
      toast.success(`Successfully imported ${data.length} leads`);
    },
    onError: (error: Error) => {
      toast.error(`Import failed: ${error.message}`);
      console.error('Lead import error:', error);
    }
  });

  return {
    importLeads,
    isImporting: importLeads.isPending
  };
};
