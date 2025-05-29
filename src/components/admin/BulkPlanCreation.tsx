import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, FileText, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Template {
  id: string;
  name: string;
  industry_type: string;
  app_name: string | null;
  branding: any;
  features: string[] | null;
  estimated_cost: number;
  estimated_days: number;
}

export const BulkPlanCreation = () => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [usernames, setUsernames] = useState<string>('');
  const { toast } = useToast();

  React.useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('plan_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast({
        variant: "destructive",
        title: "Error fetching templates",
        description: error.message
      });
    }
  };

  const handleCreatePlans = async () => {
    if (!selectedTemplate || !usernames.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a template and enter usernames"
      });
      return;
    }

    setLoading(true);
    try {
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) throw new Error("Template not found");

      const usernameList = usernames.split('\n')
        .map(u => u.trim())
        .filter(u => u.length > 0);

      // Create bulk creation record
      const { data: bulkCreation, error: bulkError } = await supabase
        .from('bulk_plan_creations')
        .insert({
          template_id: template.id,
          total_plans: usernameList.length,
          status: 'in_progress'
        })
        .select()
        .single();

      if (bulkError) throw bulkError;

      // Create plans for each username
      let created = 0;
      let failed = 0;

      for (const username of usernameList) {
        try {
          const { error: planError } = await supabase
            .from('plans')
            .insert({
              username,
              app_name: template.app_name,
              branding: template.branding,
              features: template.features,
              estimated_cost: template.estimated_cost,
              estimated_days: template.estimated_days,
              status: 'draft'
            });

          if (planError) {
            failed++;
            console.error(`Failed to create plan for ${username}:`, planError);
          } else {
            created++;
          }
        } catch (e) {
          failed++;
          console.error(`Failed to create plan for ${username}:`, e);
        }
      }

      // Update bulk creation record
      await supabase
        .from('bulk_plan_creations')
        .update({
          status: 'completed',
          created_plans: created,
          failed_plans: failed,
          completed_at: new Date().toISOString()
        })
        .eq('id', bulkCreation.id);

      toast({
        title: "Bulk creation completed",
        description: `Created ${created} plans, ${failed} failed`
      });

      setUsernames('');
    } catch (error: any) {
      console.error('Error in bulk creation:', error);
      toast({
        variant: "destructive",
        title: "Error creating plans",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const getUsernameCount = () => {
    return usernames.split('\n').filter(u => u.trim().length > 0).length;
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <Card className="border-blue-500/20 bg-gradient-to-br from-slate-900/90 via-blue-900/50 to-slate-900/90 backdrop-blur-sm shadow-xl rounded-xl">
      <CardHeader className="pb-8">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <CardTitle className="flex items-center text-white text-2xl font-bold">
              <Users className="mr-4 h-7 w-7 text-blue-400" />
              Bulk Create Plans
            </CardTitle>
            <p className="text-slate-200 text-base max-w-2xl leading-relaxed">
              Efficiently generate multiple user plans from existing templates. Perfect for onboarding multiple clients with consistent service offerings.
            </p>
          </div>
          {templates.length > 0 && (
            <Badge variant="outline" className="text-blue-400 border-blue-400/50 bg-blue-500/10 px-4 py-2">
              {templates.length} template{templates.length !== 1 ? 's' : ''} available
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Template Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white font-semibold text-lg flex items-center">
              <FileText className="w-5 h-5 mr-3 text-blue-400" />
              Select Template
            </Label>
            {selectedTemplateData && (
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-slate-200 font-medium">${selectedTemplateData.estimated_cost}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-200 font-medium">{selectedTemplateData.estimated_days} days</span>
              </div>
            )}
          </div>
          
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="bg-slate-800/60 border-slate-600/50 text-white hover:bg-slate-700/60 transition-all duration-300 h-12 rounded-lg shadow-lg">
              <SelectValue placeholder="Choose a template to bulk create from..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-800/95 border-slate-600/50 backdrop-blur-md rounded-lg">
              {templates.length === 0 ? (
                <SelectItem value="none" disabled className="text-slate-400">
                  No templates available
                </SelectItem>
              ) : (
                templates.map((template) => (
                  <SelectItem key={template.id} value={template.id} className="text-white hover:bg-slate-700/60 transition-colors duration-200">
                    <div className="flex items-center justify-between w-full">
                      <span>{template.name}</span>
                      <Badge variant="secondary" className="ml-3 text-xs bg-slate-700 text-slate-200">
                        {template.industry_type}
                      </Badge>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          {/* Template Preview */}
          {selectedTemplateData && (
            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-600/30 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/60">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-1">
                  <span className="text-slate-400 font-medium">App Name:</span>
                  <p className="text-white font-semibold text-base">{selectedTemplateData.app_name || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-medium">Industry:</span>
                  <p className="text-white font-semibold text-base">{selectedTemplateData.industry_type}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-medium">Features:</span>
                  <p className="text-white font-semibold text-base">{selectedTemplateData.features?.length || 0} included</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Username Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white font-semibold text-lg flex items-center">
              <Users className="w-5 h-5 mr-3 text-blue-400" />
              Enter Usernames
            </Label>
            {usernames.trim() && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 px-4 py-2">
                {getUsernameCount()} user{getUsernameCount() !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <Textarea
            value={usernames}
            onChange={(e) => setUsernames(e.target.value)}
            placeholder="Enter usernames, one per line:&#10;&#10;john_doe&#10;jane_smith&#10;client_company&#10;..."
            className="h-40 bg-slate-800/60 border-slate-600/50 text-white placeholder:text-slate-400 resize-none hover:bg-slate-700/60 focus:bg-slate-700/60 transition-all duration-300 rounded-lg shadow-lg"
          />
          
          <div className="flex items-center text-sm text-slate-300 space-x-6">
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              One username per line
            </span>
            <span className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-amber-400" />
              Empty lines will be ignored
            </span>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
          <div className="text-base text-slate-200">
            {selectedTemplate && usernames.trim() ? (
              <span className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-400" />
                Ready to create {getUsernameCount()} plan{getUsernameCount() !== 1 ? 's' : ''} from "{selectedTemplateData?.name}"
              </span>
            ) : (
              <span className="text-slate-400">Select a template and add usernames to continue</span>
            )}
          </div>
          
          <Button
            onClick={handleCreatePlans}
            disabled={loading || !selectedTemplate || !usernames.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 min-w-[160px] h-12 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Zap className="mr-3 h-5 w-5" />
                Create Plans
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
