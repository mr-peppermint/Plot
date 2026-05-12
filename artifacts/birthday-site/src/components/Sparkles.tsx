import { useEffect, useRef } from 'react';

interface SparklesProps {
  count?: number;
  colors?: string[];
  className?: string;
}

export function Sparkles({ count = 12, colors = ['#FFD700', '#FFB6C1', '#D8BFD8', '#FFA07A'], className = '' }: SparklesProps) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 6 + 4,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 1.5,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {sparkles.map((s) => (
        <svg
          key={s.id}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
          className="animate-sparkle"
          viewBox="0 0 20 20"
          fill={s.color}
        >
          <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
        </svg>
      ))}
    </div>
  );
}

export function FloatingBalloons({ count = 5 }: { count?: number }) {
  const balloons = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${10 + (i / count) * 80}%`,
    color: ['#FF6B9D', '#FFD700', '#9B59B6', '#FF8C42', '#3DBECC'][i % 5],
    size: 28 + Math.random() * 18,
    delay: i * 0.4,
    duration: 4 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-0 animate-balloon"
          style={{
            left: b.left,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        >
          <svg
            width={b.size}
            height={b.size * 1.3}
            viewBox="0 0 40 55"
            fill="none"
          >
            <ellipse cx="20" cy="20" rx="18" ry="20" fill={b.color} opacity="0.85" />
            <ellipse cx="14" cy="13" rx="5" ry="4" fill="white" opacity="0.3" />
            <path d="M20 40 Q18 44 20 48 Q22 52 20 55" stroke={b.color} strokeWidth="1.5" fill="none" />
            <path d="M20 40 L20 42" stroke={b.color} strokeWidth="2" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export function ConfettiBurst() {
  const ref = useRef<HTMLDivElement>(null);
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: ['#FFD700', '#FF6B9D', '#9B59B6', '#3DBECC', '#FF8C42', '#FFF0A0'][i % 6],
    x: (Math.random() - 0.5) * 300,
    y: -(Math.random() * 200 + 50),
    rotation: Math.random() * 720,
    size: Math.random() * 8 + 4,
    shape: i % 3,
    delay: Math.random() * 0.5,
  }));

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-burst"
          style={{
            '--tx': `${p.x}px`,
            '--ty': `${p.y}px`,
            '--rot': `${p.rotation}deg`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        >
          {p.shape === 0 && (
            <div style={{ width: p.size, height: p.size, background: p.color, borderRadius: '50%' }} />
          )}
          {p.shape === 1 && (
            <div style={{ width: p.size, height: p.size * 0.5, background: p.color }} />
          )}
          {p.shape === 2 && (
            <svg width={p.size} height={p.size} viewBox="0 0 10 10">
              <polygon points="5,0 6,4 10,4 7,7 8,10 5,8 2,10 3,7 0,4 4,4" fill={p.color} />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
