import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wrench, Filter, Star, Code, Database, Bot, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';

export function ToolsCategories() {
  const categories = [
    { icon: <Code className="h-4 w-4 text-blue-500" />, title: "Development", description: "Tools for coding, AI, and technical tasks" },
    { icon: <Database className="h-4 w-4 text-green-500" />, title: "Database", description: "Data storage and management solutions" },
    { icon: <Workflow className="h-4 w-4 text-orange-500" />, title: "Automation", description: "Workflow automation tools" },
    { icon: <Bot className="h-4 w-4 text-purple-500" />, title: "GPT Builder", description: "AI and chatbot development tools" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {categories.map((category, index) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Alert className="bg-siso-text/5 border border-siso-text/10 transition-all duration-300 hover:bg-siso-text/10 hover:border-siso-text/20 cursor-pointer group">
            {category.icon}
            <AlertDescription className="text-siso-text/80">
              <span className="font-semibold text-siso-text group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange transition-all duration-300">
                {category.title}:
              </span>
              {" "}
              {category.description}
            </AlertDescription>
          </Alert>
        </motion.div>
      ))}
    </div>
  );
}