
import { Bot, Sparkles, Filter } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from 'framer-motion';

export function HeaderAlerts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Alert className="bg-gradient-to-br from-siso-text/5 to-transparent border border-siso-text/10 backdrop-blur-sm">
          <Bot className="h-4 w-4 text-siso-orange" />
          <AlertDescription className="text-siso-text/90">
            <span className="font-semibold text-siso-text">AI Assistants:</span> Browse specialized AI assistants for tasks like code generation and workflow optimization.
          </AlertDescription>
        </Alert>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Alert className="bg-gradient-to-br from-siso-text/5 to-transparent border border-siso-text/10 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-siso-orange" />
          <AlertDescription className="text-siso-text/90">
            <span className="font-semibold text-siso-text">GPT Tools:</span> Explore popular GPT builder tools with millions of conversations.
          </AlertDescription>
        </Alert>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Alert className="bg-gradient-to-br from-siso-text/5 to-transparent border border-siso-text/10 backdrop-blur-sm">
          <Filter className="h-4 w-4 text-siso-orange" />
          <AlertDescription className="text-siso-text/90">
            <span className="font-semibold text-siso-text">Quick Access:</span> Filter by type or browse featured assistants to find the perfect AI helper.
          </AlertDescription>
        </Alert>
      </motion.div>
    </div>
  );
}
