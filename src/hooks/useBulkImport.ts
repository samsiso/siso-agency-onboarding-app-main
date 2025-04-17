
import { useState } from 'react';
import { toast } from 'sonner';
import { useLeadImport, ImportLead } from '@/hooks/useLeadImport';

export const useBulkImport = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const { importLeads } = useLeadImport();

  const validateData = (data: ImportLead[]): string[] => {
    const errors: string[] = [];
    
    if (!data.length) {
      errors.push('No valid data to import');
      return errors;
    }

    const missingUsernames = data.some(lead => !lead.username);
    if (missingUsernames) {
      errors.push('All leads must have a username');
    }

    const numericFields = ['followers_count', 'following_count', 'posts_count'];
    data.forEach((lead, index) => {
      numericFields.forEach(field => {
        if (lead[field as keyof ImportLead] && isNaN(Number(lead[field as keyof ImportLead]))) {
          errors.push(`Row ${index + 1}: ${field} must be a number`);
        }
      });
    });

    return errors;
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
        return;
      }

      const BATCH_SIZE = 50;
      const totalBatches = Math.ceil(parsedData.length / BATCH_SIZE);
      
      for (let i = 0; i < parsedData.length; i += BATCH_SIZE) {
        const batch = parsedData.slice(i, i + BATCH_SIZE);
        await importLeads.mutateAsync(batch);
        
        const progress = Math.min(((i + BATCH_SIZE) / parsedData.length) * 100, 100);
        setImportProgress(progress);
      }

      toast.success(`Successfully imported ${parsedData.length} leads`);
      return true;
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import leads');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    importProgress,
    validationErrors,
    processImport,
    setValidationErrors
  };
};
