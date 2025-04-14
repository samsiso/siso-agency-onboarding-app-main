
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightProps {
  className?: string;
  size?: number;
}

export function Spotlight({ className, size = 700 }: SpotlightProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
    <div
      className={cn("absolute inset-0 z-0 overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0.5)}
    >
      <motion.div
        className="absolute -inset-px bg-[radial-gradient(var(--size)_circle_at_var(--x)_var(--y),rgba(255,87,34,0.15),transparent_80%)]"
        style={{
          '--x': `${position.x}px`,
          '--y': `${position.y}px`,
          '--size': `${size}px`,
          opacity: opacity,
        } as any}
        animate={{
          '--x': `${position.x}px`,
          '--y': `${position.y}px`,
          opacity: opacity,
        } as any}
        transition={{
          type: 'spring',
          damping: 15,
          stiffness: 300,
          mass: 0.1,
        }}
      />
    </div>
  );
}
