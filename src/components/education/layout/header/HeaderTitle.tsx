
import { motion } from 'framer-motion';
import { GradientHeading } from '@/components/ui/gradient-heading';

export const HeaderTitle = () => {
  // [Analysis] Enhanced with typewriter effect and better brand colors
  const subtitleWords = "Discover expert educators, tutorials, and resources".split(" ");

  return (
    <motion.div 
      className="flex-1 space-y-6" // Increased spacing
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4"> {/* Increased gap */}
        <GradientHeading
          size="lg"
          className="!pb-2 tracking-tight text-4xl md:text-5xl" // Larger title
          variant="sunset" // Using sunset variant for red-orange theme
        >
          SISO Education Hub
        </GradientHeading>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-3 py-1.5 bg-gradient-to-r from-siso-red/20 to-siso-orange/20 rounded-full border border-siso-orange/30"
        >
          <span className="text-xs font-semibold text-siso-orange flex items-center gap-1.5">
            <span className="w-2 h-2 bg-siso-orange rounded-full animate-pulse" />
            Live Learning
          </span>
        </motion.div>
      </div>

      <div className="relative">
        {subtitleWords.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-1.5 text-xl text-siso-text/90 font-medium" // Increased text size and contrast
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

      {/* Action Buttons with Brand Colors */}
      <motion.div 
        className="flex flex-wrap gap-3 pt-4" // Better spacing
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          className="px-6 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 transition-opacity"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Learning
        </motion.button>
        <motion.button
          className="px-6 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-[#FF5722]/80 to-[#FFA726]/80 hover:opacity-90 transition-opacity"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Find Mentor
        </motion.button>
        <motion.button
          className="px-6 py-2.5 rounded-lg font-medium border-2 border-siso-orange/30 text-siso-orange bg-siso-orange/10 hover:bg-siso-orange/20 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Quick Guide
        </motion.button>
      </motion.div>

      {/* Popular Topics */}
      <motion.div 
        className="flex flex-wrap gap-2 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {['AI', 'Machine Learning', 'Web3', 'Cloud'].map((topic, i) => (
          <motion.span
            key={topic}
            className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-siso-red/10 to-siso-orange/10 
              border border-siso-orange/20 hover:border-siso-orange/40 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + (i * 0.1) }}
          >
            {topic}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};
