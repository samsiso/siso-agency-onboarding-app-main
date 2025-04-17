
import { useState } from 'react';
import { toast } from 'sonner';
import { useLeadImport, ImportLead } from '@/hooks/useLeadImport';

export type ImportMode = 'skip' | 'update' | 'fail';

export const useBulkImport = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<ImportMode>('skip');
  
  const { importLeads } = useLeadImport();

  const validateData = (data: ImportLead[]): string[] => {
    const errors: string[] = [];
    
    if (!data.length) {
      errors.push('No valid data to import');
      return errors;
    }

    // Track usernames for duplicate checking within the import set
    const usernamesInBatch = new Set<string>();
    
    data.forEach((lead, index) => {
      // Required field validation
      if (!lead.username) {
        errors.push(`Row ${index + 1}: Username is required`);
        return;
      }

      const normalizedUsername = lead.username.toLowerCase().trim();
      
      // Check for duplicates within the current import batch
      if (usernamesInBatch.has(normalizedUsername)) {
        errors.push(`Row ${index + 1}: Duplicate username "${lead.username}" in import set`);
      }
      usernamesInBatch.add(normalizedUsername);

      // Validate numeric fields
      const numericFields = ['followers_count', 'following_count', 'posts_count'] as const;
      numericFields.forEach(field => {
        const value = lead[field];
        if (value !== undefined && value !== null) {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0) {
            errors.push(`Row ${index + 1}: ${field} must be a non-negative number`);
          }
        }
      });

      // URL format validation
      if (lead.profile_url && !lead.profile_url.startsWith('https://')) {
        errors.push(`Row ${index + 1}: Profile URL must start with https://`);
      }
    });

    return errors;
  };

  const cleanData = (data: ImportLead[]): ImportLead[] => {
    return data.map(lead => ({
      username: lead.username?.toLowerCase().trim(),
      full_name: lead.full_name?.trim(),
      bio: lead.bio?.trim(),
      profile_url: lead.profile_url?.trim(),
      followers_count: lead.followers_count ? Number(lead.followers_count) : null,
      following_count: lead.following_count ? Number(lead.following_count) : null,
      posts_count: lead.posts_count ? Number(lead.posts_count) : null,
      status: lead.status || 'new'
    }));
  };

  const processImport = async (parsedData: ImportLead[]) => {
    try {
      setIsProcessing(true);
      setValidationErrors([]);
      setImportProgress(0);

      const errors = validateData(parsedData);
      if (errors.length > 0) {
        setValidationErrors(errors);
        toast.error('Please fix validation errors before importing');
        return false;
      }

      const cleanedData = cleanData(parsedData);
      const BATCH_SIZE = 50;
      const totalBatches = Math.ceil(cleanedData.length / BATCH_SIZE);
      
      let totalInserted = 0;
      let totalUpdated = 0;
      let totalSkipped = 0;
      
      for (let i = 0; i < cleanedData.length; i += BATCH_SIZE) {
        const batch = cleanedData.slice(i, i + BATCH_SIZE);
        const results = await importLeads.mutateAsync({
          leads: batch,
          mode: importMode
        });
        
        totalInserted += results.inserted;
        totalUpdated += results.updated;
        totalSkipped += results.skipped;
        
        const progress = Math.min(((i + BATCH_SIZE) / cleanedData.length) * 100, 100);
        setImportProgress(progress);
      }

      const message = [
        totalInserted > 0 ? `${totalInserted} leads added` : '',
        totalUpdated > 0 ? `${totalUpdated} leads updated` : '',
        totalSkipped > 0 ? `${totalSkipped} leads skipped` : ''
      ].filter(Boolean).join(', ');

      toast.success(`Import complete: ${message}`);
      return true;
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import leads');
      return false;
    } finally {
      setIsProcessing(false);
      setImportProgress(0);
    }
  };

  return {
    isProcessing,
    importProgress,
    validationErrors,
    importMode,
    setImportMode,
    processImport,
    setValidationErrors
  };
};
