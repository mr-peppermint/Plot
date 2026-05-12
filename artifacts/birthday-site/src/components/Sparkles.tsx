import React from 'react';

interface SparklesProps {
  count?: number;
  colors?: string[];
  className?: string;
}

export function Sparkles({ count = 12, colors = ['#D4AF37', '#F5D98A', '#A080D8', '#6482DC', '#C8A2C8'], className = '' }: SparklesProps) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 4,
    duration: Math.random() * 2.5 + 1.5,
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
            filter: `drop-shadow(0 0 3px ${s.color}88)`,
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
    left: `${8 + (i / count) * 84}%`,
    color: ['#C9A84C', '#7232A0', '#1E3A8A', '#9B4F96', '#C9A84C'][i % 5],
    shineColor: ['#F5D98A', '#B090D0', '#6080C0', '#C880C0', '#F5D98A'][i % 5],
    size: 30 + Math.random() * 16,
    delay: i * 0.6,
    duration: 5 + Math.random() * 3,
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
          <svg width={b.size} height={b.size * 1.35} viewBox="0 0 40 54" fill="none">
            <ellipse cx="20" cy="20" rx="18" ry="20" fill={b.color} opacity="0.88" />
            <ellipse cx="14" cy="12" rx="5" ry="4" fill={b.shineColor} opacity="0.4" />
            <ellipse cx="20" cy="20" rx="18" ry="20" stroke={b.shineColor} strokeWidth="0.5" opacity="0.3" fill="none" />
            <path d="M20 40 Q18 44 20 48 Q22 52 20 54" stroke={b.color} strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export function ConfettiBurst() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: ['#D4AF37', '#F5D98A', '#7232A0', '#1E3A8A', '#9B4F96', '#C8A2C8', '#FFE9A0', '#A080D8'][i % 8],
    x: (Math.random() - 0.5) * 380,
    y: -(Math.random() * 240 + 60),
    rotation: Math.random() * 720,
    size: Math.random() * 10 + 4,
    shape: i % 3,
    delay: Math.random() * 0.7,
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
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
          {p.shape === 0 && <div style={{ width: p.size, height: p.size, background: p.color, borderRadius: '50%', boxShadow: `0 0 6px ${p.color}88` }} />}
          {p.shape === 1 && <div style={{ width: p.size * 1.6, height: p.size * 0.5, background: p.color }} />}
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
