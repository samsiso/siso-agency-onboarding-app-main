
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Brain } from 'lucide-react';

export function HeaderTitle() {
  const iconProps = {
    size: 24,
    className: "text-siso-text/40"
  };

  return (
    <motion.div 
      className="text-center space-y-6 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative inline-block">
        {/* Floating Icons */}
        <motion.div
          className="absolute -left-12 -top-8"
          animate={{ y: [-5, 5, -5], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles {...iconProps} />
        </motion.div>
        <motion.div
          className="absolute -right-12 -top-6"
          animate={{ y: [-4, 4, -4], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <MessageCircle {...iconProps} />
        </motion.div>
        <motion.div
          className="absolute right-0 bottom-0"
          animate={{ y: [-3, 3, -3], rotate: [0, 3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain {...iconProps} />
        </motion.div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl font-bold relative">
          <span className="bg-gradient-to-r from-[#9b87f5] via-[#7E69AB] to-[#6E59A5] 
            text-transparent bg-clip-text 
            animate-gradient bg-[length:200%_auto]
            [text-shadow:0_4px_12px_rgba(155,135,245,0.1)]">
            ChatGPT Assistants
          </span>
        </h1>
      </div>

      <motion.p 
        className="text-lg sm:text-xl text-siso-text/80 leading-relaxed max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Discover our curated collection of AI assistants to streamline your workflow 
        and boost productivity with the power of ChatGPT
      </motion.p>
    </motion.div>
  );
}
