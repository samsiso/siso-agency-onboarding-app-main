
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Orb {
  id: number;
  size: number;
  x: number;
  y: number;
  color: string;
  duration: number;
  delay: number;
}

export function FloatingOrbs() {
  const [orbs, setOrbs] = useState<Orb[]>([]);

  useEffect(() => {
    // Create 5 random orbs
    const newOrbs = Array.from({ length: 5 }, (_, i) => {
      const colors = [
        'from-siso-red/5 to-siso-orange/5',
        'from-purple-500/5 to-blue-500/5',
        'from-blue-500/5 to-green-500/5',
        'from-green-500/5 to-yellow-500/5',
        'from-yellow-500/5 to-siso-red/5'
      ];
      
      return {
        id: i,
        size: Math.random() * 300 + 100,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[i % colors.length],
        duration: Math.random() * 20 + 10,
        delay: i * 2
      };
    });
    
    setOrbs(newOrbs);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map(orb => (
        <motion.div
          key={orb.id}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl opacity-30`}
          style={{
            width: orb.size,
            height: orb.size,
            x: `${orb.x}%`,
            y: `${orb.y}%`,
          }}
          animate={{
            x: [`${orb.x}%`, `${(orb.x + 30) % 100}%`, `${(orb.x + 15) % 100}%`, `${orb.x}%`],
            y: [`${orb.y}%`, `${(orb.y + 20) % 100}%`, `${(orb.y + 40) % 100}%`, `${orb.y}%`],
          }}
          transition={{
            duration: orb.duration,
            ease: "easeInOut",
            repeat: Infinity,
            delay: orb.delay,
            repeatType: "reverse"
          }}
        />
      ))}
    </div>
  );
}
