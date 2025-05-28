
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bitcoin, GitBranch, Code, Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function MainProjectCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mb-6"
    >
      <Card 
        className="border border-purple-500/20 bg-gradient-to-br from-black/40 to-purple-900/10 hover:border-purple-500/40 cursor-pointer transition-all duration-300"
        onClick={() => navigate('/projects/ubahcrypt')}
      >
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 flex-shrink-0 flex justify-center md:justify-start">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#6E59A5] flex items-center justify-center ring-4 ring-[#9b87f5]/20">
                <Bitcoin size={42} className="text-white" />
              </div>
            </div>
            
            <div className="md:w-3/4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">UbahCrypt Project</h2>
                  <p className="text-purple-200/70 text-sm">Last updated: Today</p>
                </div>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/40">
                  Active
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-200/70">
                    <Code size={16} />
                    <span>Smart Contract</span>
                  </div>
                  <Progress value={80} className="h-2" indicatorClassName="bg-[#9b87f5]" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-200/70">
                    <Server size={16} />
                    <span>Backend Integration</span>
                  </div>
                  <Progress value={65} className="h-2" indicatorClassName="bg-[#9b87f5]" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-200/70">
                    <GitBranch size={16} />
                    <span>Testing</span>
                  </div>
                  <Progress value={45} className="h-2" indicatorClassName="bg-[#9b87f5]" />
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-3">
                <div className="text-purple-200/70 text-sm">
                  <strong>Next deadline:</strong> April 28, 2025
                </div>
                <Button 
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <span>View Project</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
