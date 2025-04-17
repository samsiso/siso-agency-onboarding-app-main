
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
  updatedUsernames: string[];
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
        errors: [],
        updatedUsernames: []
      };

      const BATCH_SIZE = 50;
      
      // First, check which usernames already exist to determine inserts vs updates
      const allUsernames = validLeads.map(lead => lead.username.toLowerCase().trim());
      const { data: existingLeads } = await supabase
        .from('instagram_leads')
        .select('username')
        .in('username', allUsernames);
      
      // Create a set of existing usernames for quick lookups
      const existingUsernameSet = new Set(existingLeads?.map(lead => lead.username.toLowerCase()) || []);

      for (let i = 0; i < validLeads.length; i += BATCH_SIZE) {
        const batch = validLeads.slice(i, i + BATCH_SIZE);
        const formattedBatch = batch.map(lead => ({
          ...lead,
          username: lead.username.toLowerCase().trim(),
          status: lead.status || 'new',
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
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
          // Count inserted vs updated based on whether username existed before
          for (const record of data) {
            const username = record.username.toLowerCase();
            if (existingUsernameSet.has(username)) {
              results.updated++;
              results.updatedUsernames.push(username);
            } else {
              results.inserted++;
            }
          }
        }
      }

      return results;
    },
    onSuccess: (results) => {
      if (results.errors.length > 0) {
        toast.error(`Import completed with some errors. Check console for details.`);
        console.error('Import errors:', results.errors);
      } else {
        const message = `Successfully imported leads:\n${results.inserted} new leads added\n${results.updated} existing leads updated`;
        
        if (results.updatedUsernames.length > 0) {
          console.info('Updated usernames:', results.updatedUsernames);
        }
        
        toast.success(message);
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
