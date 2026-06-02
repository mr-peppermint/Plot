import React from 'react';

interface SparklesProps {
  count?: number;
  colors?: string[];
  className?: string;
}

export function Sparkles({
  count = 12,
  colors = ['#E8A020', '#4FC8F0', '#FFD860', '#FF4040', '#A8ECFF', '#FFB030'],
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
            filter: `drop-shadow(0 0 4px ${s.color}CC)`,
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

/* Floating spore particles — like the Upside Down, but beautiful */
export function FloatingSpores({ count = 18 }: { count?: number }) {
  const spores = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: ['#E8A020','#4FC8F0','#FFD860','#C8A8FF','#80E8FF','#FFAA30'][i % 6],
    size: 3 + Math.random() * 5,
    delay: Math.random() * 6,
    duration: 8 + Math.random() * 8,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {spores.map((s) => (
        <div
          key={s.id}
          className="absolute bottom-0 animate-spore"
          style={{
            left: s.left,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          <svg width={s.size} height={s.size * 2.2} viewBox="0 0 10 22" fill="none">
            <circle cx="5" cy="5" r="4.5" fill={s.color} opacity="0.8" />
            <line x1="5" y1="9" x2="5" y2="20" stroke={s.color} strokeWidth="1.2" opacity="0.5" />
            <line x1="5" y1="14" x2="1.5" y2="11" stroke={s.color} strokeWidth="0.8" opacity="0.4" />
            <line x1="5" y1="14" x2="8.5" y2="11" stroke={s.color} strokeWidth="0.8" opacity="0.4" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* Floating balloons — kept for closing section */
export function FloatingBalloons({ count = 5 }: { count?: number }) {
  const balloons = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${8 + (i / count) * 84}%`,
    color: ['#CC2020','#4FC8F0','#E8A020','#8040CC','#20B060'][i % 5],
    shineColor: ['#FF6060','#A8ECFF','#FFD860','#C090FF','#60E090'][i % 5],
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
            <ellipse cx="13" cy="12" rx="5" ry="4" fill={b.shineColor} opacity="0.4" />
            <ellipse cx="20" cy="20" rx="18" ry="20" stroke={b.shineColor} strokeWidth="0.5" opacity="0.25" fill="none" />
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
    color: ['#E8A020','#CC2020','#4FC8F0','#FFD860','#C8A8FF','#80E8FF','#FF6030','#FFFFFF'][i % 8],
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
          {p.shape === 0 && <div style={{ width: p.size, height: p.size, background: p.color, borderRadius: '50%', boxShadow: `0 0 6px ${p.color}99` }} />}
          {p.shape === 1 && <div style={{ width: p.size * 1.5, height: p.size * 0.5, background: p.color }} />}
          {p.shape === 2 && (
            <svg width={p.size} height={p.size} viewBox="0 0 20 20">
              <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" fill={p.color} />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
