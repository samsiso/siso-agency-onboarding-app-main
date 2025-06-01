import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, Building, Target, CheckCircle } from 'lucide-react';

interface BusinessInfo {
  businessName: string;
  appPurpose: string;
  industry: string;
  targetAudience: string;
  completedAt: string;
}

export function BusinessOnboarding() {
  const [businessName, setBusinessName] = useState('');
  const [appPurpose, setAppPurpose] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();

  // Load existing data if available
  useEffect(() => {
    const savedData = localStorage.getItem('business-onboarding-data');
    if (savedData) {
      const data: BusinessInfo = JSON.parse(savedData);
      setBusinessName(data.businessName || '');
      setAppPurpose(data.appPurpose || '');
      setIndustry(data.industry || '');
      setTargetAudience(data.targetAudience || '');
    }
  }, []);

  const handleComplete = async () => {
    if (!businessName.trim() || !appPurpose.trim()) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in your business name and app purpose',
        variant: 'destructive',
      });
      return;
    }

    setIsCompleting(true);

    const businessData: BusinessInfo = {
      businessName: businessName.trim(),
      appPurpose: appPurpose.trim(),
      industry: industry.trim(),
      targetAudience: targetAudience.trim(),
      completedAt: new Date().toISOString(),
    };

    try {
      // Save to localStorage
      localStorage.setItem('business-onboarding-data', JSON.stringify(businessData));
      
      // Mark the onboarding task as completed
      const completedTasks = JSON.parse(localStorage.getItem('workflow-completed-tasks') || '[]');
      if (!completedTasks.includes('workflow-1')) {
        completedTasks.push('workflow-1');
        localStorage.setItem('workflow-completed-tasks', JSON.stringify(completedTasks));
      }

      toast({
        title: 'Business information saved! 🎉',
        description: `Welcome ${businessName}! Your information has been recorded.`,
      });

      // Navigate back to dashboard to see progress
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      toast({
        title: 'Error saving information',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const isValid = businessName.trim() && appPurpose.trim();

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <Card className="p-6 md:p-8 bg-black/30 border border-white/10">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building className="h-8 w-8 text-orange-500" />
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Tell Us About Your Business
            </h2>
            <p className="text-gray-300">
              Let's start by understanding your business and what you want to build
            </p>
          </div>

          <div className="space-y-6">
            {/* Business Name */}
            <div className="space-y-2">
              <label htmlFor="businessName" className="text-sm font-medium text-white flex items-center gap-2">
                <Building className="h-4 w-4 text-orange-500" />
                Business/Company Name *
              </label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., SISO Agency, My Startup, etc."
                className="bg-black/30 border-white/20 focus-visible:ring-orange-500/50 text-white placeholder:text-gray-500"
              />
            </div>

            {/* App Purpose */}
            <div className="space-y-2">
              <label htmlFor="appPurpose" className="text-sm font-medium text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-500" />
                What do you want your app to do? *
              </label>
              <Textarea
                id="appPurpose"
                value={appPurpose}
                onChange={(e) => setAppPurpose(e.target.value)}
                placeholder="e.g., Help customers book appointments, Manage my inventory, Create a social network for pet owners, etc."
                className="bg-black/30 border-white/20 focus-visible:ring-orange-500/50 min-h-[100px] text-white placeholder:text-gray-500"
              />
            </div>

            {/* Industry (Optional) */}
            <div className="space-y-2">
              <label htmlFor="industry" className="text-sm font-medium text-white">
                Industry (optional)
              </label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Healthcare, E-commerce, Education, etc."
                className="bg-black/30 border-white/20 focus-visible:ring-orange-500/50 text-white placeholder:text-gray-500"
              />
            </div>

            {/* Target Audience (Optional) */}
            <div className="space-y-2">
              <label htmlFor="targetAudience" className="text-sm font-medium text-white">
                Who will use your app? (optional)
              </label>
              <Input
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Small business owners, Students, Pet owners, etc."
                className="bg-black/30 border-white/20 focus-visible:ring-orange-500/50 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Progress indicator */}
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="text-orange-400 font-medium text-sm">Step 1 of 3</p>
                <p className="text-orange-300 text-xs">Business Information</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-white/20 hover:bg-white/10 text-gray-300"
            >
              Back to Dashboard
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={!isValid || isCompleting}
              className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
            >
              {isCompleting ? 'Saving...' : 'Complete Step 1'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Required fields note */}
          <p className="text-xs text-gray-500 text-center">
            * Required fields. You can always update this information later.
          </p>
        </div>
      </Card>
    </div>
  );
} 