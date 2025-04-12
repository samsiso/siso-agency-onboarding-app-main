
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface CreatePlanFormProps {
  onPlanCreated: () => void;
  onCancel: () => void;
}

export const CreatePlanForm = ({ onPlanCreated, onCancel }: CreatePlanFormProps) => {
  const [formData, setFormData] = useState({
    username: '',
    company_name: '',
    app_name: 'OnlyFans Management Suite',
    features: ['Content Management', 'Analytics Dashboard', 'Client Portal', 'Messaging System'],
    estimated_cost: 4997,
    estimated_days: 14,
    status: 'draft',
    branding: {
      primary_color: '#3182CE',
      secondary_color: '#805AD5'
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.company_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Username and company name are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from('plans')
        .insert([formData])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Plan created successfully.",
      });
      
      onPlanCreated();
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Error",
        description: "Failed to create plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-black/20 border border-siso-text/10 p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-xl font-semibold text-white">Create New Plan</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username (required)</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="bg-black/30 border-siso-text/20"
              required
            />
            <p className="text-xs text-siso-text/60">
              This will be used in the plan URL: /plan/username
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name (required)</Label>
            <Input
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Enter company name"
              className="bg-black/30 border-siso-text/20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="app_name">App Name</Label>
            <Input
              id="app_name"
              name="app_name"
              value={formData.app_name}
              onChange={handleChange}
              placeholder="Enter app name"
              className="bg-black/30 border-siso-text/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="draft, pending, approved, etc."
              className="bg-black/30 border-siso-text/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estimated_cost">Estimated Cost (£)</Label>
            <Input
              id="estimated_cost"
              name="estimated_cost"
              type="number"
              value={formData.estimated_cost}
              onChange={(e) => setFormData({...formData, estimated_cost: parseInt(e.target.value) || 0})}
              className="bg-black/30 border-siso-text/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estimated_days">Estimated Days</Label>
            <Input
              id="estimated_days"
              name="estimated_days"
              type="number"
              value={formData.estimated_days}
              onChange={(e) => setFormData({...formData, estimated_days: parseInt(e.target.value) || 0})}
              className="bg-black/30 border-siso-text/20"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-siso-red to-siso-orange"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Plan'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
