
import { motion } from 'framer-motion';

export const KnowledgeStream = () => (
  <div className="absolute left-1/2 top-0 bottom-0 w-12 -translate-x-1/2 overflow-hidden">
    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-siso-orange/20 via-siso-orange to-siso-red" />
    <div className="absolute inset-0">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-siso-orange/50"
          initial={{ y: "100%", x: "50%" }}
          animate={{ 
            y: "-10%",
            x: ["50%", `${45 + Math.random() * 10}%`, "50%"]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "linear",
            x: {
              duration: 1 + Math.random(),
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
      ))}
    </div>
  </div>
);
