
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// [Analysis] Reading progress indicator that shows how far the user has scrolled
export const ReadingProgressBar = () => {
  const [readingProgress, setReadingProgress] = useState(0);
  
  useEffect(() => {
    const updateReadingProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      
      if (scrollHeight) {
        setReadingProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener('scroll', updateReadingProgress);
    
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ 
        scaleX: readingProgress / 100, 
        opacity: readingProgress > 0 ? 1 : 0 
      }}
      style={{ transformOrigin: 'left' }}
    />
  );
};
