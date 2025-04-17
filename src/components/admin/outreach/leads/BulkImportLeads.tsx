import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { ImportLead } from '@/hooks/useLeadImport';
import { ColumnMappings } from './ColumnMappings';
import { ValidationErrors } from './ValidationErrors';
import { useBulkImport } from '@/hooks/useBulkImport';
import { ImportHeader } from './import/ImportHeader';
import { FileInputSection } from './import/FileInputSection';
import { ImportProgress } from './import/ImportProgress';

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
}

export function BulkImportLeads() {
  const [rawData, setRawData] = useState('');
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [delimiter, setDelimiter] = useState('\t');
  const [previewData, setPreviewData] = useState<string[][]>([]);

  const {
    isProcessing,
    importProgress,
    validationErrors,
    processImport,
  } = useBulkImport();

  const handleDataInput = (content: string) => {
    setRawData(content);
    if (content) {
      const rows = content.split('\n').filter(row => row.trim());
      const firstRow = rows[0];
      const columns = firstRow.split(delimiter);
      
      setColumnMappings(columns.map(col => ({
        sourceColumn: col.trim(),
        targetField: ''
      })));

      setPreviewData(
        rows.slice(0, 6).map(row => row.split(delimiter))
      );
    } else {
      setPreviewData([]);
    }
  };

  const handleImport = async () => {
    if (!rawData.trim()) {
      toast.error('Please paste some data first');
      return;
    }

    if (!columnMappings.some(m => m.targetField === 'username')) {
      toast.error('Username field mapping is required');
      return;
    }

    try {
      const rows = rawData.split('\n').filter(row => row.trim());
      const parsedData: ImportLead[] = rows.slice(1).map(row => {
        const values = row.split(delimiter);
        const lead: Record<string, any> = { status: 'new' };
        
        columnMappings.forEach((mapping, index) => {
          if (mapping.targetField && values[index]) {
            const value = values[index].trim();
            if (['followers_count', 'following_count', 'posts_count'].includes(mapping.targetField)) {
              lead[mapping.targetField] = parseInt(value, 10) || null;
            } else {
              lead[mapping.targetField] = value;
            }
          }
        });
        
        return lead.username ? lead as ImportLead : null;
      }).filter(Boolean) as ImportLead[];

      if (parsedData.length === 0) {
        toast.error('No valid leads found in the data');
        return;
      }

      const success = await processImport(parsedData);
      if (success) {
        setRawData('');
        setColumnMappings([]);
        setPreviewData([]);
      }
    } catch (error) {
      console.error('Error parsing data:', error);
      toast.error('Failed to process data. Please check the format and try again.');
    }
  };

  return (
    <Card className="max-h-[80vh] overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <ImportHeader 
          delimiter={delimiter}
          onDelimiterChange={setDelimiter}
        />
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <FileInputSection
            rawData={rawData}
            previewData={previewData}
            columnMappings={columnMappings}
            onDataInput={handleDataInput}
          />

          {columnMappings.length > 0 && (
            <ColumnMappings
              columnMappings={columnMappings}
              onMappingChange={setColumnMappings}
            />
          )}

          <ValidationErrors errors={validationErrors} />

          <ImportProgress 
            isProcessing={isProcessing}
            importProgress={importProgress}
          />

          <Button 
            onClick={handleImport}
            disabled={isProcessing || !rawData.trim()}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-pulse" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import Leads
              </>
            )}
          </Button>
        </div>
      </ScrollArea>
    </Card>
  );
}
