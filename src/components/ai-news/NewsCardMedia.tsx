import { motion } from 'framer-motion';

interface NewsCardMediaProps {
  imageUrl: string;
  title: string;
}

export const NewsCardMedia = ({ imageUrl, title }: NewsCardMediaProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full sm:w-1/4 max-w-[300px] mx-auto sm:mx-0"
    >
      <div className="relative aspect-video overflow-hidden rounded-lg border border-siso-border">
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>
    </motion.div>
  );
};