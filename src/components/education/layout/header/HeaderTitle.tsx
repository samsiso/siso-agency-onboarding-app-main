
import { motion } from 'framer-motion';
import { GradientHeading } from '@/components/ui/gradient-heading';

export const HeaderTitle = () => {
  // [Analysis] Enhanced with typewriter effect and live learning indicator
  const subtitleWords = "Discover expert educators, tutorials, and resources".split(" ");

  return (
    <motion.div 
      className="flex-1 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        <GradientHeading
          size="lg"
          variant="sunset"
          className="!pb-2 tracking-tight"
        >
          SISO Education Hub
        </GradientHeading>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-2 py-1 bg-green-500/20 rounded-full border border-green-500/30"
        >
          <span className="text-xs font-semibold text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Learning
          </span>
        </motion.div>
      </div>

      <div className="relative">
        {subtitleWords.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-1 text-lg text-siso-text/80 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.1,
              duration: 0.5,
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Popular Topics */}
      <motion.div 
        className="flex flex-wrap gap-2 pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {['AI', 'Machine Learning', 'Web3', 'Cloud'].map((topic, i) => (
          <motion.span
            key={topic}
            className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 + (i * 0.1) }}
          >
            {topic}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};
