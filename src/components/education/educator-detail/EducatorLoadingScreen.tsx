import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const loadingMessages = [
  { message: "🤖 Analyzing creator content...", duration: 2000 },
  { message: "📊 Finding most relevant videos...", duration: 2000 },
  { message: "⭐ Calculating engagement metrics...", duration: 2000 },
  { message: "🎯 Personalizing recommendations...", duration: 2000 }
];

export const EducatorLoadingScreen = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const rotateMessage = () => {
      setCurrentMessageIndex((prev) => {
        if (prev < loadingMessages.length - 1) {
          timeoutId = setTimeout(rotateMessage, loadingMessages[prev + 1].duration);
          return prev + 1;
        }
        return prev;
      });
    };

    timeoutId = setTimeout(rotateMessage, loadingMessages[0].duration);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center space-y-8">
      <div className="relative w-32 h-32">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-siso-orange to-siso-red opacity-75"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-siso-red border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
      
      <motion.div
        key={currentMessageIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-xl text-siso-text text-center"
      >
        {loadingMessages[currentMessageIndex].message}
      </motion.div>

      <div className="w-64 h-2 bg-siso-text/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-siso-orange to-siso-red"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: loadingMessages.reduce((acc, msg) => acc + msg.duration, 0) / 1000,
          }}
        />
      </div>
    </div>
  );
};