import { useEffect, useRef } from 'react';

interface NeonParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export function FloatingOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<NeonParticle[]>([]);
  const animationFrameId = useRef<number>();

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
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 30 + Math.random() * 40,
      color: Math.random() > 0.5 ? 'rgba(255, 87, 34, 0.15)' : 'rgba(255, 167, 38, 0.15)'
    });

    const drawParticle = (particle: NeonParticle) => {
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const updateParticle = (particle: NeonParticle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.width) particle.vx = -particle.vx;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy = -particle.vy;

      drawParticle(particle);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach(updateParticle);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    const init = () => {
      resizeCanvas();
      particles.current = Array.from({ length: 8 }, createParticle);
      animate();
    };

    window.addEventListener('resize', resizeCanvas);
    init();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}