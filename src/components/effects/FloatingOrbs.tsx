
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// [Analysis] Enhanced particle system with better performance and visual appeal
interface NeonParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  intensity: number;
}

export function FloatingOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<NeonParticle[]>([]);
  const animationFrameId = useRef<number>();
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): NeonParticle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 20 + Math.random() * 40,
      color: Math.random() > 0.5 ? 'rgba(255, 87, 34, 0.12)' : 'rgba(255, 167, 38, 0.12)',
      intensity: 0.5 + Math.random() * 0.5
    });

    const drawParticle = (particle: NeonParticle) => {
      const distanceToMouse = Math.hypot(
        particle.x - mousePosition.current.x,
        particle.y - mousePosition.current.y
      );
      
      const interactionRadius = 200;
      const intensityBoost = Math.max(0, 1 - distanceToMouse / interactionRadius);
      
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * (1 + intensityBoost * 0.3)
      );
      
      const baseOpacity = particle.intensity * (0.12 + intensityBoost * 0.08);
      gradient.addColorStop(0, particle.color.replace('0.12', baseOpacity.toString()));
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(particle.x, particle.y, particle.radius * (1 + intensityBoost * 0.3), 0, Math.PI * 2);
      ctx.fill();
    };

    const updateParticle = (particle: NeonParticle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Smooth wrapping at edges
      if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius;
      if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius;
      if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius;
      if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius;

      // Mouse interaction
      const dx = particle.x - mousePosition.current.x;
      const dy = particle.y - mousePosition.current.y;
      const distance = Math.hypot(dx, dy);
      
      if (distance < 200) {
        const angle = Math.atan2(dy, dx);
        const force = (200 - distance) * 0.001;
        particle.vx += Math.cos(angle) * force;
        particle.vy += Math.sin(angle) * force;
      }

      // Apply velocity dampening
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      drawParticle(particle);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create a gradient mesh background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(18, 18, 18, 0.8)');
      gradient.addColorStop(0.5, 'rgba(24, 24, 24, 0.85)');
      gradient.addColorStop(1, 'rgba(18, 18, 18, 0.8)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach(updateParticle);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const init = () => {
      resizeCanvas();
      particles.current = Array.from({ length: 12 }, createParticle);
      animate();
    };

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    init();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto"
      style={{ zIndex: -1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}
