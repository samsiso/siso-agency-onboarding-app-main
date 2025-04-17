
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download, Upload } from 'lucide-react';
import { ImportLead } from '@/hooks/useLeadImport';
import { DataPreview } from './DataPreview';
import { FileUpload } from './FileUpload';
import { ColumnMappings } from './ColumnMappings';
import { ValidationErrors } from './ValidationErrors';
import { useBulkImport } from '@/hooks/useBulkImport';
import { downloadTemplate } from '@/utils/downloadUtils';

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
    setValidationErrors
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

    const rows = rawData.split('\n').filter(row => row.trim());
    const parsedData: ImportLead[] = rows.slice(1).map(row => {
      const values = row.split(delimiter);
      const lead: Record<string, any> = { status: 'new' };
      
      columnMappings.forEach((mapping, index) => {
        if (mapping.targetField && values[index]) {
          if (['followers_count', 'following_count', 'posts_count'].includes(mapping.targetField)) {
            lead[mapping.targetField] = parseInt(values[index], 10) || null;
          } else {
            lead[mapping.targetField] = values[index].trim();
          }
        }
      });
      
      return lead.username ? lead as ImportLead : null;
    }).filter(Boolean) as ImportLead[];

    const success = await processImport(parsedData);
    if (success) {
      setRawData('');
      setColumnMappings([]);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Bulk Import Leads</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
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
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Upload a file or paste your data below</span>
            </div>
            <FileUpload onFileSelect={handleDataInput} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Or paste your data here</span>
            </div>
            <Textarea
              placeholder="Paste your data here (tab or comma separated)..."
              className="min-h-[200px] font-mono"
              value={rawData}
              onChange={(e) => handleDataInput(e.target.value)}
            />
          </div>

          {previewData.length > 0 && (
            <DataPreview 
              data={previewData} 
              columnMappings={columnMappings}
            />
          )}

          {columnMappings.length > 0 && (
            <ColumnMappings
              columnMappings={columnMappings}
              onMappingChange={setColumnMappings}
            />
          )}

          <ValidationErrors errors={validationErrors} />

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importing leads...</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <Progress value={importProgress} className="h-2" />
            </div>
          )}

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
      </div>
    </Card>
  );
}
