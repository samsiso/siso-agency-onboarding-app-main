
import { motion } from 'framer-motion';

export function HeaderTitle() {
  return (
    <motion.div 
      className="text-center space-y-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text tracking-tight">
        ChatGPT Assistants & Tools
      </h1>
      <p className="text-lg sm:text-xl text-siso-text/80 leading-relaxed max-w-3xl mx-auto">
        Discover our curated collection of ChatGPT assistants and GPT builder tools 
        to streamline your workflow and boost productivity
      </p>
    </motion.div>
  );
}
