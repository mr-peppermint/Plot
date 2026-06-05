import React from 'react';

interface SparklesProps {
  count?: number;
  colors?: string[];
  className?: string;
}

export function Sparkles({
  count = 12,
  colors = ['#F0A8BE', '#C4728A', '#CDB8F0', '#F5D0DC', '#B89CD8'],
  className = '',
}: SparklesProps) {
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
    color: ['#D4728A', '#B89CD8', '#E8A0B8', '#9B7FC8', '#F0A8BE'][i % 5],
    shineColor: ['#F0A8BE', '#CDB8F0', '#FFC8DC', '#C8A8E8', '#FFD6E4'][i % 5],
    size: 28 + Math.random() * 18,
    delay: i * 0.5,
    duration: 5 + Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-0 animate-balloon"
          style={{ left: b.left, animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s` }}
        >
          <svg width={b.size} height={b.size * 1.35} viewBox="0 0 40 54" fill="none">
            <ellipse cx="20" cy="20" rx="18" ry="20" fill={b.color} opacity="0.9" />
            <ellipse cx="13" cy="12" rx="5" ry="4" fill={b.shineColor} opacity="0.45" />
            <ellipse cx="20" cy="20" rx="18" ry="20" stroke={b.shineColor} strokeWidth="0.5" opacity="0.3" fill="none" />
            <path d="M20 40 Q18 44 20 48 Q22 52 20 54" stroke={b.color} strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export function ConfettiBurst() {
  const pieces = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    color: ['#F0A8BE', '#C4728A', '#CDB8F0', '#9B7FC8', '#F5D0DC', '#B89CD8', '#FFD6E4', '#E8A0B8'][i % 8],
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
          style={{ '--tx': `${p.x}px`, '--ty': `${p.y}px`, '--rot': `${p.rotation}deg`, animationDelay: `${p.delay}s` } as React.CSSProperties}
        >
          {p.shape === 0 && <div style={{ width: p.size, height: p.size, background: p.color, borderRadius: '50%', boxShadow: `0 0 6px ${p.color}88` }} />}
          {p.shape === 1 && <div style={{ width: p.size * 1.5, height: p.size * 0.5, background: p.color }} />}
          {p.shape === 2 && (
            <svg width={p.size} height={p.size} viewBox="0 0 20 18">
              <path d="M10 0 C10 0 0 6 0 11 C0 15 4.5 18 10 18 C15.5 18 20 15 20 11 C20 6 10 0 10 0Z" fill={p.color} />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
