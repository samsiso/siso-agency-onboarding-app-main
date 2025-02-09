
import { VideoAnalysis } from '@/components/education/types/analysis';
import { Card } from '@/components/ui/card';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Clock,
  Calculator,
  BookOpen,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BusinessTabProps {
  analysis: VideoAnalysis;
}

export const BusinessTab = ({ analysis }: BusinessTabProps) => {
  const { business_metrics, client_resources } = analysis;
  
  return (
    <div className="space-y-6">
      {/* ROI & Implementation Costs */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-siso-red" />
          Business Impact Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div 
            className="p-4 bg-white/5 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Implementation Costs
            </h4>
            <div className="space-y-2">
              <p className="text-sm">Small Team: ${business_metrics.implementation_costs.small_team || 'N/A'}</p>
              <p className="text-sm">Medium Team: ${business_metrics.implementation_costs.medium_team || 'N/A'}</p>
              <p className="text-sm">Enterprise: ${business_metrics.implementation_costs.enterprise || 'N/A'}</p>
            </div>
          </motion.div>

          <motion.div 
            className="p-4 bg-white/5 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              ROI Metrics
            </h4>
            <div className="space-y-2">
              <p className="text-sm">Time Savings: {business_metrics.roi_metrics.time_savings || 'N/A'}%</p>
              <p className="text-sm">Cost Savings: {business_metrics.roi_metrics.cost_savings || 'N/A'}%</p>
              <p className="text-sm">Productivity Gain: {business_metrics.roi_metrics.productivity_gain || 'N/A'}%</p>
            </div>
          </motion.div>

          <motion.div 
            className="p-4 bg-white/5 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Resource Requirements
            </h4>
            <div className="space-y-2">
              <p className="text-sm">Team Size: {business_metrics.resource_requirements.team_size || 'N/A'} members</p>
              <p className="text-sm">Required Skills: {business_metrics.resource_requirements.skill_levels.join(', ') || 'N/A'}</p>
            </div>
          </motion.div>
        </div>
      </Card>

      {/* Industry Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-siso-red" />
          Industry Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-medium">Market Trends</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {business_metrics.industry_insights.market_trends.map((trend, i) => (
                <li key={i}>{trend}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-medium">Competitor Analysis</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {business_metrics.industry_insights.competitor_analysis.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-medium">Best Practices</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {business_metrics.industry_insights.best_practices.map((practice, i) => (
                <li key={i}>{practice}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Card>

      {/* Client Resources */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-siso-red" />
          Client Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-medium">Implementation Guides</h4>
            {client_resources.implementation_guides.map((guide, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-lg">
                <h5 className="font-medium text-sm">{guide.title}</h5>
                <p className="text-sm text-gray-400 mt-1">{guide.content}</p>
                <span className="inline-block px-2 py-1 text-xs bg-white/10 rounded mt-2">
                  {guide.difficulty}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-medium">Success Metrics</h4>
            {client_resources.success_metrics.map((metric, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-sm">{metric.metric}</h5>
                  <p className="text-sm text-gray-400">Target: {metric.target} {metric.unit}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </motion.div>
        </div>
      </Card>

      {/* Implementation Timeline */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-siso-red" />
          Implementation Timeline
        </h3>
        <div className="space-y-4">
          {client_resources.timeline_templates.map((timeline, i) => (
            <motion.div 
              key={i}
              className="p-4 bg-white/5 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{timeline.name}</h4>
                  <p className="text-sm text-gray-400">Duration: {timeline.duration}</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="space-y-2">
                {timeline.milestones.map((milestone, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-siso-red" />
                    {milestone}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};
