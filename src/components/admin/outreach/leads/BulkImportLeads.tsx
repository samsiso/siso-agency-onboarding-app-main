import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeadImport, ImportLead } from '@/hooks/useLeadImport';

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
}

const AVAILABLE_FIELDS = [
  { value: 'username', label: 'Username' },
  { value: 'full_name', label: 'Full Name' },
  { value: 'followers_count', label: 'Followers Count' },
  { value: 'following_count', label: 'Following Count' },
  { value: 'posts_count', label: 'Posts Count' },
  { value: 'bio', label: 'Bio' },
  { value: 'profile_url', label: 'Profile URL' },
];

export function BulkImportLeads() {
  const [rawData, setRawData] = useState('');
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [delimiter, setDelimiter] = useState('\t'); // Default to tab
  const [isProcessing, setIsProcessing] = useState(false);

  const { importLeads, isImporting } = useLeadImport();

  const handleDataPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const pastedData = e.target.value;
    setRawData(pastedData);
    
    // Auto-detect columns from first row
    if (pastedData) {
      const firstRow = pastedData.split('\n')[0];
      const columns = firstRow.split(delimiter);
      
      setColumnMappings(columns.map(col => ({
        sourceColumn: col.trim(),
        targetField: ''
      })));
    }
  };

  const handleImport = async () => {
    try {
      setIsProcessing(true);
      
      // Basic validation
      if (!rawData.trim()) {
        toast.error('Please paste some data first');
        return;
      }

      if (!columnMappings.some(m => m.targetField === 'username')) {
        toast.error('Username field mapping is required');
        return;
      }

      // Parse the data
      const rows = rawData.split('\n').filter(row => row.trim());
      const parsedData: ImportLead[] = rows.slice(1).map(row => {
        const values = row.split(delimiter);
        const lead: Record<string, any> = { status: 'new' };
        
        columnMappings.forEach((mapping, index) => {
          if (mapping.targetField && values[index]) {
            // Convert numeric fields
            if (['followers_count', 'following_count', 'posts_count'].includes(mapping.targetField)) {
              lead[mapping.targetField] = parseInt(values[index], 10) || null;
            } else {
              lead[mapping.targetField] = values[index].trim();
            }
          }
        });

        // Ensure username is always present
        if (!lead.username) {
          return null;
        }
        
        return lead as ImportLead;
      }).filter(Boolean) as ImportLead[];

      // Import the leads using the hook
      if (parsedData.length > 0) {
        await importLeads.mutateAsync(parsedData);
        
        // Clear the form on success
        setRawData('');
        setColumnMappings([]);
      } else {
        toast.error('No valid leads found to import');
      }
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import leads');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold">Bulk Import Leads</h3>
          <Select
            value={delimiter}
            onValueChange={setDelimiter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select delimiter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="\t">Tab</SelectItem>
              <SelectItem value=",">Comma</SelectItem>
              <SelectItem value=";">Semicolon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Paste your data here (tab or comma separated)..."
          className="min-h-[200px] font-mono"
          value={rawData}
          onChange={handleDataPaste}
        />

        {columnMappings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Column Mappings</h4>
            <div className="grid gap-2">
              {columnMappings.map((mapping, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-1/3">
                    {mapping.sourceColumn}
                  </span>
                  <Select
                    value={mapping.targetField}
                    onValueChange={(value) => {
                      const newMappings = [...columnMappings];
                      newMappings[index].targetField = value;
                      setColumnMappings(newMappings);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Map to field..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Skip this column</SelectItem>
                      {AVAILABLE_FIELDS.map(field => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={handleImport}
          disabled={isProcessing || !rawData.trim()}
          className="w-full"
        >
          {isProcessing ? 'Importing...' : 'Import Leads'}
        </Button>
      </div>
    </Card>
  );
}
