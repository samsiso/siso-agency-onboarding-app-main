
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  ExternalLink, 
  ArrowRight, 
  Quote, 
  Users, 
  BarChart, 
  AlertTriangle,
  Info,
  ArrowUpRight,
  MessageSquare,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PainPoint } from './AgencyPainPoints';
import { Progress } from '@/components/ui/progress';

interface AgencyPainPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  painPoint: PainPoint | null;
  onRequestSolution?: () => void;
}

export const AgencyPainPointModal = ({ 
  isOpen, 
  onClose, 
  painPoint,
  onRequestSolution
}: AgencyPainPointModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!painPoint) return null;
  
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      default: return 'text-blue-500';
    }
  };
  
  const getSeverityBgColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'bg-red-500/10';
      case 'medium': return 'bg-amber-500/10';
      default: return 'bg-blue-500/10';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 border-siso-orange/20 text-white p-0">
        {/* Header section with background gradient */}
        <div className="bg-gradient-to-r from-siso-red/20 to-siso-orange/20 px-6 py-5 rounded-t-lg border-b border-siso-orange/20">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2.5 rounded-full ${getSeverityBgColor(painPoint.severity)}`}>
                {painPoint.icon}
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold text-white">
                  {painPoint.title}
                </DialogTitle>
                <p className="text-siso-text text-sm mt-1 flex items-center gap-1.5">
                  <span className={`${getSeverityColor(painPoint.severity)} font-medium`}>
                    {painPoint.severity === 'high' ? 'Critical Issue' : 
                     painPoint.severity === 'medium' ? 'Major Challenge' : 'Moderate Problem'}
                  </span>
                  <span className="text-siso-text/50">•</span>
                  <span>{painPoint.statistic}</span>
                </p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
            <div className="bg-black/30 text-siso-orange text-xs font-medium px-3 py-1.5 rounded inline-flex gap-1.5 items-center">
              <BarChart className="h-3.5 w-3.5" />
              <span>Survey finding: {painPoint.surveyData.percentage}% {painPoint.surveyData.label}</span>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-black/30 px-3 py-1.5 rounded cursor-pointer hover:bg-black/40 transition-colors"
              onClick={() => window.open("https://notion.so/agency-report", '_blank')}
            >
              <Info className="h-3.5 w-3.5 text-siso-orange" />
              <span>View Industry Research</span>
              <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </motion.div>
          </div>
        </div>
        
        {/* Body with tabs */}
        <div className="px-6 py-5">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-black/30 border border-siso-text/10 p-1 mb-5 w-full grid grid-cols-3">
              <TabsTrigger value="overview" className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange">
                Overview
              </TabsTrigger>
              <TabsTrigger value="solution" className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange">
                Solution
              </TabsTrigger>
              <TabsTrigger value="impact" className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange">
                Impact
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-0 space-y-5 animate-in fade-in-50 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-siso-orange" />
                  The Challenge
                </h3>
                <p className="text-siso-text">{painPoint.description}</p>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 border border-siso-text/10">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-siso-orange" />
                  Industry Survey Results
                </h4>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-siso-text">{painPoint.surveyData.label}</span>
                  <span className="text-siso-orange font-semibold">{painPoint.surveyData.percentage}%</span>
                </div>
                
                <div className="w-full h-2.5 bg-siso-text/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-siso-red to-siso-orange rounded-full"
                    style={{ width: `${painPoint.surveyData.percentage}%` }}
                  />
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {painPoint.impactAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-siso-text bg-black/20 p-2 rounded border border-siso-text/5">
                      <div className="h-1.5 w-1.5 rounded-full bg-siso-orange/70"></div>
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="solution" className="mt-0 space-y-5 animate-in fade-in-50 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-siso-orange" />
                  Our Approach
                </h3>
                <div className="space-y-3">
                  {painPoint.solutions.map((solution, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 bg-black/30 p-3 rounded-lg border border-siso-text/10"
                    >
                      <CheckCircle className="h-5 w-5 text-siso-orange shrink-0 mt-0.5" />
                      <div>
                        <p className="text-siso-text">{solution}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center my-2">
                <Button
                  className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white w-full sm:w-auto"
                  onClick={onRequestSolution}
                >
                  See Detailed Solution
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="impact" className="mt-0 space-y-5 animate-in fade-in-50 duration-300">
              {painPoint.testimonial && (
                <div className="bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-lg p-5 border border-siso-orange/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Quote className="h-5 w-5 text-siso-orange" />
                    <h4 className="text-white font-medium">Success Story</h4>
                  </div>
                  
                  <p className="text-siso-text italic mb-3 text-base">"{painPoint.testimonial.quote}"</p>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <div className="h-10 w-10 rounded-full bg-siso-orange/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-siso-orange" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{painPoint.testimonial.author}</p>
                      <p className="text-xs text-siso-text/70">{painPoint.testimonial.position}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-siso-orange" />
                  Expected Outcomes
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-black/30 p-3 rounded-lg border border-siso-text/10">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-siso-orange" />
                      <h4 className="text-white text-sm font-medium">Improved Communication</h4>
                    </div>
                    <Progress value={75} className="h-1.5 bg-black/50" indicatorClassName="bg-gradient-to-r from-siso-red to-siso-orange" />
                    <p className="text-xs text-siso-text mt-2">75% reduction in missed messages</p>
                  </div>
                  
                  <div className="bg-black/30 p-3 rounded-lg border border-siso-text/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-siso-orange" />
                      <h4 className="text-white text-sm font-medium">Client Retention</h4>
                    </div>
                    <Progress value={60} className="h-1.5 bg-black/50" indicatorClassName="bg-gradient-to-r from-siso-red to-siso-orange" />
                    <p className="text-xs text-siso-text mt-2">60% improvement in retention rates</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t border-siso-text/10 flex flex-col sm:flex-row sm:justify-between gap-4">
          <Button
            variant="outline"
            className="border-siso-orange/30 text-siso-orange hover:bg-siso-orange/10"
            onClick={() => window.open("https://notion.so/agency-report", '_blank')}
          >
            Read Full Agency Report
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
            onClick={onRequestSolution}
          >
            See Our Solution
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
