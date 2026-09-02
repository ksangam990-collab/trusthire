import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../../store/themeStore';

export default function InteractiveMeshBackground() {
  const canvasRef = useRef(null);
  const { theme } = useThemeStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let isRunning = true;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    window.addEventListener('resize', handleResize);

    const isDark = theme === 'dark';
    const rawParticleCount = Math.floor((window.innerWidth * window.innerHeight) / 22000);
    const particleCount = Math.max(25, Math.min(rawParticleCount, 60));
    const particles = [];
    const maxDistance = 135 * dpr;

    const mouse = { x: -1000 * dpr, y: -1000 * dpr, targetX: -1000 * dpr, targetY: -1000 * dpr, radius: 170 * dpr };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX * dpr;
      mouse.targetY = e.clientY * dpr;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.targetX = e.touches[0].clientX * dpr;
        mouse.targetY = e.touches[0].clientY * dpr;
      }
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000 * dpr;
      mouse.targetY = -1000 * dpr;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const handleVisibilityChange = () => {
      isRunning = !document.hidden;
      if (isRunning) {
        render();
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45 * dpr,
        vy: (Math.random() - 0.5) * 0.45 * dpr,
        size: (Math.random() * 1.5 + 1) * dpr,
        pulse: Math.random() * Math.PI * 2
      });
    }

    const render = () => {
      if (!isRunning) return;

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse repelling physics
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < mouse.radius && distToMouse > 0) {
          const force = (mouse.radius - distToMouse) / mouse.radius;
          p.x -= (dx / distToMouse) * force * 2.2 * dpr;
          p.y -= (dy / distToMouse) * force * 2.2 * dpr;
        }

        // Draw particle node
        const pulseSize = p.size + Math.sin(p.pulse) * 0.3 * dpr;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.8 * dpr, pulseSize), 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.4)' : 'rgba(5, 150, 105, 0.28)';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.18 : 0.09);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark ? `rgba(16, 185, 129, ${alpha})` : `rgba(5, 150, 105, ${alpha})`;
            ctx.lineWidth = 0.75 * dpr;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}
