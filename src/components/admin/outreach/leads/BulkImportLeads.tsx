import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeadImport, ImportLead } from '@/hooks/useLeadImport';
import { DataPreview } from './DataPreview';
import { downloadTemplate } from '@/utils/downloadUtils';
import { FileUpload } from './FileUpload';
import { FileText, Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';

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
  const [delimiter, setDelimiter] = useState('\t');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { importLeads, isImporting } = useLeadImport();

  const handleFileSelect = (content: string) => {
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

  const handleDataPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const pastedData = e.target.value;
    setRawData(pastedData);
    
    if (pastedData) {
      const rows = pastedData.split('\n').filter(row => row.trim());
      const firstRow = rows[0];
      const columns = firstRow.split(delimiter);
      
      setColumnMappings(columns.map(col => ({
        sourceColumn: col.trim(),
        targetField: ''
      })));

      // Set preview data
      setPreviewData(
        rows.slice(0, 6).map(row => row.split(delimiter))
      );
    } else {
      setPreviewData([]);
    }
  };

  const validateData = (data: ImportLead[]): string[] => {
    const errors: string[] = [];
    
    if (!data.length) {
      errors.push('No valid data to import');
      return errors;
    }

    // Check for required username field
    const missingUsernames = data.some(lead => !lead.username);
    if (missingUsernames) {
      errors.push('All leads must have a username');
    }

    // Validate numeric fields
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

  const handleImport = async () => {
    try {
      setIsProcessing(true);
      setValidationErrors([]);
      setImportProgress(0);
      
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
      setRawData('');
      setColumnMappings([]);
      setImportProgress(0);
      
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
            <FileUpload onFileSelect={handleFileSelect} />
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
              onChange={handleDataPaste}
            />
          </div>

          {previewData.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                Preview (first 5 rows)
              </h4>
              <DataPreview 
                data={previewData} 
                columnMappings={columnMappings}
              />
            </div>
          )}

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

        {validationErrors.length > 0 && (
          <div className="bg-destructive/10 p-4 rounded-md space-y-2">
            <div className="font-medium text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Validation Errors
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-destructive">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

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
