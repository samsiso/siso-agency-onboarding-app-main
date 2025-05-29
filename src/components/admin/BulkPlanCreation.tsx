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
    <Card className="border-orange-500/20 bg-gradient-to-r from-orange-900/20 to-red-900/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center text-white text-xl">
              <Users className="mr-3 h-6 w-6 text-orange-400" />
              Bulk Create Plans
            </CardTitle>
            <p className="text-neutral-200 text-sm max-w-2xl">
              Quickly generate multiple user plans from existing templates. Perfect for onboarding multiple clients with the same service offering.
            </p>
          </div>
          {templates.length > 0 && (
            <Badge variant="outline" className="text-orange-400 border-orange-400">
              {templates.length} template{templates.length !== 1 ? 's' : ''} available
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Template Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white font-medium flex items-center">
              <FileText className="w-4 h-4 mr-2 text-orange-400" />
              Select Template
            </Label>
            {selectedTemplateData && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-neutral-300">${selectedTemplateData.estimated_cost}</span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-300">{selectedTemplateData.estimated_days} days</span>
              </div>
            )}
          </div>
          
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 transition-colors">
              <SelectValue placeholder="Choose a template to bulk create from..." />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {templates.length === 0 ? (
                <SelectItem value="none" disabled className="text-gray-400">
                  No templates available
                </SelectItem>
              ) : (
                templates.map((template) => (
                  <SelectItem key={template.id} value={template.id} className="text-white hover:bg-gray-700">
                    <div className="flex items-center justify-between w-full">
                      <span>{template.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
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
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-neutral-400">App Name:</span>
                  <p className="text-white font-medium">{selectedTemplateData.app_name || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-neutral-400">Industry:</span>
                  <p className="text-white font-medium">{selectedTemplateData.industry_type}</p>
                </div>
                <div>
                  <span className="text-neutral-400">Features:</span>
                  <p className="text-white font-medium">{selectedTemplateData.features?.length || 0} included</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Username Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white font-medium flex items-center">
              <Users className="w-4 h-4 mr-2 text-orange-400" />
              Enter Usernames
            </Label>
            {usernames.trim() && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {getUsernameCount()} user{getUsernameCount() !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <Textarea
            value={usernames}
            onChange={(e) => setUsernames(e.target.value)}
            placeholder="Enter usernames, one per line:&#10;&#10;john_doe&#10;jane_smith&#10;client_company&#10;..."
            className="h-32 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 resize-none hover:bg-gray-700/50 focus:bg-gray-700/50 transition-colors"
          />
          
          <div className="flex items-center text-xs text-neutral-400 space-x-4">
            <span className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              One username per line
            </span>
            <span className="flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Empty lines will be ignored
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="text-sm text-neutral-300">
            {selectedTemplate && usernames.trim() ? (
              <span className="flex items-center">
                <Zap className="w-4 h-4 mr-1 text-orange-400" />
                Ready to create {getUsernameCount()} plan{getUsernameCount() !== 1 ? 's' : ''} from "{selectedTemplateData?.name}"
              </span>
            ) : (
              <span className="text-neutral-400">Select a template and add usernames to continue</span>
            )}
          </div>
          
          <Button
            onClick={handleCreatePlans}
            disabled={loading || !selectedTemplate || !usernames.trim()}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-200 min-w-[140px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Create Plans
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
