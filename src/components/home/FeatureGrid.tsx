
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const featureItems = [
  {
    icon: Bot,
    title: "AI-Powered Research",
    description: "Get instant insights and answers powered by advanced AI technology"
  },
  {
    icon: Bot,
    title: "Resource Hub Access",
    description: "Access comprehensive resources and documentation"
  },
  {
    icon: Bot,
    title: "Social Integration",
    description: "Connect and collaborate with the SISO community"
  },
  {
    icon: Bot,
    title: "Automated Tools",
    description: "Streamline your workflow with automated solutions"
  }
];

export const FeatureGrid = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl"
    >
      {featureItems.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + index * 0.1 }}
          className="group relative overflow-hidden rounded-lg bg-black/20 border border-siso-text/10 p-6 hover:bg-black/30 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-siso-red/5 to-siso-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <feature.icon className="w-8 h-8 text-siso-orange mb-4" />
            <h3 className="text-lg font-semibold text-siso-text-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-siso-text/80">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
