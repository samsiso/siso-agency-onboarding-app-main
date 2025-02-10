
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// [Analysis] Enhanced particle system with interactive light effects
interface NeonParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  intensity: number;
  pulse: number;
  pulseSpeed: number;
}

export function FloatingOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<NeonParticle[]>([]);
  const animationFrameId = useRef<number>();
  const mousePosition = useRef({ x: 0, y: 0 });
  const lastInteractionTime = useRef(Date.now());

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
      intensity: 0.5 + Math.random() * 0.5,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02
    });

    const drawParticle = (particle: NeonParticle) => {
      const timeSinceLastInteraction = Date.now() - lastInteractionTime.current;
      const interactionFade = Math.max(0, 1 - timeSinceLastInteraction / 2000);
      
      const distanceToMouse = Math.hypot(
        particle.x - mousePosition.current.x,
        particle.y - mousePosition.current.y
      );
      
      const interactionRadius = 200;
      const intensityBoost = Math.max(0, 1 - distanceToMouse / interactionRadius);
      
      particle.pulse += particle.pulseSpeed;
      const pulseIntensity = 0.2 + Math.sin(particle.pulse) * 0.1;
      
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * (1 + intensityBoost * 0.3)
      );
      
      const baseOpacity = particle.intensity * (0.12 + intensityBoost * 0.08 + pulseIntensity + interactionFade * 0.1);
      gradient.addColorStop(0, particle.color.replace('0.12', baseOpacity.toString()));
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      // Add glow effect
      if (intensityBoost > 0) {
        ctx.shadowColor = particle.color.replace('0.12', '1');
        ctx.shadowBlur = 20 * intensityBoost;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(particle.x, particle.y, particle.radius * (1 + intensityBoost * 0.3), 0, Math.PI * 2);
      ctx.fill();
    };

    const updateParticle = (particle: NeonParticle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Smooth wrapping at edges with fade effect
      const margin = particle.radius * 2;
      if (particle.x < -margin) particle.x = canvas.width + margin;
      if (particle.x > canvas.width + margin) particle.x = -margin;
      if (particle.y < -margin) particle.y = canvas.height + margin;
      if (particle.y > canvas.height + margin) particle.y = -margin;

      // Enhanced mouse interaction with smooth acceleration
      const dx = particle.x - mousePosition.current.x;
      const dy = particle.y - mousePosition.current.y;
      const distance = Math.hypot(dx, dy);
      
      if (distance < 200) {
        const angle = Math.atan2(dy, dx);
        const force = (200 - distance) * 0.002;
        const targetVx = Math.cos(angle) * force;
        const targetVy = Math.sin(angle) * force;
        
        // Smooth velocity transition
        particle.vx += (targetVx - particle.vx) * 0.1;
        particle.vy += (targetVy - particle.vy) * 0.1;
      }

      // Apply velocity dampening with minimum speed
      const speed = Math.hypot(particle.vx, particle.vy);
      if (speed > 0.01) {
        particle.vx *= 0.99;
        particle.vy *= 0.99;
      }

      drawParticle(particle);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create a dynamic gradient mesh background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(18, 18, 18, 0.8)');
      gradient.addColorStop(0.5, 'rgba(24, 24, 24, 0.85)');
      gradient.addColorStop(1, 'rgba(18, 18, 18, 0.8)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw light beam effect
      const timeSinceLastInteraction = Date.now() - lastInteractionTime.current;
      if (timeSinceLastInteraction < 1000) {
        const beamGradient = ctx.createRadialGradient(
          mousePosition.current.x,
          mousePosition.current.y,
          0,
          mousePosition.current.x,
          mousePosition.current.y,
          200
        );
        
        const opacity = Math.max(0, 1 - timeSinceLastInteraction / 1000);
        beamGradient.addColorStop(0, `rgba(255, 255, 255, ${0.1 * opacity})`);
        beamGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = beamGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      particles.current.forEach(updateParticle);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      lastInteractionTime.current = Date.now();
    };

    const handleTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mousePosition.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      lastInteractionTime.current = Date.now();
    };

    const init = () => {
      resizeCanvas();
      particles.current = Array.from({ length: 12 }, createParticle);
      animate();
    };

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchstart', handleTouch);
    init();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouch);
      canvas.removeEventListener('touchstart', handleTouch);
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
