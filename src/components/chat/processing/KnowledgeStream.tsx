
import { motion } from 'framer-motion';

export const KnowledgeStream = () => (
  <div className="absolute left-1/2 top-0 bottom-0 w-24 -translate-x-1/2 overflow-hidden">
    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-siso-orange/20 via-siso-orange to-siso-red" />
    <div className="absolute inset-0">
      {/* Fast particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`fast-${i}`}
          className="absolute w-1 h-1 rounded-full bg-siso-orange/70"
          initial={{ y: "100%", x: "50%" }}
          animate={{ 
            y: "-10%",
            x: ["50%", `${45 + Math.random() * 10}%`, "50%"]
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            delay: i * 0.2,
            ease: "linear",
            x: {
              duration: 0.8 + Math.random(),
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
      ))}
      {/* Slow, larger particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`slow-${i}`}
          className="absolute w-2 h-2 rounded-full bg-siso-orange/30"
          initial={{ y: "100%", x: "50%" }}
          animate={{ 
            y: "-10%",
            x: ["45%", "55%", "45%"]
          }}
          transition={{
            duration: 3 + Math.random(),
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear",
            x: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
      ))}
    </div>
  </div>
);
