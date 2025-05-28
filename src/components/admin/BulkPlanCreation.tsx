
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

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

  return (
    <Card className="border-siso-text/10 bg-black/30">
      <CardHeader>
        <CardTitle>Bulk Create Plans</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Template</label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="bg-black/20 border-siso-text/20">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Enter Usernames (one per line)
          </label>
          <textarea
            className="w-full h-32 p-2 bg-black/20 border border-siso-text/20 rounded-md"
            value={usernames}
            onChange={(e) => setUsernames(e.target.value)}
            placeholder="username1&#10;username2&#10;username3"
          />
        </div>

        <Button
          onClick={handleCreatePlans}
          disabled={loading}
          className="bg-gradient-to-r from-siso-red to-siso-orange"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Plans
        </Button>
      </CardContent>
    </Card>
  );
};
