
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

interface ImportResults {
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export const useLeadImport = () => {
  const importLeads = useMutation({
    mutationFn: async (leads: ImportLead[]): Promise<ImportResults> => {
      const validLeads = leads.filter(lead => lead.username);
      
      if (validLeads.length === 0) {
        throw new Error('No valid leads to import');
      }

      const results: ImportResults = {
        inserted: 0,
        updated: 0,
        skipped: 0,
        errors: []
      };

      const BATCH_SIZE = 50;

      for (let i = 0; i < validLeads.length; i += BATCH_SIZE) {
        const batch = validLeads.slice(i, i + BATCH_SIZE);
        const formattedBatch = batch.map(lead => ({
          ...lead,
          username: lead.username.toLowerCase().trim(),
          status: lead.status || 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        
        const { data, error } = await supabase
          .from('instagram_leads')
          .upsert(formattedBatch, {
            onConflict: 'username',
            ignoreDuplicates: false
          })
          .select();

        if (error) {
          console.error('Batch import error:', error);
          results.errors.push(`Error importing batch ${i / BATCH_SIZE + 1}: ${error.message}`);
          continue;
        }

        if (data) {
          // Count how many records were updated vs inserted
          const newRecords = data.filter(d => d.created_at === d.updated_at).length;
          results.inserted += newRecords;
          results.updated += (data.length - newRecords);
        }
      }

      return results;
    },
    onSuccess: (results) => {
      if (results.errors.length > 0) {
        toast.error(`Import completed with some errors. Check console for details.`);
        console.error('Import errors:', results.errors);
      } else {
        toast.success(
          `Successfully imported leads:\n${results.inserted} new leads added\n${results.updated} existing leads updated`
        );
      }
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
