
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface ClientAppFeaturesProps {
  features: string[];
}

export function ClientAppFeatures({ features }: ClientAppFeaturesProps) {
  // If no features are provided, show some default ones
  const displayFeatures = features.length > 0 
    ? features 
    : [
        'User Authentication', 
        'Dashboard Analytics', 
        'Content Management',
        'Notifications',
        'Payment Processing',
        'Admin Controls'
      ];

  return (
    <Card className="bg-black/30 border-siso-text/10">
      <CardContent className="p-8">
        <h2 className="text-xl font-semibold mb-6 text-white">App Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-4 bg-black/20 border border-gray-800 rounded-lg p-4"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-siso-red to-siso-orange flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span className="text-white">{feature}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
