
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PlanBuilderCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <Card 
        className="border-siso-border bg-gradient-to-br from-siso-red/20 to-siso-orange/5 hover:border-siso-orange/40 transition-all duration-300"
      >
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-siso-red/30 to-siso-orange/30 flex items-center justify-center mb-4">
              <Layout className="h-8 w-8 text-siso-orange" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Create a New Plan</h3>
            <p className="text-siso-text text-sm mb-4">
              Build detailed project plans and cost estimates for your clients
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
              onClick={() => navigate('/plan-builder')}
            >
              Start Building
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
