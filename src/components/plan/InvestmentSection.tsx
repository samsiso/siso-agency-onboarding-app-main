
import { DollarSign } from 'lucide-react';
import { PlanData } from '@/contexts/plan/PlanContext';

interface InvestmentSectionProps {
  planData: PlanData;
}

export const InvestmentSection: React.FC<InvestmentSectionProps> = ({ planData }) => {
  return (
    <div className="mt-4 bg-black/20 backdrop-blur-sm border border-siso-text/10 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
        <DollarSign className="h-5 w-5 mr-2 text-siso-orange" />
        Investment
      </h3>
      
      <div className="bg-black/30 rounded-lg border border-siso-text/10 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-white font-medium">Platform Implementation</h4>
            <span className="text-siso-orange font-semibold">£{planData.estimated_cost}</span>
          </div>
          <p className="text-sm text-siso-text mb-4">
            One-time setup fee including customization, training, and data migration
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-siso-text">Base Platform</span>
              <span className="text-siso-text">£3,997</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-siso-text">Customization & Branding</span>
              <span className="text-siso-text">£500</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-siso-text">Training & Onboarding</span>
              <span className="text-siso-text">£500</span>
            </div>
          </div>
          
          <div className="border-t border-siso-text/10 pt-4 flex justify-between items-center">
            <span className="text-white font-medium">Monthly Subscription</span>
            <span className="text-siso-orange font-semibold">£997/month</span>
          </div>
          <p className="text-sm text-siso-text">
            Includes hosting, maintenance, updates, and standard support
          </p>
        </div>
      </div>
    </div>
  );
};
